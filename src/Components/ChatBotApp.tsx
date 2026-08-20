import React, { useEffect, useRef, useState } from "react";
import "./ChatBotApp.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import type { Message, Chat } from "../App";
import { aiService } from "../services/aiService";
import {
  AIProvider,
  fetchAvailableProviders,
  type ProviderConfig,
} from "../services/aiProviders";
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
  Copy,
  Check,
} from "lucide-react";
import { formatUserFacingError } from "../../shared/ai/formatError";

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
  const [availableProviders, setAvailableProviders] = useState<
    ProviderConfig[]
  >([]);
  const [showProviderDropdown, setShowProviderDropdown] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(
    null
  );
  const [sendRipples, setSendRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { displayText: chatTitleText, isComplete: chatTitleComplete } =
    useTypewriter({
      text: "Chat with AI",
      speed: 100,
      delay: 500,
    });

  // Load server-configured providers (no client API keys)
  useEffect(() => {
    let cancelled = false;
    fetchAvailableProviders().then((list) => {
      if (!cancelled) setAvailableProviders(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
    } catch {
      // Silently fail - don't interrupt user experience if analytics is unavailable
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
        // No empty bubble yet — show Thinking until the first stream delta
        let liveMessages = updatedMessages;
        let streamStarted = false;

        const persistMessages = (next: Message[]) => {
          const toStore = next.map(({ type, text, timestamp }) => ({
            type,
            text,
            timestamp,
          }));
          setMessages(next.map((m) => ({ ...m, streaming: false })));
          localStorage.setItem(activeChat, JSON.stringify(toStore));
          setChats((prev) => {
            const nextChats = prev.map((chat) =>
              chat.id === activeChat ? { ...chat, messages: toStore } : chat
            );
            localStorage.setItem("chats", JSON.stringify(nextChats));
            return nextChats;
          });
        };

        const streamResult = await aiService.streamChatResponse(
          {
            message: userMessage,
            provider: selectedProvider,
          },
          {
            onEvent: (event) => {
              if (event.type === "delta" && event.text) {
                if (!streamStarted) {
                  streamStarted = true;
                  setIsTyping(false);
                  liveMessages = [
                    ...updatedMessages,
                    {
                      type: "response",
                      text: event.text,
                      timestamp: new Date().toLocaleTimeString(),
                      streaming: true,
                    },
                  ];
                } else {
                  liveMessages = liveMessages.map((msg, i) =>
                    i === liveMessages.length - 1 && msg.type === "response"
                      ? {
                          ...msg,
                          text: msg.text + event.text,
                          streaming: true,
                        }
                      : msg
                  );
                }
                setMessages(liveMessages);
              }
            },
          }
        );

        const duration = Date.now() - startTime;

        if (streamResult.success) {
          await trackEvent("api_call", streamResult.provider, true, duration);
          // Ensure a response row exists even if deltas arrived only via aggregate content
          if (!streamStarted && streamResult.content) {
            liveMessages = [
              ...updatedMessages,
              {
                type: "response",
                text: streamResult.content,
                timestamp: new Date().toLocaleTimeString(),
                streaming: false,
              },
            ];
          }
          const finalMessages = liveMessages.map((msg, i) =>
            i === liveMessages.length - 1 && msg.type === "response"
              ? {
                  ...msg,
                  text: streamResult.content || msg.text,
                  streaming: false,
                }
              : msg
          );
          persistMessages(finalMessages);
        } else {
          await trackEvent(
            "api_call",
            streamResult.provider || "unknown",
            false,
            duration
          );

          const errorDisplayText = formatUserFacingError(
            streamResult.provider || "AI",
            streamResult.error || "Failed to get response from AI providers"
          );

          setErrorMessage(errorDisplayText);

          const errorMessages = [
            ...updatedMessages,
            {
              type: "response" as const,
              text: errorDisplayText,
              timestamp: new Date().toLocaleTimeString(),
              streaming: false,
            },
          ];
          persistMessages(errorMessages);
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

  // Scroll only the chat pane (avoids jumpy window-level smooth scroll)
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping]);

  const copyMessage = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageIndex(index);
      window.setTimeout(() => setCopiedMessageIndex(null), 1500);
    } catch {
      // Clipboard unavailable — ignore silently
    }
  };

  /** Spawn a short-lived ripple under the send icon, then send. */
  const handleSendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = Date.now();
    const ripple = {
      id,
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
    };
    setSendRipples((prev) => [...prev, ripple]);
    window.setTimeout(() => {
      setSendRipples((prev) => prev.filter((r) => r.id !== id));
    }, 550);
    void sendMessage();
  };

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
              {!chatTitleComplete && (
                <span className="typewriter-cursor" aria-hidden="true">
                  _
                </span>
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
                      <>
                        <span className="provider-btn-icon">
                          {availableProviders.find(
                            (p) => p.name === selectedProvider
                          )?.icon || ""}
                        </span>
                        <span className="provider-btn-label">
                          {availableProviders.find(
                            (p) => p.name === selectedProvider
                          )?.displayName || selectedProvider}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="provider-btn-icon">
                          <BotMessageSquare size={18} />
                        </span>
                        <span className="provider-btn-label">Auto</span>
                      </>
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
                      <span className="provider-option-icon">
                        <BotMessageSquare size={18} />
                      </span>
                      <span className="provider-option-label">
                        Auto (Fallback)
                      </span>
                    </button>
                    {availableProviders.map((provider) => (
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
                        <span className="provider-option-icon">
                          {provider.icon}
                        </span>
                        <span className="provider-option-label">
                          {provider.displayName}
                        </span>
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
        <div className="chat" ref={chatScrollRef}>
          {messages.map((msg, index) => (
            <div
              key={`${msg.timestamp}-${index}`}
              className={`message-row ${
                msg.type === "prompt"
                  ? "message-row-prompt"
                  : "message-row-response"
              }`}
            >
              <div
                className={`${msg.type === "prompt" ? "prompt" : "response"}${
                  msg.type === "response" && msg.streaming ? " streaming" : ""
                }`}
              >
                {msg.text}
              </div>
              <div className="message-meta">
                <time className="message-time">{msg.timestamp}</time>
                <Tooltip
                  text={
                    copiedMessageIndex === index ? "Copied" : "Copy message"
                  }
                  position="top"
                >
                  <button
                    type="button"
                    className="message-copy"
                    aria-label="Copy message"
                    onClick={() => copyMessage(msg.text, index)}
                  >
                    {copiedMessageIndex === index ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
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
            <button
              type="button"
              className="send-btn"
              aria-label="Send message"
              onClick={handleSendClick}
            >
              {sendRipples.map((r) => (
                <span
                  key={r.id}
                  className="send-ripple"
                  style={{
                    width: "4.4rem",
                    height: "4.4rem",
                    left: r.x,
                    top: r.y,
                  }}
                />
              ))}
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            </button>
          </Tooltip>
        </form>
      </div>
    </div>
  );
};

export default ChatBotApp;
