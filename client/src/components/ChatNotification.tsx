
import { User } from "@/types";
import { UserPlus, UserMinus } from "lucide-react";

interface ChatNotificationProps {
  type: "join" | "leave"
  authorId: string;
  timestamp: string;
}

const ChatNotification = ({ type, authorId, timestamp }: ChatNotificationProps) => {
  return (
    <div className="flex items-center justify-center mb-4 animate-fade-in">
      <div className="flex items-center space-x-2 px-4 py-2 bg-neutral-100 rounded-full border border-neutral-200">
        {type === "join" ? (
          <UserPlus className="w-3 h-3 text-primary-600" />
        ) : (
          <UserMinus className="w-3 h-3 text-neutral-500" />
        )}
        <span className="text-xs text-neutral-600">
          <span className="font-medium">{authorId}</span> {type === "join" ? 'joined' : 'left'} the conversation
        </span>
        <span className="text-xs text-neutral-400">
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default ChatNotification;