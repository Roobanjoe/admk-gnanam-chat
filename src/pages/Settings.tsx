import { useState, useEffect } from "react";
import { useTranslation, type Language } from "@/components/language-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/ui/back-button";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, User, Mail, Shield, Trash2 } from "lucide-react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileUpload } from "@/components/settings/ProfileUpload";
import { AuthenticationSection } from "@/components/settings/AuthenticationSection";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChange, getCurrentUser } from "@/lib/auth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Settings = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [tnPartyOnly, setTnPartyOnly] = useState(false);
  const [activeSection, setActiveSection] = useState("my-account");
  
  const { t } = useTranslation(language);
  const { theme, setTheme } = useTheme();
  const { profile, loading, updating, updateProfile } = useProfile();
  const { toast } = useToast();

  useEffect(() => {
    // Load user phone number and settings
    const loadUserData = async () => {
      const user = getCurrentUser();
      if (user) {
        // Set phone number from Firebase user
        setPhoneNumber(user.phoneNumber || "");

        // Load user settings from Supabase (keeping this for now)
        const { data: settings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.uid)
          .maybeSingle();

        if (settings) {
          setLanguage(settings.default_language as Language);
          setTnPartyOnly(settings.tn_party_only || false);
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  useEffect(() => {
    // Update active section based on URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
      }
    };

    // Set initial section
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const handleProfileUpdate = async () => {
    await updateProfile({
      display_name: displayName,
      bio: bio
    });
  };

  const handleSettingsUpdate = async () => {
    try {
      const user = getCurrentUser();
      if (!user) return;

      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.uid,
          default_language: language,
          tn_party_only: tnPartyOnly
        }, { onConflict: 'user_id' });

      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const clearChatHistory = async () => {
    try {
      const user = getCurrentUser();
      if (!user) return;

      await supabase
        .from('conversations')
        .delete()
        .eq('user_id', user.uid);

      toast({
        title: "History cleared",
        description: "Your chat history has been cleared successfully"
      });
    } catch (error) {
      toast({
        title: "Clear failed",
        description: "Failed to clear chat history. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "my-account":
        return <AuthenticationSection phoneNumber={phoneNumber} />;

      case "user-profile":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Customize your profile appearance and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProfileUpload 
                  currentAvatar={profile?.avatar_url}
                  displayName={displayName}
                  onAvatarUpdate={(url) => updateProfile({ avatar_url: url })}
                />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">About Me</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleProfileUpdate}
                    disabled={updating}
                    className="w-full"
                  >
                    {updating ? "Updating..." : "Save Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="theme-select">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themeOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "language":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 8 6 6" />
                    <path d="m4 14 6-6 2-3" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                  Language & Region
                </CardTitle>
                <CardDescription>
                  Set your preferred language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="language-select">Default Language</Label>
                  <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSettingsUpdate} className="w-full">
                  Save Language Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "chat":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Chat Settings
                </CardTitle>
                <CardDescription>
                  Configure your chat experience and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="tn-party-only">Focus on Tamil Nadu & AIADMK</Label>
                    <p className="text-sm text-muted-foreground">
                      Prioritize responses related to Tamil Nadu and AIADMK party content
                    </p>
                  </div>
                  <Switch
                    id="tn-party-only"
                    checked={tnPartyOnly}
                    onCheckedChange={setTnPartyOnly}
                  />
                </div>
                <Button onClick={handleSettingsUpdate} className="w-full">
                  Save Chat Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "notifications":
        return <NotificationSettings />;

      case "privacy":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Safety
                </CardTitle>
                <CardDescription>
                  Manage your privacy settings and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-start gap-3">
                    <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-destructive">Clear Chat History</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete all your chat conversations. This action cannot be undone.
                      </p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Clear All History</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear Chat History?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all your chat conversations. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={clearChatHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Clear History
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <SettingsSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-white/10 bg-glass-light">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <BackButton />
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">A</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-sm text-muted-foreground">
                      Manage your account and application preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Loading settings...</p>
                  </div>
                </div>
              ) : (
                renderContent()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;