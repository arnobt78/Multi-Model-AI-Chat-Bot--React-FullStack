import { useEffect, useState } from "react";
import ChatBotStart from "./Components/ChatBotStart";
import ChatBotApp from "./Components/ChatBotApp";
import BusinessInsights from "./Components/BusinessInsights";
import { v4 as uuidv4 } from "uuid";

interface Message {
  type: "prompt" | "response";
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  displayId: string;
  messages: Message[];
}

const App = () => {
  const [currentView, setCurrentView] = useState<"start" | "chat" | "insights">(
    "start"
  );
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    const storedChats: Chat[] = JSON.parse(
      localStorage.getItem("chats") || "[]"
    );
    setChats(storedChats);

    if (storedChats.length > 0) {
      setActiveChat(storedChats[0].id);
    }
  }, []);

  const handleStartChat = () => {
    setCurrentView("chat");

    if (chats.length === 0) {
      createNewChat();
    }
  };

  const createNewChat = (initialMessage: string = "") => {
    const newChat: Chat = {
      id: uuidv4(),
      displayId: `Chat ${new Date().toLocaleDateString(
        "en-GB"
      )} ${new Date().toLocaleTimeString()}`,
      messages: initialMessage
        ? [
            {
              type: "prompt" as const,
              text: initialMessage,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]
        : [],
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    localStorage.setItem("chats", JSON.stringify(updatedChats));
    localStorage.setItem(newChat.id, JSON.stringify(newChat.messages));
    setActiveChat(newChat.id);
  };

  return (
    <div className="container">
      {currentView === "start" && (
        <ChatBotStart onStartChat={handleStartChat} />
      )}
      {currentView === "chat" && (
        <ChatBotApp
          chats={chats}
          setChats={setChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onNewChat={createNewChat}
          onNavigateToInsights={() => setCurrentView("insights")}
        />
      )}
      {currentView === "insights" && (
        <BusinessInsights onBack={() => setCurrentView("chat")} />
      )}
    </div>
  );
};

export default App;

export type { Message, Chat };
