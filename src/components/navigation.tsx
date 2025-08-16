import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { LanguageToggle, useTranslation, type Language } from "@/components/language-toggle"
import { GlassCard } from "@/components/ui/glass-card"
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
    { href: "/elections", icon: Vote, label: t("elections") },
    { href: "/manifestos", icon: FileText, label: t("manifestos") }
  ]

  const protectedItems = user ? [
    { href: "/app", icon: MessageSquare, label: t("chat") },
    { href: "/settings", icon: Settings, label: t("settings") },
    { href: "/knowledge", icon: BookOpen, label: t("knowledge") }
  ] : []

  const allItems = [...navItems, ...protectedItems]

  const isActive = (href: string) => location.pathname === href

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-glass border-b border-glass-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center shadow-neon group-hover:shadow-neon group-hover:scale-110 transition-all duration-300">
                <span className="text-primary-foreground font-display font-bold text-lg">அ</span>
              </div>
              <span className="font-display font-bold text-xl text-neon">AIADMK</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {allItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300",
                    isActive(item.href)
                      ? "bg-neon/20 text-neon shadow-neon"
                      : "text-muted-foreground hover:text-neon hover:bg-glass-hover"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              <LanguageToggle 
                language={language} 
                onLanguageChange={onLanguageChange} 
              />
              
              {user ? (
                <EnhancedButton
                  variant="glass"
                  size="sm"
                  onClick={onSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  {t("signOut")}
                </EnhancedButton>
              ) : (
                <Link to="/auth">
                  <EnhancedButton variant="neon" size="sm">
                    <LogIn className="w-4 h-4" />
                    {t("signIn")}
                  </EnhancedButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-glass border-b border-glass-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center shadow-neon">
                <span className="text-primary-foreground font-display font-bold text-sm">அ</span>
              </div>
              <span className="font-display font-bold text-lg text-neon">AIADMK</span>
            </Link>

            {/* Mobile Menu Button */}
            <EnhancedButton
              variant="glass"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </EnhancedButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-glass border-b border-glass-border">
            <GlassCard variant="minimal" padding="sm" className="m-4 rounded-2xl">
              <div className="space-y-2">
                {allItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 w-full",
                      isActive(item.href)
                        ? "bg-neon/20 text-neon"
                        : "text-muted-foreground hover:text-neon hover:bg-glass-hover"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                <div className="border-t border-glass-border pt-3 mt-3">
                  <div className="flex items-center justify-between px-4 py-2">
                    <LanguageToggle 
                      language={language} 
                      onLanguageChange={onLanguageChange} 
                    />
                    
                    {user ? (
                      <EnhancedButton
                        variant="glass"
                        size="sm"
                        onClick={() => {
                          onSignOut?.()
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        {t("signOut")}
                      </EnhancedButton>
                    ) : (
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        <EnhancedButton variant="neon" size="sm">
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
      <div className="h-16 lg:h-20" />
    </>
  )
}