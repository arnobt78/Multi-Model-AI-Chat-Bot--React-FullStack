import React from "react";
import "./ChatBotStart.css";
import { useTypewriter } from "../hooks/useTypewriter";
import { BotMessageSquare } from "lucide-react";

interface ChatBotStartProps {
  onStartChat: () => void;
}

const ChatBotStart: React.FC<ChatBotStartProps> = ({ onStartChat }) => {
  const { displayText: typewriterText, isComplete } = useTypewriter({
    text: "> INITIALIZING CHAT AI MULTI MODEL SYSTEM...",
    speed: 70,
    delay: 500,
  });

  const { displayText: subtitleText } = useTypewriter({
    text: "Powered by Gemini, Groq, OpenRouter, Hugging Face & OpenAI",
    speed: 50,
    delay: 3500,
  });

  return (
    <div className="start-page">
      <div className="start-page-bg">
        <img src="/chatbot.svg" alt="Chatbot" className="bg-chatbot-icon" />
      </div>
      <div className="animated-icon-container">
        <BotMessageSquare className="animated-icon" />
      </div>
      <div className="start-page-content">
        <div className="start-page-header">
          <div className="typewriter-container">
            <pre className="typewriter-text">
              {typewriterText}
              {isComplete && <span className="typewriter-cursor">_</span>}
            </pre>
          </div>
          {isComplete && (
            <div className="subtitle-text">
              {subtitleText}
              <span className="typewriter-cursor">_</span>
            </div>
          )}
        </div>
        {isComplete && (
          <button className="start-page-btn" onClick={onStartChat}>
            <span className="btn-icon">▶</span>
            <span className="btn-text">Get Started</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatBotStart;
