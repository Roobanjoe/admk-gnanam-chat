import { useEffect, useMemo, useRef, useState } from "react";
import { useWebchat } from "@botpress/webchat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassCard } from "@/components/ui/glass-card";
import { Send, MessageSquare, User, Bot, RotateCcw } from "lucide-react";
import { useTranslation, type Language } from "@/components/language-toggle";

interface CustomChatProps {
  language: Language;
}

export default function CustomChat({ language }: CustomChatProps) {
  const clientId = import.meta.env.VITE_BOTPRESS_CLIENT_ID;
  const { t } = useTranslation(language);
  
  const { client, messages, isTyping, clientState, user, newConversation } =
    useWebchat({ clientId });

  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // Normalize messages into your UI's shape
  const items = useMemo(() => {
    return messages.map((m) => {
      const mine = m.authorId === user?.userId;
      return {
        id: m.id,
        mine,
        text: (m as any)?.payload?.text ?? (m as any)?.text ?? "",
        time: new Date((m as any)?.createdAt ?? (m as any)?.timestamp ?? Date.now()),
      };
    });
  }, [messages, user?.userId]);

  // Auto-scroll to last message
  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e9, behavior: "smooth" });
  }, [items.length, isTyping]);

  // Send text
  const send = async () => {
    const value = text.trim();
    if (!value) return;
    await client?.sendMessage({ type: "text", text: value });
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
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
          <div className={`w-2 h-2 rounded-full ${clientState === "connected" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
          <span className="text-sm font-medium">
            {clientState === "connected" 
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
          {items.length === 0 ? (
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
              {items.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.mine ? "justify-end" : "justify-start"
                  }`}
                >
                  {!message.mine && (
                    <div className="w-8 h-8 bg-neon/20 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-neon" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.mine
                        ? "bg-neon text-primary-foreground"
                        : "bg-glass-light border border-glass-border"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.time.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.mine && (
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
              disabled={clientState !== "connected"}
              className="flex-1"
            />
            <Button 
              onClick={send} 
              disabled={clientState !== "connected" || !text.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}