import { useState } from "react"
import { Link } from "react-router-dom"
import { LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { useTranslation, type Language } from "@/components/language-toggle"
import { useProfile } from "@/hooks/useProfile"

interface ProfileDropdownProps {
  user?: any
  onSignOut?: () => void
  language: Language
}

export function ProfileDropdown({ user, onSignOut, language }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation(language)
  const { profile } = useProfile()

  if (!user) return null

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-1 rounded-full hover:bg-glass-hover transition-all duration-300 group">
          <Avatar className="h-8 w-8 border-2 border-neon/20 group-hover:border-neon/40 transition-colors">
            <AvatarImage src={profile?.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-gradient-neon text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-0 bg-card/95 backdrop-blur-glass border-glass-border" align="end">
        <div className="p-4 border-b border-glass-border">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-neon/20">
              <AvatarImage src={profile?.avatar_url} alt={displayName} />
              <AvatarFallback className="bg-gradient-neon text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground line-clamp-1">{displayName}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{user.email}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          <Link to="/settings" onClick={() => setOpen(false)}>
            <button className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-glass-hover transition-colors text-left">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("settings")}</span>
            </button>
          </Link>
          
          <button
            onClick={() => {
              onSignOut?.()
              setOpen(false)
            }}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">{t("signOut")}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}