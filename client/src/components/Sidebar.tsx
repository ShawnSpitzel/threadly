
import { useState } from "react";

import { 
  Plus, 
  MessageSquare, 
  Settings, 
  Search,
  MoreHorizontal,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatRoom from "./ChatRoom";
import { ChatRoom as Chat} from "@/types";
import { makeId } from "@/hooks/make-id";
interface SidebarProps {
  onSelectChat: (chat: Chat) => void;
}
const Sidebar = ({onSelectChat}:SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const chats: Chat[] = [
    {
      id: makeId(),
      title: "Welcome...",  
      users: [],
      chatHistory: [],
      lastMessage: "...",
      timestamp: "2m ago",
      isActive: true
    },
    {
      id: makeId(),
      title: "Welcome...",
      lastMessage: "...",
       users: [],
      chatHistory: [],
      timestamp: "2m ago",
      isActive: true
    },
  ];

  const selectedChat = (chat: Chat) => {
    setActiveChat(chat);
    onSelectChat(chat);
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 h-full bg-neutral-50 border-r border-neutral-200 flex flex-col">
      <div className="p-4 border-b border-neutral-200">
        <Button 
          className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-all duration-200 hover:shadow-md"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {filteredChats.map((chat) => (
          <ChatRoom
            key={chat.id}
            chat={chat}
            isActive={chat.isActive}
            onClick={() => selectedChat(chat)}
          >
          </ChatRoom>
        ))}
      </div>
      <div className="p-4 border-t border-neutral-200 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
