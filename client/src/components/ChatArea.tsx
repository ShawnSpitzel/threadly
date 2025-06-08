import { useState, useRef, useEffect, useId } from "react";
import ChatMessage from "./ChatMessage.tsx";
import ChatInput from "./ChatInput.tsx";
import ChatNotification from "./ChatNotification.tsx";
import { isMessage, isNotification } from "@/utils/type-guards.tsx";
import { User, Message, Notification, ChatItem, ChatRoom as Chat } from "@/types/index.tsx";
import { useWebSocket } from "@/hooks/use-socket.tsx";
import { makeId } from "@/hooks/make-id.tsx";
interface ChatAreaProps {
  selectedChat: Chat;
  onChatUpdate?: (chatId: string, newHistory: ChatItem[]) => void;
}
const ChatArea = ({selectedChat, onChatUpdate} : ChatAreaProps) => {
  const { connect, sendMessage, messages, isConnected } = useWebSocket();
  const serverUrl = "http://localhost:8080";
  const user1Id = "user1";
  const user2Id = "user2";
  
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
    if (messages) {
      if(isNotification(messages)) {
        console.log("New notification sent:", messages);
      }
    }
  }, [messages]);


  useEffect(() => {
  let cancelled = false;
  
  const fetchChatHistory = async () => {
    if (!selectedChat?.id) return;
    try {
      const history = await getChatHistory(selectedChat.id);
      if (!cancelled) {
        setChatHistory(history);
        onChatUpdate(selectedChat.id, history);
      }
    } catch (error) {
      if (!cancelled) {
        console.error("Error fetching chat history:", error);
      }
    } 
  };
  
  fetchChatHistory();
  return () => {
    cancelled = true;
  };
}, [selectedChat?.id]);
  const messageRequest = async (message: ChatItem) => {
    try {
      const res = await fetch(`${serverUrl}/new-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      });
    }
    catch (error) {
      console.error("Error sending message:", error);
    }
  }
  const getChatHistory = async (chatId: string) => {
    try {
      const res = await fetch(`${serverUrl}/chatroom-messages?id=${chatId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch chat history");
      }
      const data: ChatItem[] = await res.json();
      console.log("Chat history fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }
  const handleSendMessage = (messageText: string) => {
    if (messageText.length > 0){
      const newMessage: Message = {
        messageType: "message",
        message: messageText,
        author: currentUser,
        channelId: selectedChat.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      sendMessage(JSON.stringify(newMessage));
      messageRequest(newMessage);
  }
  };

  const toggleUser = () => {
    setCurrentUserIndex(prev => prev === 0 ? 1 : 0);
  };

  return (
    // Header
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {selectedChat && selectedChat.id ? "Chat Id: " + selectedChat.id : "No Chat Selected"}
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
      {selectedChat && selectedChat.id ? (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-primary-50/30 to-neutral-50/30">
            <div className="max-w-4xl mx-auto">
              {chatHistory?.map((item) => {
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
          <ChatInput onSendMessage={handleSendMessage} />
        </>
      ) : (
        /* if no chat selected*/
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-primary-50/30 to-neutral-50/30">
          <div className="text-center p-8">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Chat Selected
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Select a chat from the sidebar to start messaging, or create a new chat to begin a conversation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;