import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageToggle, useTranslation, type Language } from "@/components/language-toggle"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const navigate = useNavigate()
  const { t } = useTranslation(language)

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate("/")
      }
    }
    checkUser()
  }, [navigate])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        toast.success(language === "en" ? "Logged in successfully!" : "வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!")
        navigate("/")
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        })
        if (error) throw error
        
        if (data?.user && !data?.session) {
          toast.success(language === "en" 
            ? "Please check your email to confirm your account!" 
            : "உங்கள் கணக்கை உறுதிப்படுத்த உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்!")
        } else {
          toast.success(language === "en" ? "Account created successfully!" : "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!")
          navigate("/")
        }
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-neon transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "en" ? "Back to Home" : "முகப்புக்கு திரும்பு"}</span>
        </Link>

        <GlassCard variant="elevated" padding="lg">
          <GlassCardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-neon rounded-2xl flex items-center justify-center shadow-neon mx-auto mb-4">
              <span className="text-primary-foreground font-display font-bold text-2xl">அ</span>
            </div>
            <GlassCardTitle className="text-2xl">
              {isLogin ? t("login") : t("signup")}
            </GlassCardTitle>
            <GlassCardDescription>
              {isLogin 
                ? (language === "en" ? "Welcome back to AIADMK Knowledge Platform" : "அ.இ.அ.த.மு.க அறிவு தளத்திற்கு வரவேற்கிறோம்")
                : (language === "en" ? "Create your account to get started" : "தொடங்க உங்கள் கணக்கை உருவாக்குங்கள்")
              }
            </GlassCardDescription>
          </GlassCardHeader>

          <GlassCardContent className="space-y-6">
            {/* Language Toggle */}
            <div className="flex justify-center">
              <LanguageToggle 
                language={language} 
                onLanguageChange={setLanguage} 
              />
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-glass backdrop-blur-glass border-glass-border rounded-xl"
                    placeholder={language === "en" ? "Enter your email" : "உங்கள் மின்னஞ்சலை உள்ளிடுங்கள்"}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-glass backdrop-blur-glass border-glass-border rounded-xl"
                    placeholder={language === "en" ? "Enter your password" : "உங்கள் கடவுச்சொல்லை உள்ளிடுங்கள்"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <EnhancedButton
                type="submit"
                variant="neon"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t("loading") : (isLogin ? t("login") : t("signup"))}
              </EnhancedButton>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-glass-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {language === "en" ? "Or continue with" : "அல்லது இதனுடன் தொடரவும்"}
                </span>
              </div>
            </div>

            <EnhancedButton
              type="button"
              variant="glass"
              size="lg"
              className="w-full"
              onClick={handleGoogleAuth}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("loginWithGoogle")}
            </EnhancedButton>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-neon transition-colors"
              >
                {isLogin 
                  ? (language === "en" ? "Don't have an account? Sign up" : "கணக்கு இல்லையா? பதிவு செய்யுங்கள்")
                  : (language === "en" ? "Already have an account? Login" : "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையுங்கள்")
                }
              </button>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}

export default Auth