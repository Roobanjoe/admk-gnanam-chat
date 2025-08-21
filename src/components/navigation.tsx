import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { LanguageToggle, useTranslation, type Language } from "@/components/language-toggle"
import { GlassCard } from "@/components/ui/glass-card"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { 
  Home, 
  Info, 
  Users, 
  Vote, 
  FileText, 
  MessageSquare, 
  Settings, 
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  user?: any
  onSignOut?: () => void
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function Navigation({ user, onSignOut, language, onLanguageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { t } = useTranslation(language)

  const navItems = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/about", icon: Info, label: t("about") },
    { href: "/leaders", icon: Users, label: t("leaders") },
    { href: "/elections", icon: Vote, label: t("elections") }
  ]

  const protectedItems: never[] = []

  const allItems = [...navItems, ...protectedItems]

  const isActive = (href: string) => location.pathname === href

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-glass border-b border-glass-border">
        <div className="container mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 lg:space-x-3 group flex-shrink-0">
              <img 
                src="/lovable-uploads/4c55a5ae-529c-4bca-b792-7c364b28e82b.png" 
                alt="CHAT_AI_ADMK Logo"
                className="w-8 lg:w-10 h-8 lg:h-10 rounded-xl bg-white/90 p-1 shadow-[0_0_10px_rgba(255,255,255,0.4),0_0_20px_rgba(0,255,255,0.2)] backdrop-blur-sm border border-white/20 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6),0_0_30px_rgba(0,255,255,0.3)] group-hover:scale-110 transition-all duration-300"
              />
              <span className="font-display font-bold text-lg lg:text-xl text-neon">CHAT_AI_ADMK</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1 flex-1 justify-center max-w-2xl">
              {allItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base",
                    isActive(item.href)
                      ? "bg-neon/20 text-neon shadow-neon"
                      : "text-muted-foreground hover:text-neon hover:bg-glass-hover"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              <div className="hidden sm:block">
                <LanguageToggle 
                  language={language} 
                  onLanguageChange={onLanguageChange} 
                />
              </div>
              
              {user ? (
                <ProfileDropdown 
                  user={user} 
                  onSignOut={onSignOut} 
                  language={language} 
                />
              ) : (
                <Link to="/auth">
                  <EnhancedButton variant="neon" size="sm">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("signIn")}</span>
                  </EnhancedButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-glass border-b border-glass-border">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <img 
                src="/lovable-uploads/4c55a5ae-529c-4bca-b792-7c364b28e82b.png" 
                alt="CHAT_AI_ADMK Logo" 
                className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-white/90 p-1 shadow-[0_0_8px_rgba(255,255,255,0.4),0_0_16px_rgba(0,255,255,0.2)] backdrop-blur-sm border border-white/20"
              />
              <span className="font-display font-bold text-base sm:text-lg text-neon">CHAT_AI_ADMK</span>
            </Link>

            {/* Right Side - Mobile */}
            <div className="flex items-center space-x-2">
              <div className="sm:hidden">
                <LanguageToggle 
                  language={language} 
                  onLanguageChange={onLanguageChange} 
                />
              </div>
              
              {/* Mobile Menu Button */}
              <EnhancedButton
                variant="glass"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </EnhancedButton>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-glass border-b border-glass-border max-h-[calc(100vh-4rem)] overflow-y-auto">
            <GlassCard variant="minimal" padding="sm" className="m-3 sm:m-4 rounded-2xl">
              <div className="space-y-1">
                {allItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all duration-300 w-full text-sm sm:text-base",
                      isActive(item.href)
                        ? "bg-neon/20 text-neon"
                        : "text-muted-foreground hover:text-neon hover:bg-glass-hover"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                <div className="border-t border-glass-border pt-3 mt-3">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 px-3 sm:px-4 py-2">
                    <div className="hidden sm:block">
                      <LanguageToggle 
                        language={language} 
                        onLanguageChange={onLanguageChange} 
                      />
                    </div>
                    
                    {user ? (
                      <div onClick={() => setIsMobileMenuOpen(false)} className="w-full sm:w-auto">
                        <ProfileDropdown 
                          user={user} 
                          onSignOut={onSignOut} 
                          language={language} 
                        />
                      </div>
                    ) : (
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="w-full sm:w-auto">
                        <EnhancedButton variant="neon" size="sm" className="w-full sm:w-auto">
                          <LogIn className="w-4 h-4" />
                          {t("signIn")}
                        </EnhancedButton>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-14 sm:h-16 md:h-18 lg:h-20" />
    </>
  )
}