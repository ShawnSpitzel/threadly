
import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-neutral-200 bg-white">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 p-2"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... Press Enter to send"
            className="min-h-[44px] max-h-32 resize-none pr-12 border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20 bg-neutral-50/50"
            rows={1}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 p-1 h-auto"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>
        <Button
          type="submit"
          disabled={!message.trim()}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:shadow-none p-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
