
import { ChatRoom as Chat} from "@/types";
import { MessageSquare, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
interface ChatRoomProps {
    chat: Chat;
    isActive?: boolean;
    onClick: () => void;
    }

const ChatRoom = ({ 
  chat, 
  isActive, 
  onClick,
} : ChatRoomProps) => {
  return (
    <div
      onClick={() => onClick()}
      className={`group p-3 mx-2 mb-1 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-white shadow-sm border border-neutral-200"
          : "hover:bg-white/50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            <h3 className={`font-medium text-sm truncate ${
              isActive ? "text-neutral-800" : "text-neutral-700"
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
  );
};
export default ChatRoom;