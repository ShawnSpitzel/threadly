
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { useState } from "react";
import { ChatRoom as Chat } from "@/types/index.tsx";
const Index = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const selectChat = (selectedChat: Chat) => {
    setChat(selectedChat);
  }
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-neutral-50 to-primary-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onSelectChat={selectChat}/>
        <ChatArea chat={chat}/>
      </div>
    </div>
  );
};

export default Index;
