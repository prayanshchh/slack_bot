# Contributing to Slack Bot

Thank you for your interest in contributing to Slack Bot! This document provides guidelines and instructions for contributing to this project.

## Project Overview

Slack Bot is an intelligent HR assistant that helps employees manage their leave requests and HR-related queries through Slack. Here's how it works:

### Core Features
- **Leave Management**: Employees can check their leave balance, apply for leaves, and view leave history through natural conversations in Slack
- **AI-Powered Conversations**: Uses Google's Gemini AI to understand and respond to employee queries in a human-like manner
- **GreytHR Integration**: Seamlessly connects with GreytHR to fetch and update leave information
- **Multi-Channel Support**: Works in both direct messages and channel mentions

### How It Works
1. **Event Handling**:
   - Bot listens for messages in Slack channels and direct messages
   - Processes both @mentions and direct messages
   - Maintains conversation context for better understanding

2. **Leave Management Flow**:
   - Employees can ask about their leave balance: "What's my leave balance?"
   - Apply for leaves: "I want to apply for 2 days of sick leave"
   - Check leave history: "Show my leave history for last month"
   - The bot fetches real-time data from GreytHR

3. **AI Integration**:
   - Uses Gemini AI to understand natural language queries
   - Maintains conversation context for follow-up questions
   - Provides personalized responses based on employee data

4. **Data Flow**:
   ```
   Slack Message → Bot → AI Processing → GreytHR API → Response → Slack
   ```

### Technical Stack
- Backend: FastAPI (Python)
- Database: PostgreSQL
- AI: Google Gemini
- HR Integration: GreytHR API
- Frontend: React (for admin dashboard)

### Key Components
- `backend/app/api/endpoints/slack.py`: Handles Slack events and message processing
- `backend/app/api/endpoints/mcp.py`: Implements the Model Context Protocol for AI interactions
- `backend/app/services/greyt_hr.py`: Manages GreytHR API integration
- `backend/app/models/`: Database models for employees and companies

## How Can I Contribute?

### Reporting Bugs or Issues

- Check if the issue has already been reported in the Issues section
- Create a new issue with a clear title and description
- Include steps to reproduce the issue
- Include any relevant error messages or screenshots
- Specify your environment (OS, Python version, etc.)

### Suggesting New Features

- Check if the feature has already been suggested
- Create a new issue with the "enhancement" label
- Provide a clear description of the proposed feature
- Explain why this feature would be useful
- Include any relevant examples or use cases

### Pull Requests

1. **Create a New Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Update documentation if needed
   - Add comments for complex logic

3. **Commit Your Changes**
   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in event handling"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use a clear title and description
   - Link any related issues
   - Request reviews from maintainers

## Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks

## Getting Help

- Create a new issue for bugs
- Use discussions for questions
- Join our community chat (if available)