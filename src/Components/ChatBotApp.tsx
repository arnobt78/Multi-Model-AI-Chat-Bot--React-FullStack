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

interface ChatBotAppProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChat: string | null;
  setActiveChat: React.Dispatch<React.SetStateAction<string | null>>;
  onNewChat: (initialMessage?: string) => void;
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

      try {
        // Use the new AI service with automatic fallback
        const aiResponse = await aiService.getChatResponse({
          message: userMessage,
          provider: selectedProvider,
        });

        if (aiResponse.success) {
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
          // Handle error
          setErrorMessage(
            `Error: ${
              aiResponse.error || "Failed to get response from AI providers"
            }`
          );

          const errorResponse: Message = {
            type: "response",
            text: `Sorry, I couldn't process your request. Error: ${
              aiResponse.error || "Unknown error"
            }`,
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
          <h2>Chat List</h2>
          <Tooltip text="New Chat" position="bottom">
            <i
              className="bx bx-edit-alt new-chat"
              onClick={() => onNewChat()}
            ></i>
          </Tooltip>
        </div>
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
              <i
                className="bx bx-x-circle"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
              ></i>
            </Tooltip>
          </div>
        ))}
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
          <i className={isChatListCollapsed ? "bx bx-menu" : "bx bx-x"}></i>
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
                    {selectedProvider
                      ? `${
                          getAvailableProviders().find(
                            (p) => p.name === selectedProvider
                          )?.icon || ""
                        } ${
                          getAvailableProviders().find(
                            (p) => p.name === selectedProvider
                          )?.displayName || selectedProvider
                        }`
                      : "⚡ Auto"}
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
                      ⚡ Auto (Fallback)
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
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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
