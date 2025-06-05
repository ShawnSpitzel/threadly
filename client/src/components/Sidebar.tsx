
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

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isActive?: boolean;
}

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState("1");

  const chats: Chat[] = [
    {
      id: "1",
      title: "Welcome...",
      lastMessage: "...",
      timestamp: "2m ago",
      isActive: true
    },
  ];

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
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`group p-3 mx-2 mb-1 rounded-xl cursor-pointer transition-all duration-200 ${
              activeChat === chat.id
                ? "bg-white shadow-sm border border-neutral-200"
                : "hover:bg-white/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <h3 className={`font-medium text-sm truncate ${
                    activeChat === chat.id ? "text-neutral-800" : "text-neutral-700"
                  }`}>
                    {chat.title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {chat.lastMessage}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {chat.timestamp}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
              >
                <MoreHorizontal className="w-3 h-3 text-neutral-400" />
              </Button>
            </div>
          </div>
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
