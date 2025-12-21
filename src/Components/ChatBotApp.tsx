import React, { useEffect, useRef, useState } from "react";
import "./ChatBotApp.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import type { Message, Chat } from "../App";
import { aiService } from "../services/aiService";
import { AIProvider, getAvailableProviders } from "../services/aiProviders";
import TypingIndicator from "./TypingIndicator";
import Tooltip from "./Tooltip";
import { useTypewriter } from "../hooks/useTypewriter";
import {
  BotMessageSquare,
  MessageCircleMore,
  MessageCirclePlus,
  XCircle,
  Menu,
  X,
  BarChart3,
} from "lucide-react";

interface ChatBotAppProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChat: string | null;
  setActiveChat: React.Dispatch<React.SetStateAction<string | null>>;
  onNewChat: (initialMessage?: string) => void;
  onNavigateToInsights: () => void;
}

interface EmojiData {
  native: string;
}

const ChatBotApp: React.FC<ChatBotAppProps> = ({
  chats,
  setChats,
  activeChat,
  setActiveChat,
  onNewChat,
  onNavigateToInsights,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isChatListCollapsed, setIsChatListCollapsed] =
    useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<
    AIProvider | undefined
  >(undefined);
  const [showProviderDropdown, setShowProviderDropdown] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { displayText: chatTitleText } = useTypewriter({
    text: "Chat with AI",
    speed: 100,
    delay: 500,
  });

  useEffect(() => {
    const activeChatObj = chats.find((chat) => chat.id === activeChat);
    setMessages(activeChatObj ? activeChatObj.messages : []);
  }, [activeChat, chats]);

  useEffect(() => {
    if (activeChat) {
      const storedMessages: Message[] = JSON.parse(
        localStorage.getItem(activeChat) || "[]"
      );
      setMessages(storedMessages);
    }
  }, [activeChat]);

  // Auto-dismiss error message after 7 seconds
  useEffect(() => {
    if (errorMessage) {
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      // Set new timeout to dismiss error after 7 seconds
      errorTimeoutRef.current = setTimeout(() => {
        setErrorMessage("");
      }, 7000);

      // Cleanup timeout on unmount or when errorMessage changes
      return () => {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
      };
    }
  }, [errorMessage]);

  // Function to manually dismiss error message
  const dismissError = () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    setErrorMessage("");
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".emoji")
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Close provider dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        providerDropdownRef.current &&
        !providerDropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".provider-btn")
      ) {
        setShowProviderDropdown(false);
      }
    };

    if (showProviderDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProviderDropdown]);

  const handleEmojiSelect = (emoji: EmojiData) => {
    setInputValue((prevInput) => prevInput + emoji.native);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Analytics tracking function
  const trackEvent = async (
    eventType: string,
    provider?: string,
    success?: boolean,
    duration?: number
  ) => {
    // In development, skip API calls - only works in production
    if (import.meta.env.DEV) {
      console.log("📊 Analytics tracking (dev mode):", {
        eventType,
        provider,
        success,
      });
      return;
    }

    try {
      const sessionId =
        localStorage.getItem("sessionId") ||
        (() => {
          const newSessionId = `session_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          localStorage.setItem("sessionId", newSessionId);
          return newSessionId;
        })();

      await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          eventType,
          provider: provider || null,
          success: success !== undefined ? success : true,
          duration: duration || null,
          metadata: JSON.stringify({ timestamp: new Date().toISOString() }),
        }),
      });
    } catch (error) {
      // Silently fail - don't interrupt user experience
      // console.error("Failed to track event:", error);
    }
  };

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = inputValue;
    const newMessage: Message = {
      type: "prompt",
      text: userMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (!activeChat) {
      onNewChat(userMessage);
      setInputValue("");
    } else {
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem(activeChat, JSON.stringify(updatedMessages));
      setInputValue("");
      setErrorMessage("");

      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      });
      setChats(updatedChats);
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      setIsTyping(true);

      const startTime = Date.now();

      try {
        // Use the new AI service with automatic fallback
        const aiResponse = await aiService.getChatResponse({
          message: userMessage,
          provider: selectedProvider,
        });

        const duration = Date.now() - startTime;

        if (aiResponse.success) {
          // Track successful API call
          await trackEvent("api_call", aiResponse.provider, true, duration);
          const newResponse: Message = {
            type: "response",
            text: aiResponse.content,
            timestamp: new Date().toLocaleTimeString(),
          };

          const updatedMessagesWithResponse = [...updatedMessages, newResponse];
          setMessages(updatedMessagesWithResponse);
          localStorage.setItem(
            activeChat,
            JSON.stringify(updatedMessagesWithResponse)
          );

          const updatedChatsWithResponse = chats.map((chat) => {
            if (chat.id === activeChat) {
              return { ...chat, messages: updatedMessagesWithResponse };
            }
            return chat;
          });
          setChats(updatedChatsWithResponse);
          localStorage.setItem(
            "chats",
            JSON.stringify(updatedChatsWithResponse)
          );

          // Show which provider was used
          console.log(`✅ Response from ${aiResponse.provider}`);
        } else {
          // Track failed API call
          await trackEvent(
            "api_call",
            aiResponse.provider || "unknown",
            false,
            duration
          );

          // Handle error - check if it's a rate limit error
          const isRateLimitError = aiResponse.error?.includes("rate limit") || 
                                  aiResponse.error?.includes("rate limit exceeded");
          
          let errorDisplayText = aiResponse.error || "Failed to get response from AI providers";
          
          // Format rate limit errors more user-friendly
          if (isRateLimitError) {
            errorDisplayText = `Sorry, ${aiResponse.provider} is currently rate-limited. Please select another AI provider (Groq, OpenRouter, or Hugging Face) from the dropdown menu, or try again later.`;
          }

          setErrorMessage(`Error: ${errorDisplayText}`);

          const errorResponse: Message = {
            type: "response",
            text: errorDisplayText,
            timestamp: new Date().toLocaleTimeString(),
          };

          const updatedMessagesWithError = [...updatedMessages, errorResponse];
          setMessages(updatedMessagesWithError);
          localStorage.setItem(
            activeChat,
            JSON.stringify(updatedMessagesWithError)
          );
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        await trackEvent("api_call", "unknown", false, duration);

        console.error("AI Service Error:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error occurred"
        );

        const errorResponse: Message = {
          type: "response",
          text: "Sorry, an unexpected error occurred. Please try again.",
          timestamp: new Date().toLocaleTimeString(),
        };

        const updatedMessagesWithError = [...updatedMessages, errorResponse];
        setMessages(updatedMessagesWithError);
        localStorage.setItem(
          activeChat,
          JSON.stringify(updatedMessagesWithError)
        );
      } finally {
        setIsTyping(false);
      }

      // Original OpenAI API code (commented out for future use)
      // const response = await fetch(
      //   "https://api.openai.com/v1/chat/completions",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      //     },
      //     body: JSON.stringify({
      //       model: "gpt-3.5-turbo",
      //       messages: [{ role: "user", content: inputValue }],
      //       max_tokens: 500,
      //     }),
      //   }
      // );

      // const data = await response.json();
      // const chatResponse = data.choices[0].message.content.trim();

      // const newResponse: Message = {
      //   type: "response",
      //   text: chatResponse,
      //   timestamp: new Date().toLocaleTimeString(),
      // };

      // const updatedMessagesWithResponse = [...updatedMessages, newResponse];
      // setMessages(updatedMessagesWithResponse);
      // localStorage.setItem(
      //   activeChat,
      //   JSON.stringify(updatedMessagesWithResponse)
      // );
      // setIsTyping(false);

      // const updatedChatsWithResponse = chats.map((chat) => {
      //   if (chat.id === activeChat) {
      //     return { ...chat, messages: updatedMessagesWithResponse };
      //   }
      //   return chat;
      // });
      // setChats(updatedChatsWithResponse);
      // localStorage.setItem("chats", JSON.stringify(updatedChatsWithResponse));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
  };

  const handleDeleteChat = (id: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);
    localStorage.setItem("chats", JSON.stringify(updatedChats));
    localStorage.removeItem(id);

    if (id === activeChat) {
      const newActiveChat = updatedChats.length > 0 ? updatedChats[0].id : null;
      setActiveChat(newActiveChat);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-app">
      {/* Chat List */}
      <div className={`chat-list ${isChatListCollapsed ? "collapsed" : ""}`}>
        <div className="chat-list-header">
          <h2>
            <MessageCircleMore size={28} />
            Chat List
          </h2>
          <Tooltip text="New Chat" position="bottom">
            <MessageCirclePlus
              size={24}
              className="new-chat"
              onClick={() => onNewChat()}
            />
          </Tooltip>
        </div>
        <div className="chat-list-items-wrapper">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-list-item ${
                chat.id === activeChat ? "active" : ""
              }`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <h4>{chat.displayId}</h4>
              <Tooltip text="Delete Chat" position="left">
                <XCircle
                  size={20}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                />
              </Tooltip>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Button - Always visible on mobile */}
      <Tooltip
        text={isChatListCollapsed ? "Show Chat List" : "Hide Chat List"}
        position="right"
      >
        <button
          className={`chat-list-toggle-btn ${
            isChatListCollapsed ? "collapsed" : ""
          }`}
          onClick={() => setIsChatListCollapsed(!isChatListCollapsed)}
        >
          {isChatListCollapsed ? <Menu size={28} /> : <X size={28} />}
        </button>
      </Tooltip>

      {/* Insights Button */}
      <Tooltip text="View Analytics" position="right">
        <button className="insights-toggle-btn" onClick={onNavigateToInsights}>
          <BarChart3 size={28} />
        </button>
      </Tooltip>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="chat-title">
          <div className="chat-title-left">
            <h3>
              <span className="chat-title-text">{chatTitleText}</span>
              {chatTitleText === "Chat with AI" && (
                <span className="typewriter-cursor">_</span>
              )}
            </h3>
          </div>
          <div className="chat-title-right">
            <div className="provider-selector-container">
              <span className="provider-label">Select AI Model:</span>
              <div className="provider-selector">
                <Tooltip text="Select AI Model" position="bottom">
                  <button
                    className="provider-btn"
                    onClick={() =>
                      setShowProviderDropdown(!showProviderDropdown)
                    }
                  >
                    {selectedProvider ? (
                      `${
                        getAvailableProviders().find(
                          (p) => p.name === selectedProvider
                        )?.icon || ""
                      } ${
                        getAvailableProviders().find(
                          (p) => p.name === selectedProvider
                        )?.displayName || selectedProvider
                      }`
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <BotMessageSquare size={20} />
                        Auto
                      </span>
                    )}
                  </button>
                </Tooltip>
                {showProviderDropdown && (
                  <div className="provider-dropdown" ref={providerDropdownRef}>
                    <button
                      className={`provider-option ${
                        !selectedProvider ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedProvider(undefined);
                        setShowProviderDropdown(false);
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <BotMessageSquare size={18} />
                        Auto (Fallback)
                      </span>
                    </button>
                    {getAvailableProviders().map((provider) => (
                      <button
                        key={provider.name}
                        className={`provider-option ${
                          selectedProvider === provider.name ? "active" : ""
                        }`}
                        onClick={() => {
                          setSelectedProvider(provider.name as AIProvider);
                          setShowProviderDropdown(false);
                        }}
                      >
                        {provider.icon} {provider.displayName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {errorMessage && (
          <div className="error-message">
            <span>{errorMessage}</span>
            <button
              onClick={dismissError}
              className="error-close-button"
              aria-label="Close error message"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="chat">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.type === "prompt" ? "prompt" : "response"}
            >
              {msg.text} <span>{msg.timestamp}</span>
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef}></div>
        </div>

        {/* Message Form */}
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <Tooltip text="Emoji Picker" position="top">
            <i
              className="fa-solid fa-face-smile emoji"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            ></i>
          </Tooltip>
          {showEmojiPicker && (
            <div
              className="picker"
              ref={emojiPickerRef}
              style={{
                maxWidth:
                  window.innerWidth <= 640
                    ? "calc(100vw - 1rem)"
                    : window.innerWidth <= 900
                    ? "calc(100vw - 2rem)"
                    : "none",
                width:
                  window.innerWidth <= 640
                    ? "calc(100vw - 1rem)"
                    : window.innerWidth <= 900
                    ? "calc(100vw - 2rem)"
                    : "auto",
              }}
            >
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
          <input
            type="text"
            className="msg-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowEmojiPicker(false)}
          />
          <Tooltip text="Send Message" position="top">
            <i className="fa-solid fa-paper-plane" onClick={sendMessage}></i>
          </Tooltip>
        </form>
      </div>
    </div>
  );
};

export default ChatBotApp;
