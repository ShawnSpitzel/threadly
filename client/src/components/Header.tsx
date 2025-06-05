
import { MessageCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="h-16 border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-sm">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-playfair font-semibold text-xl text-neutral-800 text-shadow">
              Chat App
            </h1>
            <p className="text-xs text-neutral-600 font-medium">Dick ass</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-neutral-600">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
