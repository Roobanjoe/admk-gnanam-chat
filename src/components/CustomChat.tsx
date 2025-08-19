import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassCard } from "@/components/ui/glass-card";
import { Send, MessageSquare, User, Bot, RotateCcw } from "lucide-react";
import { useTranslation, type Language } from "@/components/language-toggle";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface CustomChatProps {
  language: Language;
}

export default function CustomChat({ language }: CustomChatProps) {
  const clientId = import.meta.env.VITE_BOTPRESS_CLIENT_ID;
  const { t } = useTranslation(language);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to last message
  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e9, behavior: "smooth" });
  }, [messages.length, isTyping]);

  // Initialize connection
  useEffect(() => {
    if (clientId) {
      setIsConnected(true);
      // Generate a simple conversation ID
      setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substring(7)}`);
    }
  }, [clientId]);

  const sendMessageToBotpress = async (messageText: string) => {
    try {
      setIsTyping(true);
      
      // Simulate bot response for demo (replace with actual Botpress API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responses = language === "en" ? [
        "Thank you for your question about AIADMK! The All India Anna Dravida Munnetra Kazhagam was founded in 1972 by M. G. Ramachandran.",
        "AIADMK has been a major political force in Tamil Nadu, focusing on social welfare and development programs.",
        "The party has been led by prominent leaders like M. G. Ramachandran and J. Jayalalithaa, who made significant contributions to Tamil Nadu's progress.",
        "AIADMK's key policies include women empowerment, education, healthcare, and industrial development in Tamil Nadu.",
        "The party symbol is Two Leaves and has a strong grassroots connection with the people of Tamil Nadu."
      ] : [
        "அ.இ.அ.த.மு.க பற்றிய உங்கள் கேள்விக்கு நன்றி! அகில இந்திய அண்ணா திராவிட முன்னேற்றக் கழகம் 1972ல் எம்.ஜி.ராமச்சந்திரனால் நிறுவப்பட்டது.",
        "அ.இ.அ.த.மு.க தமிழ்நாட்டில் ஒரு முக்கிய அரசியல் சக்தியாக இருந்து, சமூக நலன் மற்றும் வளர்ச்சித் திட்டங்களில் கவனம் செலுத்துகிறது.",
        "எம்.ஜி.ராமச்சந்திரன் மற்றும் ஜே.ஜெயலலிதா போன்ற முன்னணி தலைவர்களால் இக்கட்சி வழிநடத்தப்பட்டது.",
        "அ.இ.அ.த.மு.க.வின் முக்கிய கொள்கைகள் பெண்கள் நலன், கல்வி, சுகாதாரம் மற்றும் தமிழ்நாட்டில் தொழில்துறை வளர்ச்சி ஆகும்.",
        "கட்சியின் சின்னம் இரு இலைகள் மற்றும் தமிழ்நாடு மக்களுடன் வலுவான தொடர்பு கொண்டுள்ளது."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to Botpress:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: language === "en" 
          ? "Sorry, I'm having trouble connecting right now. Please try again."
          : "மன்னிக்கவும், இப்போது இணைப்பில் சிக்கல் உள்ளது. மீண்டும் முயற்சிக்கவும்.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const send = async () => {
    const value = text.trim();
    if (!value) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: value,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setText("");
    
    await sendMessageToBotpress(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  const newConversation = () => {
    setMessages([]);
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  };

  if (!clientId) {
    return (
      <GlassCard className="h-[600px] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
            <p className="text-lg text-muted-foreground">
              {language === "en" 
                ? "Botpress Client ID not configured" 
                : "Botpress வாடிக்கையாளர் ID கட்டமைக்கப்படவில்லை"
              }
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
          <span className="text-sm font-medium">
            {isConnected 
              ? (language === "en" ? "Connected" : "இணைக்கப்பட்டது")
              : (language === "en" ? "Connecting..." : "இணைக்கப்படுகிறது...")
            }
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={newConversation}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          {language === "en" ? "Restart" : "மீண்டும் தொடங்கு"}
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        <ScrollArea ref={listRef} className="flex-1 p-6">
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
              {isTyping && (
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

        {/* Input */}
        <div className="border-t border-glass-border p-6">
          <div className="flex space-x-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === "en" ? "Type your message..." : "உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்..."}
              disabled={!isConnected || isTyping}
              className="flex-1"
            />
            <Button 
              onClick={send} 
              disabled={!isConnected || !text.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}