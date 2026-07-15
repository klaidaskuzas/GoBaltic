import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export default function DashboardAiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hello! I'm your logistics AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("chat");
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Display API key missing message instead of attempting API call
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: 
            "I'd like to help, but I need an OpenAI API key to function. " +
            "Please provide an API key in the environment variables to enable AI assistant functionality.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
        
        toast({
          title: "API Key Required",
          description: "OpenAI API key is required for this feature to work.",
          variant: "destructive",
        });
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: "Sorry, there was an error processing your request. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-gray-500">Get help with logistics management and more</p>
        </div>
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-4">
          <Card className="mb-4 h-[calc(100vh-300px)] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Chat with AI Assistant</CardTitle>
              <CardDescription>
                Ask questions about logistics, routes, pricing, or anything else you need help with
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-auto px-4 pb-0">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    
                    {message.role === "system" && (
                      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-amber-100 text-amber-600 mr-2">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : message.role === "system"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 text-right mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg px-4 py-2 max-w-[80%] bg-gray-100 text-gray-800">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-4 mt-auto">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Templates</CardTitle>
              <CardDescription>Use these templates to quickly get answers</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  title: "Route Optimization",
                  text: "What's the most efficient route for delivering vehicles from Vilnius to Berlin with stops in Warsaw and Poznan?",
                },
                {
                  title: "Pricing Estimate",
                  text: "Calculate the approximate cost for transporting a Mercedes-Benz E-Class from Rotterdam to Barcelona.",
                },
                {
                  title: "Delivery Timeline",
                  text: "What's the estimated delivery time for a vehicle shipment from Tallinn to Prague?",
                },
                {
                  title: "Customs Information",
                  text: "What documents are required for vehicle transport from Germany to Norway?",
                },
                {
                  title: "Vehicle Specifications",
                  text: "What's the weight and dimensions of a standard BMW 5-Series for transport planning?",
                },
                {
                  title: "Regulations Summary",
                  text: "Summarize the key EU regulations for commercial vehicle transportation across borders.",
                },
              ].map((template, index) => (
                <Card key={index} className="cursor-pointer hover:bg-slate-50" onClick={() => {
                  setInput(template.text);
                  setSelectedTab("chat");
                }}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-xs text-slate-500">{template.text}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Settings</CardTitle>
              <CardDescription>Configure your AI assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">API Configuration</h3>
                <p className="text-xs text-slate-500">
                  This feature requires an OpenAI API key. Please set the OPENAI_API_KEY environment variable.
                </p>
                <div className="rounded-md bg-amber-50 p-4 mt-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">API Key Required</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          The AI assistant requires an OpenAI API key to function. Please contact your administrator to set up the API key.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}