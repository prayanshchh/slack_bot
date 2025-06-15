import logging
from typing import Dict, Any, Optional, List, Literal
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.models.employee import Employee
from app.services.greyt_hr import GreytHRLeaveAPI
from app.core.prompts import get_hr_bot_prompt, LEAVE_POLICY
from app.core.config import get_settings

# Load environment variables
load_dotenv()

# Get settings
settings = get_settings()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter(prefix="/mcp")

# Initialize clients
slack_client = WebClient(token=settings.SLACK_BOT_TOKEN)
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# Add new imports and initialize database session
db = next(get_db())

# Initialize GreytHR leave API
leave_api = GreytHRLeaveAPI()

class UserInfo(BaseModel):
    """User information from Slack"""
    id: str
    name: str
    email: Optional[str]
    is_bot: bool = False
    team_id: Optional[str] = None
    real_name: Optional[str] = None
    display_name: Optional[str] = None

class ChannelInfo(BaseModel):
    """Channel information"""
    id: str
    name: str
    type: Literal["channel", "dm"]

class MessageContext(BaseModel):
    """Message context including user and channel info"""
    channel: ChannelInfo
    user: UserInfo
    history: List[Dict[str, Any]]
    event_type: Literal["app_mention", "direct_message"]
    event_ts: Optional[str] = None
    thread_ts: Optional[str] = None

class MCPRequest(BaseModel):
    """MCP request model with enhanced context"""
    message: str
    context: MessageContext

class MCPResponse(BaseModel):
    """MCP response model"""
    type: str
    content: Dict[str, Any]
    status: str = "success"

async def get_employee_by_email(email: str) -> Optional[Employee]:
    """Get employee record from database by email"""    
    return db.query(Employee).filter_by(email=email).first()

async def get_leave_info(employee: Employee) -> Dict[str, Any]:
    """Get all leave information for an employee"""
    try:
        print("employee in eave: ", employee)
        balance_data = await leave_api.get_leave_balance(db, employee)
        
        # Get leave transactions for last 30 days
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        transactions_data = await leave_api.get_leave_transactions(
            db, 
            employee,
            start_date,
            end_date
        )
        
        return {
            "balance": balance_data,
            "transactions": transactions_data,
            "last_updated": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching leave info: {str(e)}")
        return None

async def process_with_llm(message: str, context: MessageContext) -> str:
    """Process message with LLM using full context"""
    try:
        # Get user's email from context
        email = "manoj@webgility.com"
        if not email:
            return "Sorry, I couldn't find your email address in Slack. Please make sure your email is set in your Slack profile."

        # Get employee record from database
        employee = await get_employee_by_email(email)
        if not employee:
            return "Sorry, I couldn't find your employee record. Please contact HR to ensure your email is properly set up."

        # Get leave information
        leave_info = await get_leave_info(employee)
        if not leave_info:
            return f"Sorry {context.user.name}, I had trouble fetching your leave information. Please try again in a few minutes."

        # Format conversation history
        conversation_history = "\n".join([
            f"{msg['user']['name']}: {msg['text']}"
            for msg in context.history
        ])

        # Generate prompt using the new function
        prompt = get_hr_bot_prompt(
            user_name=context.user.name,
            channel_type=context.channel.type,
            conversation_history=conversation_history,
            user_message=message,
            leave_info=leave_info,
            leave_policy=LEAVE_POLICY
        )

        # Use LLM to generate response
        response = model.generate_content(prompt)
        return response.text.strip()
        
    except Exception as e:
        logger.error(f"Error processing with LLM: {str(e)}")
        return f"Sorry {context.user.name}, I encountered an error: {str(e)}"

@router.post("/on_tagged_in_channel")
async def handle_channel_mention(request: MCPRequest) -> MCPResponse:
    """Handle when bot is mentioned in a channel"""
    try:
        response_text = await process_with_llm(request.message, request.context)
        
        # Send response back to Slack
        try:
            slack_client.chat_postMessage(
                channel=request.context.channel.id,
                text=response_text,
                thread_ts=request.context.thread_ts
            )
            
            return MCPResponse(
                type="on_tagged_in_channel_response",
                content={"message": response_text}
            )
        except SlackApiError as e:
            logger.error(f"Slack API error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error sending message to Slack")
        
    except Exception as e:
        logger.error(f"Channel mention error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/on_dm_personally")
async def handle_direct_message(request: MCPRequest) -> MCPResponse:
    """Handle direct messages to the bot"""
    try:
        print("I AM REQUEST: ", request)
        response_text = await process_with_llm(request.message, request.context)
        
        # Send response back to Slack
        try:
            slack_client.chat_postMessage(
                channel=request.context.channel.id,
                text=response_text,
                thread_ts=request.context.thread_ts
            )
        except SlackApiError as e:
            logger.error(f"Slack API error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error sending message to Slack")
        
        return MCPResponse(
            type="on_dm_personally_response",
            content={"message": response_text}
        )
    except Exception as e:
        logger.error(f"DM error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/health")
async def health_check() -> MCPResponse:
    """Health check endpoint"""
    return MCPResponse(
        type="health_check",
        content={"status": "healthy"}
    ) 