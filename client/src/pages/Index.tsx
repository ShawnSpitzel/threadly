
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-neutral-50 to-primary-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
};

export default Index;
