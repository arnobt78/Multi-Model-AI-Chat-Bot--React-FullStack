# AI Chat Hub - Universal Multi-Provider Assistant - React, TypeScript, Vite FullStack Project (Multi-Model AI Chatbot i

A modern, responsive AI chat bot application supporting multiple AI providers including Google Gemini, Groq, OpenRouter, Hugging Face, and OpenAI and enable to store the chat history in a list way in browser local storage options with unique chat id. Built with React, TypeScript, and Vite including Lucide icons, typewriter effect, tooltip system, and animated icons for the best user experience.

- **Live-Demo:** [https://multi-ai-chat-hub.vercel.app/](https://multi-ai-chat-hub.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Walkthrough](#project-walkthrough)
- [Component Details](#component-details)
- [API Integration](#api-integration)
- [Reusing Components](#reusing-components)
- [Deployment](#deployment)
- [Conclusion](#conclusion)

---

## Overview

AI Chat Hub is a comprehensive, production-ready chat application that integrates with multiple AI providers, offering users the flexibility to choose their preferred AI model or let the system automatically select the best available option. The application features a modern UI with dark theme, responsive design, chat history management, and real-time AI interactions.

---

## Features

### Core Functionalities

- **Multi-Provider AI Support**: Seamlessly switch between Google Gemini, Groq, OpenRouter, Hugging Face, and OpenAI
- **Auto Fallback System**: Automatic provider switching when one fails
- **Chat History Management**: Save and manage multiple conversation threads with local storage persistence
- **Real-time Typing Indicator**: Visual feedback when AI is processing
- **Emoji Picker**: Add emojis to messages with an intuitive picker interface
- **Business Insights Dashboard**: Real-time analytics and performance metrics for admin monitoring
- **Anonymous Session Tracking**: Track usage patterns, API calls, and user engagement without authentication
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark UI with gradient accents
- **Typewriter Effect**: Elegant text animation for enhanced user experience
- **Collapsible Sidebar**: Efficient space management on all screen sizes
- **Tooltip System**: Informative tooltips for better UX

---

## Technologies Used

### Frontend Framework & Libraries

- **React 18.3.1**: Modern UI library with hooks
- **TypeScript 5.6.3**: Type-safe JavaScript
- **Vite 7.1.12**: Fast build tool and dev server
- **Lucide React**: Modern icon library

### Backend & Database

- **Prisma ORM**: Type-safe database access
- **PostgreSQL (Neon)**: Serverless PostgreSQL database
- **Vercel Serverless Functions**: API endpoints for analytics

### UI Components & Assets

- **Emoji Mart**: Professional emoji picker component
- **Boxicons**: Modern icon library
- **Font Awesome**: Additional icon set

### Developer Tools

- **ESLint**: Code quality and linting
- **TypeScript ESLint**: TypeScript-specific linting rules

---

## Project Structure

```bash
ai-chat-bot/
├── api/                        # Vercel serverless functions
│   ├── events.ts              # POST /api/events - Track analytics events
│   ├── usage.ts               # GET /api/usage - Usage statistics
│   ├── insights.ts            # GET /api/insights - Provider analytics
│   ├── providers.ts           # GET /api/providers - Provider details
│   └── dashboard.ts           # GET /api/dashboard - All analytics data
├── prisma/
│   └── schema.prisma          # Database schema (PostgreSQL)
├── public/
│   ├── ai.svg                 # Background SVG
│   ├── chatbot.svg           # App icon
│   └── favicon.ico           # Browser favicon
├── src/
│   ├── Components/
│   │   ├── ChatBotApp.tsx    # Main chat interface
│   │   ├── ChatBotApp.css    # Chat styles
│   │   ├── ChatBotStart.tsx  # Welcome screen
│   │   ├── ChatBotStart.css # Welcome styles
│   │   ├── BusinessInsights.tsx  # Analytics dashboard
│   │   ├── BusinessInsights.css # Dashboard styles
│   │   ├── Tooltip.tsx       # Tooltip component
│   │   ├── Tooltip.css       # Tooltip styles
│   │   ├── TypingIndicator.tsx
│   │   └── TypingIndicator.css
│   ├── hooks/
│   │   └── useTypewriter.ts  # Typewriter animation hook
│   ├── services/
│   │   ├── aiService.ts       # AI API integration
│   │   └── aiProviders.ts    # Provider configurations
│   ├── App.tsx                # Root component
│   ├── main.tsx              # Entry point
│   ├── index.css             # Global styles
│   └── vite-env.d.ts         # TypeScript environment types
├── .env                       # Environment variables
├── index.html                # HTML template
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

---

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git (for cloning)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-chat-bot.git
   cd ai-chat-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** (See Configuration section below)

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

---

## Configuration

### Environment Variables Setup

Create a `.env` file in the root directory with your AI provider API keys and database connection:

```env
# Google Gemini AI API (1.5M free tokens/month)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Groq API (Fast Llama 3 - Always-free daily quota)
VITE_GROQ_API_KEY=your_groq_api_key_here

# OpenRouter API (Multi-model aggregator)
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Hugging Face Inference API
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# OpenAI API
VITE_OPENAI_API_KEY=your_openai_api_key_here

# PostgreSQL Database Connection (for Analytics)
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
```

**Note**: For local development, the analytics API endpoints will not work (they require Vercel deployment). The frontend will gracefully handle this with dev-mode guards.

### How to Get API Keys

#### Google Gemini API

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste into `.env` file

#### Groq API

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create and copy your API key

#### OpenRouter API

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Go to Keys section
4. Create a new key

#### Hugging Face API (Inference Providers)

**Important**: Hugging Face has migrated to a new Inference Providers API. The old endpoint is deprecated.

1. Visit [Hugging Face](https://huggingface.co/)
2. Create an account
3. Go to Settings > Access Tokens (or [hf.co/settings/tokens](https://hf.co/settings/tokens))
4. Create a **fine-grained token** with **"Make calls to Inference Providers"** permission
5. Copy and paste into `.env` file

**Note**: The app now uses the new OpenAI-compatible endpoint at `https://router.huggingface.co/v1/chat/completions` for better reliability and access to multiple models. The old `api-inference.huggingface.co` endpoint was deprecated in January 2025 and returns 404 errors. The app automatically tries 16 different free-tier models in order until one responds successfully (6 primary models + 10 fallback models).

#### OpenAI API

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new secret key

#### PostgreSQL Database (Neon)

The Business Insights feature requires a PostgreSQL database for storing analytics data.

1. Visit [Neon Console](https://neon.tech/)
2. Sign up for a free account (generous free tier)
3. Create a new project
4. Copy the connection string from your dashboard
5. Paste it into your `.env` file as `DATABASE_URL`

**Note**: The connection string format should be:
```
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
```

6. **Set up the database schema**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Important Notes

- ⚠️ **Never commit your `.env` file to version control**
- The `.env` file is already in `.gitignore`
- You can use any combination of providers (at least one is required)
- The app will automatically fallback to available providers if one fails
- The database is **only needed** for the Business Insights analytics feature
- Analytics tracking is **anonymous** and uses session-based tracking (no user accounts required)

---

## Usage

### Basic Usage

1. **Start the application**

   ```bash
   npm run dev
   ```

2. **Click "Get Started"** on the welcome screen

3. **Select AI Provider** from the dropdown menu in the header

4. **Type your message** in the input field

5. **Send message** by:
   - Pressing Enter key
   - Clicking the send button
   - Using the emoji picker to add emojis

### Advanced Features

- **Create New Chat**: Click the "+" button in the sidebar
- **Switch Between Chats**: Click on any chat in the sidebar
- **Delete Chat**: Click the "X" icon on any chat item
- **Toggle Sidebar**: Click the hamburger menu button
- **Auto Provider Selection**: Leave "Auto" selected for automatic fallback
- **Business Insights Dashboard**: Click the "📊 Insights" button in the header to view analytics

### Business Insights Dashboard

The Business Insights page provides comprehensive analytics and performance metrics:

#### Overview Tab
- Total events and sessions
- Recent activity (24h)
- Active sessions
- Storage usage
- Uptime indicator

#### Provider Analytics Tab
- API calls by provider
- Success/failure rates
- Average response times
- Provider performance comparison

#### Storage & Performance Tab
- Local storage usage
- Total messages and sessions
- Performance metrics

#### Usage Patterns Tab
- Most-used providers
- Success rates per provider
- Average response times
- Usage trends

#### Time & Trends Tab
- Hourly activity breakdown
- Peak usage times
- Daily event trends
- Visual activity charts

#### User Engagement Tab
- Average events per session
- Session duration
- Total conversations
- Engagement patterns

#### Error Monitoring Tab
- Total errors
- Errors by provider
- Overall success rate
- Error patterns

#### Performance Tab
- Fast/Normal/Slow request distribution
- Min/Median/Max duration
- Performance metrics

**Note**: The Business Insights feature requires Vercel deployment with a configured PostgreSQL database. It tracks anonymous session data and does not require user authentication.

---

## Project Walkthrough

### Architecture Flow

```bash
User Input → ChatBotApp Component → AI Service → Provider API → Response → Display
```

### State Management

The application uses React hooks for state management:

- **App.tsx**: Manages global chat state, active chat, and chat list
- **ChatBotApp.tsx**: Manages message state, input value, typing indicators
- **Local Storage**: Persists chat history and messages

### Data Flow

1. **Message Creation**: User types message → stored in state
2. **API Call**: Message sent to AI service → provider selected
3. **Response Handling**: AI response received → displayed to user
4. **Persistence**: All messages saved to localStorage
5. **Chat Management**: Multiple chats managed with unique IDs

### Component Hierarchy

```bash
App
├── ChatBotStart (Initial Screen)
└── ChatBotApp (Main Application)
    ├── Chat List Sidebar
    │   ├── Chat List Header
    │   └── Chat List Items
    └── Chat Window
        ├── Chat Header
        ├── Messages Area
        └── Input Area
            ├── Emoji Picker
            ├── Input Field
            └── Send Button
```

---

## Component Details

### ChatBotApp Component

**Location**: `src/Components/ChatBotApp.tsx`

**Purpose**: Main chat interface component

**Key Features**:

- Manages chat messages and input
- Handles AI provider selection
- Manages emoji picker visibility
- Controls sidebar collapse/expand
- Implements message sending and receiving

**Props**:

```typescript
interface ChatBotAppProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChat: string | null;
  setActiveChat: React.Dispatch<React.SetStateAction<string | null>>;
  onNewChat: (initialMessage?: string) => void;
}
```

**Key Methods**:

- `sendMessage()`: Sends message to AI and handles response
- `handleKeyDown()`: Handles Enter key press
- `handleEmojiSelect()`: Adds emoji to input
- `handleClickOutside()`: Closes dropdowns/pickers

### ChatBotStart Component

**Location**: `src/Components/ChatBotStart.tsx`

**Purpose**: Welcome screen with typewriter animation

**Key Features**:

- Animated typewriter effect
- "Get Started" button
- Gradient background with SVG

**Props**:

```typescript
interface ChatBotStartProps {
  onStartChat: () => void;
}
```

### Tooltip Component

**Location**: `src/Components/Tooltip.tsx`

**Purpose**: Reusable tooltip component

**Usage**:

```tsx
<Tooltip text="Tooltip text" position="top">
  <button>Hover me</button>
</Tooltip>
```

**Features**:

- Dynamic positioning
- Auto-adjustment for fixed elements
- Smooth animations
- Multiple positions (top, bottom, left, right)

### TypingIndicator Component

**Location**: `src/Components/TypingIndicator.tsx`

**Purpose**: Shows animated dots when AI is typing

### BusinessInsights Component

**Location**: `src/Components/BusinessInsights.tsx`

**Purpose**: Analytics dashboard for monitoring user activity and performance

**Key Features**:
- Real-time analytics from PostgreSQL database
- 8 different tabs for various metrics
- Anonymous session tracking
- Provider performance analytics
- Hourly activity charts
- Error monitoring

**Props**:
```typescript
interface BusinessInsightsProps {
  onBack: () => void;
}
```

**Tabs**:
1. **Overview**: Total events, sessions, storage, uptime
2. **Provider Analytics**: Per-provider statistics
3. **Storage & Performance**: Local storage and performance metrics
4. **Usage Patterns**: Provider usage trends
5. **Time & Trends**: Hourly/daily activity charts
6. **User Engagement**: Session metrics
7. **Error Monitoring**: Error tracking by provider
8. **Performance**: Request speed distribution

### useTypewriter Hook

**Location**: `src/hooks/useTypewriter.ts`

**Purpose**: Creates typewriter animation effect

**Usage**:

```typescript
const { displayText, isComplete } = useTypewriter({
  text: "Your text here",
  speed: 50,
  delay: 500,
});
```

**Features**:

- Configurable typing speed
- Optional delay before starting
- Returns completion status

---

## API Integration

### Analytics API Endpoints

The project includes serverless API endpoints for tracking and analytics:

**Location**: `api/` directory (Vercel serverless functions)

#### Available Endpoints

1. **POST `/api/events`**: Track analytics events
   - Records: API calls, success/failure, duration, provider
   - Creates/updates session records
   - Used by frontend to log all user interactions

2. **GET `/api/usage`**: Fetch usage statistics
   - Returns: Total events, sessions, recent activity
   - Aggregates session and event data

3. **GET `/api/insights`**: Fetch provider insights
   - Returns: Provider stats, success rates, daily trends
   - Calculates provider performance metrics

4. **GET `/api/providers`**: Fetch detailed provider data
   - Returns: Individual provider analytics
   - Includes: Total calls, success/failure counts, avg duration

5. **GET `/api/dashboard`**: Fetch all dashboard data
   - Returns: Combined data from all analytics endpoints
   - Single request for complete dashboard view

#### Database Schema

The analytics system uses PostgreSQL with the following schema:

```prisma
model Event {
  id        String    @id @default(uuid())
  sessionId String
  eventType String
  provider  String?
  success   Boolean   @default(true)
  duration  Int?      // Duration in milliseconds
  metadata  String?   // JSON string for additional data
  timestamp DateTime  @default(now())
}

model Session {
  sessionId String   @id @unique
  userAgent String?
  platform  String?
  startedAt DateTime @default(now())
  lastSeen  DateTime @updatedAt
}
```

### AI Service Architecture

**Location**: `src/services/aiService.ts`

**Purpose**: Centralized AI API integration with fallback mechanism

### Provider Configuration

**Location**: `src/services/aiProviders.ts`

**Purpose**: Defines all AI provider configurations

**Supported Providers**:

1. **Google Gemini** (`gemini-2.0-flash`)

   - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
   - Model: `gemini-2.0-flash`

2. **Groq** (`llama-3.1-8b-instant`)

   - Endpoint: `https://api.groq.com/openai/v1/chat/completions`
   - Model: `llama-3.1-8b-instant`

3. **OpenRouter** (`meta-llama/llama-3.2-3b-instruct:free`)

   - Endpoint: `https://openrouter.ai/api/v1/chat/completions`
   - Model: `meta-llama/llama-3.2-3b-instruct:free`

4. **Hugging Face** (16 models with fallback - New Inference Providers API)

   - Endpoint: `https://router.huggingface.co/v1/chat/completions` (OpenAI-compatible)
   - Primary Models: `meta-llama/Llama-3.1-8B-Instruct`, `mistralai/Mistral-7B-Instruct-v0.3`, `HuggingFaceH4/zephyr-7b-beta`, `tiiuae/falcon-7b-instruct`, `google/gemma-2b-it`, `NousResearch/Hermes-2-Pro-Mistral-7B`
   - Fallback Models: `mistralai/Mistral-7B-Instruct-v0.2`, `google/gemma-2b`, `google/gemma-7b`, `mistralai/Mixtral-8x7B-Instruct-v0.1`, `tiiuae/falcon-7b`, `microsoft/phi-1_5`, `bigscience/bloomz-560m`, `HuggingFaceH4/zephyr-7b-alpha`, `tiiuae/falcon-40b-instruct`, `facebook/bart-large-cnn`

5. **OpenAI** (`gpt-4o-mini`)
   - Endpoint: `https://api.openai.com/v1/responses`
   - Model: `gpt-4o-mini`

### Fallback Mechanism

The AI service automatically tries providers in this order:

1. Gemini
2. Groq
3. OpenRouter
4. Hugging Face
5. OpenAI

If one provider fails, it automatically tries the next available provider.

---

## Reusing Components

This project is designed with reusable components that can be easily integrated into other projects.

### Using the Tooltip Component

```tsx
import Tooltip from "./Components/Tooltip";

function MyComponent() {
  return (
    <Tooltip text="This is a tooltip" position="top">
      <button>Hover me</button>
    </Tooltip>
  );
}
```

### Using the Typewriter Hook

```tsx
import { useTypewriter } from "./hooks/useTypewriter";

function MyComponent() {
  const { displayText, isComplete } = useTypewriter({
    text: "Loading...",
    speed: 50,
    delay: 0,
  });

  return <div>{displayText}</div>;
}
```

### Using the AI Service

```tsx
import { aiService } from "./services/aiService";
import { AIProvider } from "./services/aiProviders";

async function sendMessage(message: string) {
  try {
    const response = await aiService.getChatResponse(message, "gemini");
    console.log(response.content);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Integration Example

Here's how to integrate this chat system into your own project:

1. **Copy the Components folder** to your project
2. **Copy the services folder** for AI integration
3. **Copy the hooks folder** for reusable hooks
4. **Update API keys** in your `.env` file
5. **Import and use** components as needed

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Set up Database**

   - Create a Neon PostgreSQL database
   - Copy your connection string
   - Update your `DATABASE_URL` in `.env`

3. **Deploy**

   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add all your API keys from `.env` file
   - **Important**: Add `DATABASE_URL` from your Neon database

5. **Run Database Migrations**

   After deployment, trigger a build that runs Prisma:
   
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Or add to your `package.json`:
   ```json
   "scripts": {
     "vercel-build": "prisma generate && prisma db push && npm run build"
   }
   ```

### Deploy to Netlify

1. **Connect GitHub repository** to Netlify
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`
4. **Add environment variables** in site settings

### Deploy to GitHub Pages

1. **Install gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script** to `package.json`

   ```json
   "deploy": "vite build && gh-pages -d dist"
   ```

3. **Run deploy**

   ```bash
   npm run deploy
   ```

---

## Conclusion

### Learning Outcomes

This project demonstrates:

- React component architecture and state management
- TypeScript type safety and interfaces
- API integration with multiple providers
- Responsive design principles
- Modern UI/UX patterns
- Local storage management
- Custom React hooks
- Error handling and fallback mechanisms
- Serverless API development (Vercel Functions)
- PostgreSQL database integration (Prisma ORM)
- Analytics and performance monitoring
- Anonymous session tracking

### Key Takeaways

- **Modular Architecture**: Well-organized component structure
- **Type Safety**: Leveraging TypeScript for better code quality
- **User Experience**: Smooth animations and responsive design
- **Scalability**: Easy to add new AI providers or features
- **Analytics**: Real-time performance monitoring with anonymous tracking
- **Full-Stack**: Complete solution with frontend, backend, and database
- **Best Practices**: Following React and TypeScript conventions

### Future Enhancements

- [x] Add analytics dashboard (Business Insights)
- [x] Implement anonymous session tracking
- [x] Add PostgreSQL database integration
- [ ] Add authentication system
- [ ] Implement user accounts
- [ ] Add message search functionality
- [ ] Create chat export feature
- [ ] Add voice input/output
- [ ] Implement markdown support
- [ ] Add code syntax highlighting
- [ ] Create mobile app version
- [ ] Add real-time charts and visualizations

---

## Happy Coding! 🎉

Feel free to use this project repository and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/).

**Enjoy building and learning!** 🚀

Thank you! 😊
