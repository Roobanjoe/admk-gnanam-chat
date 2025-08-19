import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { BackButton } from "@/components/ui/back-button";
import { useTranslation, type Language } from "@/components/language-toggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void;
      onEvent: (callback: (event: any) => void, filter?: any) => void;
    };
  }
}

const Chat = () => {
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");
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

  useEffect(() => {
    // Load Botpress webchat script
    const loadBotpress = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
      script.async = true;
      script.onload = () => {
        if (window.botpressWebChat && import.meta.env.VITE_BOTPRESS_CLIENT_ID) {
          window.botpressWebChat.init({
            clientId: import.meta.env.VITE_BOTPRESS_CLIENT_ID,
            hostUrl: 'https://cdn.botpress.cloud/webchat/v2.2',
            messagingUrl: 'https://messaging.botpress.cloud',
            botName: 'AIADMK Assistant',
            website: {
              title: 'AIADMK Chat',
              link: window.location.origin
            },
            theme: 'prism',
            themeName: 'prism',
            stylesheet: 'https://webchat-styler-css.botpress.app/prod/code/f66f1988-19d4-4a16-ab70-e7cc69c271fc/v92847/style.css',
            frontendVersion: 'v1',
            useSessionStorage: true,
            enableConversationDeletion: true,
            showPoweredBy: true,
            className: 'webchatIframe',
            containerWidth: '100%25',
            layoutWidth: '100%25'
          });
        }
      };
      document.body.appendChild(script);
    };

    if (user) {
      loadBotpress();
    }

    return () => {
      // Cleanup script if needed
      const existingScript = document.querySelector('script[src*="botpress"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error("Error signing out: " + error.message);
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
            <p className="text-lg text-muted-foreground mb-8">
              {language === "en" 
                ? "Ask questions about AIADMK history, policies, and more"
                : "அ.இ.அ.த.மு.க வரலாறு, கொள்கைகள் மற்றும் பலவற்றைப் பற்றி கேள்விகளைக் கேளுங்கள்"
              }
            </p>
            
            {/* Botpress Chat Widget Container */}
            <div className="flex justify-center">
              <div 
                id="botpress-webchat-container" 
                className="w-full max-w-lg h-[600px] border border-glass-border rounded-lg shadow-lg bg-card"
                style={{ minHeight: '600px' }}
              >
                {!import.meta.env.VITE_BOTPRESS_CLIENT_ID && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">
                      {language === "en" 
                        ? "Botpress Client ID not configured"
                        : "Botpress வாடிக்கையாளர் ID கட்டமைக்கப்படவில்லை"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;