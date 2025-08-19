import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation, type Language } from "@/components/language-toggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, MessageSquare, User, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chat = () => {
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(language);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        // Redirect to auth if not logged in
        window.location.href = "/auth";
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        window.location.href = "/auth";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error("Error signing out: " + error.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { message: messageText, language }
      });

      if (error) {
        console.error('Error calling AI:', error);
        throw error;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || (language === "en" 
          ? "I'm sorry, I couldn't process your message right now."
          : "மன்னிக்கவும், இப்போது உங்கள் செய்தியை செயலாக்க முடியவில்லை."),
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === "en" 
          ? "I'm sorry, there was an error processing your message. Please try again."
          : "மன்னிக்கவும், உங்கள் செய்தியைப் பதிவுசெய்வதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        user={user}
        onSignOut={handleSignOut}
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="container mx-auto px-6 lg:px-8 pt-24">
        <BackButton className="mb-4" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl lg:text-4xl mb-4 text-neon">
              {language === "en" ? "AI Chat Assistant" : "AI அரட்டை உதவியாளர்"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === "en" 
                ? "Ask questions about AIADMK history, policies, and more"
                : "அ.இ.அ.த.மு.க வரலாறு, கொள்கைகள் மற்றும் பலவற்றைப் பற்றி கேள்விகளைக் கேளுங்கள்"
              }
            </p>
          </div>

          <GlassCard className="h-[600px] flex flex-col">
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">
                      {language === "en" ? "Start a conversation" : "உரையாடலைத் தொடங்குங்கள்"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" 
                        ? "Ask me anything about AIADMK!"
                        : "அ.இ.அ.த.மு.க பற்றி எதையும் கேளுங்கள்!"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.sender === "bot" && (
                          <div className="w-8 h-8 bg-neon/20 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-neon" />
                          </div>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === "user"
                              ? "bg-neon text-primary-foreground"
                              : "bg-glass-light border border-glass-border"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {message.sender === "user" && (
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start space-x-3 justify-start">
                        <div className="w-8 h-8 bg-neon/20 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-neon" />
                        </div>
                        <div className="bg-glass-light border border-glass-border max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-neon rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="border-t border-glass-border p-6">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={language === "en" ? "Type your message..." : "உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்..."}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Chat;