import { NavLink, useLocation } from "react-router-dom";
import { User, Shield, Palette, Globe, MessageSquare, X, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsSidebarProps {
  onClose?: () => void;
  className?: string;
}

const settingsCategories = [
  {
    title: "User Settings",
    items: [
      { id: "my-account", label: "My Account", icon: Settings },
      { id: "user-profile", label: "User Profile", icon: User },
    ]
  },
  {
    title: "App Settings", 
    items: [
      { id: "appearance", label: "Appearance", icon: Palette },
      { id: "language", label: "Language & Region", icon: Globe },
      { id: "chat", label: "Chat Settings", icon: MessageSquare },
      { id: "notifications", label: "Notifications", icon: Bell },
    ]
  },
  {
    title: "Privacy & Safety",
    items: [
      { id: "privacy", label: "Privacy & Safety", icon: Shield },
    ]
  }
];

export function SettingsSidebar({ onClose, className }: SettingsSidebarProps) {
  const location = useLocation();
  const currentHash = location.hash.replace('#', '') || 'my-account';

  return (
    <div className={`w-60 bg-glass-light border-r border-white/10 h-full flex flex-col ${className}`}>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Settings</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {settingsCategories.map(category => (
          <div key={category.title} className="p-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2">
              {category.title}
            </h3>
            <div className="space-y-1">
              {category.items.map(item => {
                const IconComponent = item.icon;
                const isActive = currentHash === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`flex items-center gap-3 px-2 py-2 rounded text-sm transition-colors ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = item.id;
                      window.dispatchEvent(new HashChangeEvent('hashchange'));
                    }}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}