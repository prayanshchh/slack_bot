import os
import json
import logging
import aiohttp
from typing import Dict, Any, Literal, List, Set
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from dotenv import load_dotenv
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from functools import lru_cache
import re
from datetime import datetime, timedelta

USER_RE = re.compile(r"<@([A-Z0-9]+)(\|[^>]+)?>")

# Add a set to track processed events
processed_events: Set[str] = set()

def get_event_key(event: Dict[str, Any]) -> str:
    """Create a unique event key using timestamp and user ID"""
    event_ts = event.get("event_ts")
    user_id = event.get("user")
    event_type = event.get("type")
    
    if not all([event_ts, user_id, event_type]):
        return None
        
    # Create a unique key using event type, timestamp, and user ID
    return f"{event_type}_{event_ts}_{user_id}"

def cleanup_old_events():
    """Clean up events older than 5 minutes"""
    current_time = datetime.now()
    global processed_events
    
    # Filter out old events
    processed_events = {
        event_key for event_key in processed_events 
        if current_time - datetime.fromtimestamp(float(event_key.split('_')[1])) < timedelta(minutes=5)
    }
    
    # Log the number of events we're tracking
    logger.debug(f"Currently tracking {len(processed_events)} events")

def lookup_username(uid: str) -> str:
    """Get username from user ID using users_info API"""
    try:
        info = slack_client.users_info(user=uid)
        if not info["ok"]:
            raise SlackApiError("Failed to get user info", info)
            
        user = info["user"]
        # Try different name fields in order of preference
        return (
            user.get("profile", {}).get("display_name")
            or user.get("profile", {}).get("real_name")
            or user.get("real_name")
            or user.get("name")
            or f"User_{uid[-4:]}"
        )
    except SlackApiError as e:
        logger.error(f"Error looking up username: {str(e)}")
        return f"User_{uid[-4:]}"

def replace_mentions(txt: str) -> str:
    return USER_RE.sub(lambda m: f"@{lookup_username(m.group(1))}", txt)

def resolve_channel_name(cid: str) -> str:
    try:
        info = slack_client.conversations_info(channel=cid)
        return info["channel"].get("name") or cid
    except SlackApiError:
        return cid

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize router instead of FastAPI app
router = APIRouter(prefix="/slack")

# Initialize Slack client
slack_client = WebClient(token=os.getenv("SLACK_BOT_TOKEN"))

MCP_SERVER_URL = "http://localhost:8000/api/v1/mcp"

# Define allowed event types
ALLOWED_EVENT_TYPES = Literal["app_mention", "message"]

async def get_user_info(user_id: str) -> Dict[str, Any]:
    """Get comprehensive user info from Slack including email"""
    try:
        user_info = slack_client.users_info(user=user_id)
        if not user_info["ok"]:
            raise SlackApiError("Failed to get user info", user_info)
            
        user = user_info["user"]
        profile = user.get("profile", {})
        
        return {
            "id": user_id,
            "name": (
                profile.get("display_name")
                or profile.get("real_name")
                or user.get("real_name")
                or user.get("name")
                or f"User_{user_id[-4:]}"
            ),
            "email": profile.get("email"),
            "is_bot": user.get("is_bot", False),
            "team_id": user.get("team_id"),
            "real_name": profile.get("real_name"),
            "display_name": profile.get("display_name")
        }
    except SlackApiError as e:
        logger.error(f"Error getting user info: {str(e)}")
        return {
            "id": user_id,
            "name": f"User_{user_id[-4:]}",
            "email": None,
            "is_bot": False
        }

