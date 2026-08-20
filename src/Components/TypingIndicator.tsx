/**
 * Shown while waiting for the first SSE chat token — pulsing "Thinking" + cycling dots.
 */
import React, { useEffect, useState } from "react";
import "./TypingIndicator.css";

const DOT_FRAMES = [".", "..", "..."] as const;

const TypingIndicator: React.FC = () => {
  const [dotFrame, setDotFrame] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setDotFrame((prev) => (prev + 1) % DOT_FRAMES.length);
    }, 400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="typing-indicator" aria-live="polite" aria-label="Thinking">
      <span className="typing-text">Thinking</span>
      <span className="typing-dots" aria-hidden="true">
        {DOT_FRAMES[dotFrame]}
      </span>
    </div>
  );
};

export default TypingIndicator;
