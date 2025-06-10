# OpenAI ChatBot – ReactVite

![Screenshot 2024-09-27 at 15 19 41](https://github.com/user-attachments/assets/3a858fd0-4a58-4151-84da-49e20efc0c13) ![Screenshot 2024-09-27 at 15 20 39](https://github.com/user-attachments/assets/ea510f08-384c-4244-b5cc-ac2daaa60183) ![Screenshot 2024-09-27 at 15 20 56](https://github.com/user-attachments/assets/e7223e1b-799c-4ffe-b41b-0ecbf960b5c7)

## Project Overview

**OpenAI-ChatBot--ReactVite** is a modern, full-featured AI Chatbot built with React and Vite, leveraging the OpenAI GPT API for conversational AI. This project demonstrates a complete chatbot solution, including user-friendly features like chat history, emoji support, and easy deployment (tested on Vercel).

> **Live Demo:** https://ai-chat-bot-arnob.vercel.app/

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [.env Setup](#env-setup)
- [Project Keywords](#project-keywords)
- [Resources & Documentation](#resources--documentation)

---

## Features

- **Modern UI with React + Vite**: Fast, modular, and easy-to-extend codebase.
- **OpenAI GPT Integration**: Real AI-powered conversations using the OpenAI API.
- **Chat History & Multi-Chat**: View previous conversations and create new chats easily.
- **Emoji Support**: Seamless emoji picker with [emoji-mart](https://www.npmjs.com/package/@emoji-mart/react).
- **Unique Chat IDs**: Each chat session uses a UUID for robust, unique identification.
- **Environment Variable Support**: Secure API key management via `.env`.
- **Deployable on Vercel**: Optimized for rapid deployment and scalability.
- **Easy to Customize**: Modular component structure and clear code separation.
- **Responsive Design**: Works well on desktop and mobile devices.

---

## Project Structure

```
/OpenAI-ChatBot--ReactVite
│
├── public/                # Static assets (favicon, images, etc.)
├── src/
│   ├── components/        # React components (Chat, ChatList, EmojiPicker, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utilities (API handler, UUID, helpers)
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── ...                # Other source files
├── .env                   # Your environment variables (not committed)
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

---

## Technology Stack

- **Frontend**: React, Vite
- **AI/Backend**: [OpenAI API](https://platform.openai.com/docs/api-reference)
- **State Management**: React hooks and local state
- **Emoji Support**: [emoji-mart](https://www.npmjs.com/package/@emoji-mart/react)
- **Unique IDs**: [uuid](https://www.npmjs.com/package/uuid)
- **Deployment**: Vercel (or any Node.js hosting)
- **Styling**: CSS (customizable)

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

---

> _Happy Hacking!_
