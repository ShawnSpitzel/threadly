import { User } from "@/types";
import { User as UserIcon, Bot as BotIcon } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
  authorId: string;
  timestamp: string;
  avatar?: string;
}

const ChatMessage = ({
  message,
  isUser,
  timestamp,
  authorId,
  avatar,
}: ChatMessageProps) => {
  return (
    <div
      className={`flex items-start space-x-3 mb-6 animate-fade-in ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-neutral-500 to-neutral-600"
            : "bg-gradient-to-br from-primary-500 to-primary-600"
        }`}
      >
        {isUser ? (
          <UserIcon className="w-4 h-4 text-white" />
        ) : (
          <UserIcon className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`flex-1 max-w-[70%] flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div className={`mb-1 ${isUser ? "text-right" : ""}`}>
          <span className="text-xs font-medium text-neutral-600">
            {authorId || (isUser ? "You" : "Assistant")}
          </span>
        </div>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? "bg-primary-600 text-white rounded-br-md"
              : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <span
          className={`text-xs text-neutral-400 mt-1 ${
            isUser ? "text-right" : ""
          }`}
        >
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
