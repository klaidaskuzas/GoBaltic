import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the message to a chat service
    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleChat}
        className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 bg-primary hover:bg-primary-700"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 h-96 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary text-white p-4 flex flex-row justify-between items-center">
            <CardTitle className="text-base font-semibold">Live Chat Support</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <div className="p-4 h-64 overflow-y-auto bg-gray-50">
            <div className="mb-4">
              <div className="bg-gray-200 rounded-lg p-3 inline-block max-w-xs">
                <p className="text-sm">Hello! How can we help you with your car transportation needs today?</p>
              </div>
              <div className="text-xs text-gray-500 mt-1">Support Agent • 10:30 AM</div>
            </div>
            {/* Chat messages would appear here */}
          </div>
          <CardContent className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow rounded-r-none text-sm"
              />
              <Button type="submit" className="rounded-l-none bg-primary hover:bg-primary-700">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveChat;