async def get_channel_history(cid: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Get channel history with user info for each message"""
    try:
        result = slack_client.conversations_history(channel=cid, limit=limit)
    except SlackApiError as e:
        logger.error("history fetch failed: %s", e)
        return []

    out = []
    for m in result["messages"]:
        if m.get("bot_id") or not m.get("text"):
            continue
            
        # Get user info for each message
        user_info = await get_user_info(m.get("user", ""))
        text = replace_mentions(m["text"])
        
        out.append({
            "user": user_info,
            "text": text,
            "ts": m.get("ts"),
            "thread_ts": m.get("thread_ts")
        })
    return out

class SlackEvent(BaseModel):
    """Slack event model"""
    type: str
    token: str = None
    challenge: str = None
    event: Dict[str, Any] = None
    event_id: str = None
    event_time: int = None

    def is_duplicate_event(self) -> bool:
        """Check if this is a duplicate event we should ignore"""
        if not self.event:
            return False
            
        # Create a unique event identifier using type, timestamp, and user
        event_key = get_event_key(self.event)
        if not event_key:
            logger.warning("Could not create event key - missing required fields")
            return False
            
        # Clean up old events periodically
        cleanup_old_events()
        
        # Check if we've seen this exact event before
        if event_key in processed_events:
            logger.info(f"Ignoring duplicate event - type: {self.event.get('type')}, ts: {self.event.get('event_ts')}, user: {self.event.get('user')}")
            return True
            
        # Add this event to processed events
        processed_events.add(event_key)
        logger.info(f"New event - type: {self.event.get('type')}, ts: {self.event.get('event_ts')}, user: {self.event.get('user')}")
        return False

    def is_allowed_event(self) -> bool:
        if self.type == "url_verification":
            return True

        if self.type != "event_callback" or not self.event:
            return False

        inner = self.event
        inner_type = inner.get("type")
        
        # Log the full event for debugging
        logger.info(f"Event details - type: {inner_type}, subtype: {inner.get('subtype')}, channel_type: {inner.get('channel_type')}, event_ts: {inner.get('event_ts')}")
        
        # Filter out message subtypes (like message_changed, message_received)
        if inner_type == "message":
            # Only process direct messages that are not from bots
            return (inner.get("channel_type") == "im" and 
                   not inner.get("bot_id"))

        return inner_type == "app_mention"

async def forward_to_mcp(endpoint: str, body: dict) -> dict:
    """Forward event to MCP server using async HTTP"""
    async with aiohttp.ClientSession() as session:
        r = await session.post(f"{MCP_SERVER_URL}/{endpoint}", json=body)
        r.raise_for_status()
        return await r.json()

def get_other_user_in_dm(channel_id: str) -> str:
    """Get the ID of the other user in a DM conversation (not the bot)"""
    try:
        # Get conversation info with members
        conv_info = slack_client.conversations_info(
            channel=channel_id,
            include_num_members=True
        )
        if not conv_info["ok"]:
            raise SlackApiError("Failed to get conversation info", conv_info)
            
        # Get the bot's user ID
        bot_info = slack_client.auth_test()
        bot_id = bot_info["user_id"]
        
        # Get members of the conversation
        members_response = slack_client.conversations_members(channel=channel_id)
        if not members_response["ok"]:
            raise SlackApiError("Failed to get conversation members", members_response)
            
        members = members_response["members"]
        
        # First find the other user's ID (not the bot)
        other_user_id = None
        for user_id in members:
            if user_id != bot_id:
                other_user_id = user_id
                break
                
        if not other_user_id:
            raise SlackApiError("Could not find other user in DM", conv_info)
            
        # Verify this is not the bot by getting user info
        user_info = slack_client.users_info(user=other_user_id)
        if not user_info["ok"]:
            raise SlackApiError("Failed to get user info", user_info)
            
        # Double check this is not a bot
        if user_info["user"].get("is_bot"):
            raise SlackApiError("Found user is a bot", user_info)
            
        return other_user_id
        
    except SlackApiError as e:
        logger.error(f"Error getting other user in DM: {str(e)}")
        raise

@router.post("/events")
async def handle_slack_events(event: SlackEvent, response: Response):
    try:
        logger.info(f"Received Slack event of type: {event.type}")
        
        # Handle URL verification
        if event.type == "url_verification":
            logger.info("Handling URL verification request")
            if not event.challenge:
                logger.error("URL verification request missing challenge parameter")
                raise HTTPException(status_code=400, detail="Missing challenge parameter")
            return {"challenge": event.challenge}
        
        # Check for duplicate events
        if event.is_duplicate_event():
            logger.info(f"Ignoring duplicate event with timestamp: {event.event.get('event_ts') if event.event else 'unknown'}")
            response.status_code = 200
            return {"status": "ok", "detail": "Duplicate event ignored"}
        
        if not event.is_allowed_event():
            logger.warning(f"Received unallowed event type: {event.type}")
            raise HTTPException(
                status_code=400,
                detail="This endpoint only handles app mentions and direct messages"
            )
        
        # Acknowledge the event immediately
        response.status_code = 200
        
        # Handle events
        slack_event = event.event
        event_type = slack_event.get("type")
        
        if event_type == "app_mention":
            try:
                # Get user info for the person who mentioned the bot
                user_info = await get_user_info(slack_event["user"])
                
                # Extract message from the text, removing the mention
                raw = slack_event["text"]
                cleaned_msg = USER_RE.sub("", raw, count=1).strip()
                cid = slack_event["channel"]
                
                # Get channel history with user info
                history = await get_channel_history(cid)
                
                # Get channel info
                channel_info = slack_client.conversations_info(channel=cid)
                channel_name = channel_info["channel"].get("name") if channel_info["ok"] else cid

                payload = {
                    "message": cleaned_msg,
                    "context": {
                        "channel": {
                            "id": cid,
                            "name": channel_name,
                            "type": "channel"
                        },
                        "user": user_info,
                        "history": history,
                        "event_type": "app_mention",
                        "event_ts": slack_event.get("event_ts"),
                        "thread_ts": slack_event.get("thread_ts")
                    }
                }
                
                # Forward to MCP server
                await forward_to_mcp("on_tagged_in_channel", payload)
                
            except Exception as e:
                logger.error(f"Error processing channel mention: {str(e)}")                
                raise
            
        elif event_type == "message" and slack_event.get("channel_type") == "im":
            logger.info("Processing direct message event")
            try:
                # Get the ID of the person messaging the bot
                sender_id = get_other_user_in_dm(slack_event["channel"])
                
                # Get comprehensive user info
                user_info = await get_user_info(sender_id)
                
                # Get message history for the DM channel
                cid = slack_event["channel"]
                history = await get_channel_history(cid)
                
                payload = {
                    "message": slack_event["text"],
                    "context": {
                        "channel": {
                            "id": cid,
                            "name": "Direct Message",
                            "type": "dm"
                        },
                        "user": user_info,
                        "history": history,
                        "event_type": "direct_message",
                        "event_ts": slack_event.get("event_ts"),
                        "thread_ts": slack_event.get("thread_ts")
                    }
                }
                
                # Process the event asynchronously
                await forward_to_mcp("on_dm_personally", payload)
                
            except Exception as e:
                logger.error(f"Error processing direct message: {str(e)}")
                raise HTTPException(status_code=500, detail=str(e))
        
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"Error handling Slack event: {str(e)}")
        response.status_code = 200
        return {"status": "error", "detail": str(e)} 