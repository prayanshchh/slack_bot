# Slack MCP Server

A Slack bot implementation using Model Context Protocol (MCP) that handles channel mentions and direct messages, integrating with OpenAI's LLM for intelligent responses.

## Architecture

The system consists of two main components:

1. **MCP Server** (`mcp_server.py`): A FastAPI-based server that implements the MCP protocol and handles:
   - Channel mentions (`on_tagged_in_channel`)
   - Direct messages (`on_dm_personally`)
   - Integration with OpenAI's LLM
   - Structured request/response handling

2. **Slack Events Handler** (`slack_events.py`): A Flask server that:
   - Receives Slack events
   - Forwards them to the MCP server
   - Handles Slack-specific event types

## Features

- MCP-compliant API endpoints
- Structured context handling for LLM interactions
- Support for both channel mentions and direct messages
- Thread-aware responses
- Error handling and logging
- Health check endpoint

## Setup

1. Create a new Slack App at https://api.slack.com/apps
   - Add the following bot token scopes:
     - `app_mentions:read`
     - `chat:write`
     - `im:history`
     - `im:write`
     - `channels:history`
     - `groups:history`
   - Enable Events Subscriptions
   - Set the Request URL to your deployed Slack Events Handler URL

2. Create a `.env` file with the following variables:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   OPENAI_API_KEY=your-openai-api-key
   MCP_SERVER_URL=http://localhost:8000  # or your deployed MCP server URL
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the servers:
   ```bash
   # Terminal 1 - Start MCP Server
   python mcp_server.py
   
   # Terminal 2 - Start Slack Events Handler
   python slack_events.py
   ```

## API Endpoints

### MCP Server Endpoints

- `POST /mcp/on_tagged_in_channel`: Handle channel mentions
- `POST /mcp/on_dm_personally`: Handle direct messages
- `POST /mcp/health`: Health check endpoint

### Slack Events Handler Endpoints

- `POST /slack/events`: Handle incoming Slack events

## Request/Response Format

### MCP Request Format
```json
{
    "type": "on_tagged_in_channel" | "on_dm_personally",
    "context": {
        "message": "user message",
        "channel": "channel_id",
        "user": "user_id",
        "thread_ts": "thread_timestamp",
        "event_ts": "event_timestamp"
    }
}
```

### MCP Response Format
```json
{
    "type": "response_type",
    "content": {
        "message": "response message"
    },
    "status": "success" | "error"
}
```