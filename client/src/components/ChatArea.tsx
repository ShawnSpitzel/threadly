import { useState, useRef, useEffect, useId } from "react";
import ChatMessage from "./ChatMessage.tsx";
import ChatInput from "./ChatInput.tsx";
import ChatNotification from "./ChatNotification.tsx";
import { isMessage, isNotification } from "@/utils/type-guards.tsx";
import { User, Message, Notification, ChatItem, ChatRoom as Chat } from "@/types/index.tsx";
import { useWebSocket } from "@/hooks/use-socket.tsx";
import { makeId } from "@/hooks/make-id.tsx";
interface ChatAreaProps {
  chat: Chat;
}
const ChatArea = ({chat} : ChatAreaProps) => {
  const { connect, sendMessage, messages, isConnected } = useWebSocket();
  const user1Id = makeId();
  const user2Id = makeId();
  
  const [users, setUsers] = useState<User[]>([
    {
      id: user1Id,
      username: "Alex Chen",
      avatar: "https://avatars.githubusercontent.com/u/12345678?v=4"
    },
    {
      id: user2Id,
      username: "Assistant",
      avatar: "https://avatars.githubusercontent.com/u/12345678?v=4"
    }
  ]);

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const currentUser = users[currentUserIndex];

  useEffect(() => {
    connect();
  }, [connect]);

  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (messages.length > 0) {
      setChatHistory(messages);
    }
  }, [messages]);

  const handleSendMessage = (messageText: string) => {
    const id = makeId();
    const newMessage: Message = {
      id: id,
      message: messageText,
      author: currentUser,
      channel: { id: "1", title: "General", users: [], lastMessage: "", timestamp: "", chatHistory: chatHistory}, // Placeholder for channel
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };
    sendMessage(JSON.stringify(newMessage));
    setChatHistory(prev => [...prev, newMessage]);
  };

  const toggleUser = () => {
    setCurrentUserIndex(prev => prev === 0 ? 1 : 0);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {chat && chat.id ? "Chat Id: " + chat.id : "No Chat Selected"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Sending as:</span>
          <button
            onClick={toggleUser}
            className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200 transition-colors duration-200"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium text-blue-700">
              {currentUser.username}
            </span>
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-primary-50/30 to-neutral-50/30">
        <div className="max-w-4xl mx-auto">
          {chatHistory.map((item) => {
            if (isMessage(item)) {
              if (item.author.id === currentUser.id) {
                item.isUser = true;
              } else {
                item.isUser = false;
              }
              return (
                <ChatMessage
                  key={item.id}
                  message={item.message}
                  author={item.author}
                  timestamp={item.timestamp}
                  isUser={item.isUser}
                />
              );
            } else if (isNotification(item)) {
              return (
                <ChatNotification
                  key={item.id}
                  type={item.type === 'join' ? "join" : "leave"}
                  author={item.author}
                  timestamp={item.timestamp}
                />
              );
            }
            return null;
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatArea;