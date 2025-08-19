import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { BackButton } from "@/components/ui/back-button";
import { useTranslation, type Language } from "@/components/language-toggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    // Load Botpress webchat scripts
    const loadBotpressScripts = () => {
      // Remove any existing Botpress scripts
      const existingScripts = document.querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]');
      existingScripts.forEach(script => script.remove());

      // Load the main webchat script
      const webchatScript = document.createElement('script');
      webchatScript.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
      webchatScript.async = true;
      document.head.appendChild(webchatScript);

      // Load the configuration script
      const configScript = document.createElement('script');
      configScript.src = 'https://files.bpcontent.cloud/2025/08/16/09/20250816095926-GX2MELSP.js';
      configScript.defer = true;
      document.head.appendChild(configScript);
    };

    if (user) {
      loadBotpressScripts();
    }

    return () => {
      // Cleanup scripts when component unmounts
      const botpressScripts = document.querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]');
      botpressScripts.forEach(script => script.remove());
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
          </div>

          {/* Botpress Chat Widget will be embedded here automatically */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="text-center text-muted-foreground">
                {language === "en" 
                  ? "Chat widget loading..."
                  : "அரட்டை விட்ஜெட் ஏற்றப்படுகிறது..."
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;