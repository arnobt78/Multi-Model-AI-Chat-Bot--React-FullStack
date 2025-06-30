# OpenAI ChatBot (Chat History Feature) – React

![Screenshot 2024-09-27 at 15 19 41](https://github.com/user-attachments/assets/3a858fd0-4a58-4151-84da-49e20efc0c13) ![Screenshot 2024-09-27 at 15 20 39](https://github.com/user-attachments/assets/ea510f08-384c-4244-b5cc-ac2daaa60183) ![Screenshot 2024-09-27 at 15 20 56](https://github.com/user-attachments/assets/e7223e1b-799c-4ffe-b41b-0ecbf960b5c7)

---

## Project Summary

**OpenAI-ChatBot--ReactVite** is a modern, production-ready AI Chatbot web application. Built with React and Vite, it leverages the OpenAI GPT API for smart, multi-turn conversations—demonstrating a complete, secure, and scalable chatbot solution for web. This project is crafted for developers and learners to explore AI chat integration, modular React frontends, secure API usage, and rapid deployment with Vite.

- **Live Demo:** https://ai-chat-bot-arnob.vercel.app/

This repository is perfect for:
- **Learning:** Study a real-world React + Vite codebase with OpenAI integration.
- **Customization:** Build your own AI chatbot or extend features easily.
- **Deployment:** Ready for Vercel or any Node.js-friendly host.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [.env Setup](#env-setup)
- [Component and API Walkthrough](#component-and-api-walkthrough)
- [How it Works](#how-it-works)
- [Project Keywords](#project-keywords)
- [Example Code & Usage](#example-code--usage)
- [Resources & Documentation](#resources--documentation)
- [Notes](#notes)
- [Conclusion](#conclusion)

---

## Features

- **Modern UI with React + Vite:** Fast, modular, and easy-to-extend codebase.
- **OpenAI GPT Integration:** Real AI-powered conversations using the OpenAI API.
- **Chat History & Multi-Chat:** View previous conversations and create new chats easily.
- **Emoji Support:** Seamless emoji picker with [emoji-mart](https://www.npmjs.com/package/@emoji-mart/react).
- **Unique Chat IDs:** Each chat session uses a UUID for robust, unique identification.
- **Environment Variable Support:** Secure API key management via `.env`.
- **Deployable on Vercel:** Optimized for rapid deployment and scalability.
- **Easy to Customize:** Modular component structure and clear code separation.
- **Responsive Design:** Works well on desktop and mobile devices.

---

## Project Structure

```
/OpenAI-ChatBot--ReactVite
│
├── public/                # Static assets (favicon, images, etc.)
├── src/
│   ├── Components/        # Main React components for UI (Chat, ChatList, EmojiPicker, etc.)
│   ├── App.jsx            # Main App component (renders layout, routing, logic, state)
│   ├── main.jsx           # React/Vite entry point
│   ├── index.css          # Base styles
│   └── ...                # Other source files
├── .env                   # Your environment variables (not committed)
├── .eslintrc.cjs          # ESLint configuration for code quality
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Dependency lockfile
├── vite.config.js         # Vite configuration (build, dev server, plugins)
├── index.html             # Main HTML template
└── README.md              # This documentation
```

### Notable Folders & Files

- **src/Components/**: Contains all UI pieces, e.g. Chat window, ChatList for conversation history, EmojiPicker, etc.
- **App.jsx**: Application root, manages global state, chat logic, and layout.
- **main.jsx**: Entry point, bootstraps React app.
- **vite.config.js**: Vite project config for fast builds and hot reloads.
- **.env**: Store your OpenAI API key securely (not committed).

---

## Technology Stack

- **Frontend:** React, Vite
- **AI/Backend:** [OpenAI API](https://platform.openai.com/docs/api-reference)
- **State Management:** React hooks and local state
- **Emoji Support:** [emoji-mart](https://www.npmjs.com/package/@emoji-mart/react)
- **Unique IDs:** [uuid](https://www.npmjs.com/package/uuid)
- **Deployment:** Vercel (or any Node.js hosting)
- **Styling:** CSS (customizable)

---

## Installation

Before running the app, ensure you have [Node.js](https://nodejs.org/en/) installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arnobt78/OpenAI-ChatBot--ReactVite.git
   cd OpenAI-ChatBot--ReactVite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install required packages individually (if needed):**
   ```bash
   npm i openai
   npm i @emoji-mart/data
   npm i @emoji-mart/react
   npm i uuid
   ```

---

## Running the Project

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:5173/
   ```

---

## .env Setup

Create a `.env` file in the root of your project to store sensitive keys like your OpenAI API key.

**Example `.env` file:**
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```
> ⚠️ **Note:** The provided example key may be expired. Please generate your own from your OpenAI account.

---

## Component and API Walkthrough

### Main Components

- **App.jsx**: The top-level component. Handles app layout, routing, and high-level state such as chat history and selected chat.
- **Components/Chat.jsx**: Core chat interface where user messages and AI responses are displayed.
- **Components/ChatList.jsx**: Sidebar for listing chat sessions (past and present), allows switching between conversations.
- **Components/EmojiPicker.jsx**: Lets users easily insert emojis into messages.
- **Components/MessageBubble.jsx**: Displays individual chat bubbles for user and AI.

### APIs & Utilities

- **OpenAI API**: Used to generate chat responses. All calls are securely proxied using your API key from `.env`.
- **UUID**: Generates unique IDs for each chat session.
- **Helpers/Utils**: Additional functions for formatting, local storage management, etc.

---

## How it Works

1. **User types a message** into the chat input.
2. **Chat message is added** to the active conversation state.
3. **App sends the message** to the OpenAI API using your API key via a fetch/XHR call.
4. **AI response is received** and appended to the chat.
5. **Chat history is maintained** and viewable in the sidebar.
6. **Users can start new chats** (each gets a unique UUID).
7. **Emoji picker** allows for expressive messaging.
8. **All sensitive keys** are managed via `.env` and never committed to the codebase.

---

## Project Keywords

- OpenAI
- ChatGPT
- React
- Vite
- Emoji-Mart
- Vercel
- UUID
- AI Chatbot
- Chat History
- Multi-Chat
- Environment Variables
- Modern Web App

---

## Example Code & Usage

### Sending a Message to OpenAI

```js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getAIResponse(userMessage) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userMessage }],
  });
  return response.data.choices[0].message.content;
}
```

### Adding Emoji Support

```jsx
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

<Picker data={data} onEmojiSelect={addEmojiToInput} />
```

### Creating a New Chat Session

```js
import { v4 as uuidv4 } from 'uuid';

const newChat = {
  id: uuidv4(),
  messages: [],
  createdAt: Date.now(),
};
```

---

## Resources & Documentation

- **OpenAI:**  
  - [OpenAI npm package](https://www.npmjs.com/package/openai)  
  - [API Authentication](https://platform.openai.com/docs/api-reference/authentication)  
  - [List Models](https://platform.openai.com/docs/api-reference/models/list)  
  - [Create Completions](https://platform.openai.com/docs/api-reference/completions/create)

- **Emoji-Mart:**  
  - [@emoji-mart/data](https://www.npmjs.com/package/@emoji-mart/data)  
  - [@emoji-mart/react](https://www.npmjs.com/package/@emoji-mart/react)  

- **UUID:**  
  - [uuid npm package](https://www.npmjs.com/package/uuid)

---

## Notes

- For the latest features or issues, feel free to submit an issue or PR.
- The screenshots above illustrate the UI and its features.
- The OpenAI API key must be valid and active for the chatbot to function.
- All code is modular and commented for learning and extension.

---

## Conclusion

This project is a great starting point for anyone looking to learn about AI chatbots, React architecture, API integration, and modern web app deployment. It’s designed both for practical use and as a teaching/learning resource. Explore, extend, and make it your own!

---

> _Happy Coding!_ 🎉  
> Thank you for checking out this project!
