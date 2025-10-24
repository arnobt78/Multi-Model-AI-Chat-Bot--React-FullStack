import React from "react";
import "./TypingIndicator.css";

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator">
      <span className="typing-text">Thinking & Typing</span>
      <span className="typing-dots">
        <span className="dot dot1">.</span>
        <span className="dot dot2">.</span>
        <span className="dot dot3">.</span>
      </span>
    </div>
  );
};

export default TypingIndicator;
