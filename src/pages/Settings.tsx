import { useState } from "react";
import { useTranslation, type Language } from "@/components/language-toggle";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const [language, setLanguage] = useState<Language>("en");
  const { t } = useTranslation(language);
  const { theme, setTheme } = useTheme();
  const [tnPartyOnly, setTnPartyOnly] = useState(false);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <BackButton className="mb-4" />
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">{t("settings")}</h1>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Theme Settings */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t("theme")}</h2>
              
              <div className="space-y-3">
                <Label htmlFor="theme-select">Choose Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-full">
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
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t("defaultLanguage")}</h2>
              
              <div className="space-y-3">
                <Label htmlFor="language-select">Default Language</Label>
                <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Chat Settings */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Chat Settings</h2>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="tn-party-only">{t("tnPartyOnly")}</Label>
                  <p className="text-sm text-muted-foreground">
                    Focus responses on Tamil Nadu and AIADMK party content only
                  </p>
                </div>
                <Switch
                  id="tn-party-only"
                  checked={tnPartyOnly}
                  onCheckedChange={setTnPartyOnly}
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Data Management</h2>
              
              <Button variant="destructive" className="w-full">
                {t("clearHistory")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;