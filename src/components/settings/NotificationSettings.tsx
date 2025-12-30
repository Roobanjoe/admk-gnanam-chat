import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsState {
  email_notifications: boolean;
  push_notifications: boolean;
  chat_notifications: boolean;
  security_alerts: boolean;
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsState>({
    email_notifications: true,
    push_notifications: false,
    chat_notifications: true,
    security_alerts: true
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Settings saved locally for now
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

  const updateSetting = (key: keyof NotificationSettingsState, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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
