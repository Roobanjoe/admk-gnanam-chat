import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { BackButton } from "@/components/ui/back-button";
import { useTranslation, type Language } from "@/components/language-toggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CustomChat from "@/components/CustomChat";

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
            <p className="text-lg text-muted-foreground">
              {language === "en" 
                ? "Ask questions about AIADMK history, policies, and more"
                : "அ.இ.அ.த.மு.க வரலாறு, கொள்கைகள் மற்றும் பலவற்றைப் பற்றி கேள்விகளைக் கேளுங்கள்"
              }
            </p>
          </div>

          <CustomChat language={language} />
        </div>
      </div>
    </div>
  );
};

export default Chat;