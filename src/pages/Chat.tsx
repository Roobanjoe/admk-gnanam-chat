import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { BackButton } from "@/components/ui/back-button";
import { useTranslation, type Language } from "@/components/language-toggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent, GlassCardFooter } from "@/components/ui/glass-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Maximize2, Minimize2, RefreshCw, Palette, Monitor, Smartphone, Square } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Chat = () => {
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerVariant, setContainerVariant] = useState<"default" | "neon" | "elevated" | "minimal">("neon");
  const [containerSize, setContainerSize] = useState<"compact" | "standard" | "expanded">("standard");
  const [isConnected, setIsConnected] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const { t } = useTranslation(language);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        window.location.href = "/auth";
      }
    });

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

  const handleIframeLoad = () => {
    setIsLoading(false);
    setIsConnected(true);
    toast.success(language === "en" ? "Chat loaded successfully" : "அரட்டை வெற்றிகரமாக ஏற்றப்பட்டது");
  };

  const handleRefreshChat = () => {
    setIsLoading(true);
    setIsConnected(false);
    setIframeKey(prev => prev + 1);
    toast.info(language === "en" ? "Refreshing chat..." : "அரட்டை புதுப்பிக்கப்படுகிறது...");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getContainerHeight = () => {
    if (isFullscreen) return "h-screen";
    switch (containerSize) {
      case "compact": return "h-[60vh]";
      case "standard": return "h-[80vh]";
      case "expanded": return "h-[90vh]";
      default: return "h-[80vh]";
    }
  };

  const getContainerClass = () => {
    if (isFullscreen) {
      return "fixed inset-0 z-50 w-screen h-screen";
    }
    return `w-[80%] mx-auto ${getContainerHeight()}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        user={user}
        onSignOut={handleSignOut}
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className={isFullscreen ? "" : "container mx-auto px-2 pt-16"}>
        {!isFullscreen && <BackButton className="mb-2" />}
        
        <div className={isFullscreen ? "" : ""}>
          {!isFullscreen && (
            <div className="text-center mb-4">
              <h1 className="font-display font-bold text-2xl lg:text-3xl mb-2 text-neon">
                {language === "en" ? "AI Chat Assistant" : "AI அரட்டை உதவியாளர்"}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "en" 
                  ? "Ask questions about AIADMK history, policies, and more"
                  : "அ.இ.அ.த.மு.க வரலாறு, கொள்கைகள் மற்றும் பலவற்றைப் பற்றி கேள்விகளைக் கேளுங்கள்"
                }
              </p>
            </div>
          )}

          {/* Enhanced Botpress Chat Container */}
          <GlassCard variant={containerVariant} className={`${getContainerClass()} overflow-hidden transition-all duration-500`}>
            <GlassCardHeader className="flex flex-row items-center justify-between p-4 border-b border-glass-border">
              <div className="flex items-center space-x-3">
                <GlassCardTitle className="text-lg font-semibold">
                  {language === "en" ? "AI Chat Assistant" : "AI அரட்டை உதவியாளர்"}
                </GlassCardTitle>
                <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                  {isConnected 
                    ? (language === "en" ? "Online" : "ஆன்லைனில்")
                    : (language === "en" ? "Connecting..." : "இணைக்கிறது...")
                  }
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Theme Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <EnhancedButton variant="ghost" size="sm">
                      <Palette className="h-4 w-4" />
                    </EnhancedButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setContainerVariant("default")}>
                      Default Theme
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setContainerVariant("neon")}>
                      Neon Theme
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setContainerVariant("elevated")}>
                      Elevated Theme
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setContainerVariant("minimal")}>
                      Minimal Theme
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Size Selector */}
                {!isFullscreen && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EnhancedButton variant="ghost" size="sm">
                        {containerSize === "compact" && <Smartphone className="h-4 w-4" />}
                        {containerSize === "standard" && <Monitor className="h-4 w-4" />}
                        {containerSize === "expanded" && <Square className="h-4 w-4" />}
                      </EnhancedButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setContainerSize("compact")}>
                        <Smartphone className="h-4 w-4 mr-2" />
                        Compact (400px)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setContainerSize("standard")}>
                        <Monitor className="h-4 w-4 mr-2" />
                        Standard (600px)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setContainerSize("expanded")}>
                        <Square className="h-4 w-4 mr-2" />
                        Expanded (800px)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Refresh Button */}
                <EnhancedButton variant="ghost" size="sm" onClick={handleRefreshChat}>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </EnhancedButton>

                {/* Fullscreen Toggle */}
                <EnhancedButton variant="ghost" size="sm" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </EnhancedButton>
              </div>
            </GlassCardHeader>

            <GlassCardContent className="p-0 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Loading chat assistant..." : "அரட்டை உதவியாளர் ஏற்றப்படுகிறது..."}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="h-full w-full rounded-lg overflow-hidden">
                <iframe
                  key={iframeKey}
                  src="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/16/09/20250816095926-HXID0BCT.json"
                  className="w-full h-full border-0"
                  allow="microphone; camera"
                  title={language === "en" ? "AI Chat Assistant" : "AI அரட்டை உதவியாளர்"}
                  onLoad={handleIframeLoad}
                  onError={() => {
                    setIsLoading(false);
                    setIsConnected(false);
                    toast.error(language === "en" ? "Failed to load chat" : "அரட்டை ஏற்ற முடியவில்லை");
                  }}
                />
              </div>
            </GlassCardContent>

            <GlassCardFooter className="p-3 border-t border-glass-border">
              <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span>
                    {language === "en" ? "AI Assistant" : "AI உதவியாளர்"} • 
                    {language === "en" ? "Powered by Botpress" : "Botpress ஆல் இயக்கப்படுகிறது"}
                  </span>
                </div>
                <span className="capitalize">
                  {containerVariant} • {containerSize}
                </span>
              </div>
            </GlassCardFooter>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Chat;