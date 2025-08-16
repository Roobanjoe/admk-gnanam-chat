import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  chat_notifications: boolean;
  security_alerts: boolean;
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: false,
    chat_notifications: true,
    security_alerts: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        // Map database fields to local state
        setSettings({
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? false,
          chat_notifications: data.chat_notifications ?? true,
          security_alerts: data.security_alerts ?? true
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      toast({
        title: "Error loading settings",
        description: "Failed to load notification preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated"
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive important updates and announcements via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email_notifications}
              onCheckedChange={(value) => updateSetting('email_notifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive real-time notifications in your browser
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.push_notifications}
              onCheckedChange={(value) => updateSetting('push_notifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="chat-notifications">Chat Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Get notified about new messages and chat activity
              </p>
            </div>
            <Switch
              id="chat-notifications"
              checked={settings.chat_notifications}
              onCheckedChange={(value) => updateSetting('chat_notifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="security-alerts">Security Alerts</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Important security notifications about your account
              </p>
            </div>
            <Switch
              id="security-alerts"
              checked={settings.security_alerts}
              onCheckedChange={(value) => updateSetting('security_alerts', value)}
            />
          </div>

          <Button
            onClick={saveSettings}
            disabled={saving}
            className="w-full"
          >
            {saving ? "Saving..." : "Save Notification Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}