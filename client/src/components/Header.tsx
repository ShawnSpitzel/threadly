
import { MessageCircle } from "lucide-react";
import logo from "@/images/threadly.png"; // Adjust the path as necessary

const Header = () => {
  return (
    <header className="h-16 border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Threadly Logo"
            className="text-white w-10 h-10 rounded-xl shadow-sm object-cover bg-gradient-to-br from-primary-500 to-primary-600"
          />
          <div>
            <h1 className="font-playfair font-semibold text-xl text-neutral-800 text-shadow">
              Threadly
            </h1>
            <p className="text-xs text-neutral-600 font-medium">v.0.1</p>
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
