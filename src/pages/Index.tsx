import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Navigation } from "@/components/navigation"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card"
import { useTranslation, type Language } from "@/components/language-toggle"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { 
  MessageSquare, 
  Users, 
  Vote, 
  FileText, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Heart
} from "lucide-react"
import heroImage from "@/assets/hero-banner.jpg"

const Index = () => {
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState<Language>("en")
  const navigate = useNavigate()
  const { t } = useTranslation(language)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])


  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
    } catch (error: any) {
      toast.error("Error signing out: " + error.message)
    }
  }

  const handleStartChat = () => {
    if (!user) {
      // Redirect to auth if not logged in
      navigate('/auth')
      return
    }
    
    // Navigate to chat page
    navigate('/app')
  }

  const features = [
    {
      icon: Users,
      title: t("partyLeaders"),
      description: language === "en" 
        ? "Explore the leadership history and contributions of AIADMK leaders"
        : "அ.இ.அ.த.மு.க தலைவர்களின் வரலாறு மற்றும் பங்களிப்புகளை அறியுங்கள்",
      href: "/leaders",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Vote,
      title: t("electionHistory"),
      description: language === "en"
        ? "Comprehensive data on elections, alliances, and electoral performance"
        : "தேர்தல்கள், கூட்டணிகள் மற்றும் தேர்தல் செயல்திறன் பற்றிய விரிவான தரவு",
      href: "/elections", 
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: FileText,
      title: t("partyManifestos"),
      description: language === "en"
        ? "Access party manifestos, policies, and ideological documents"
        : "கட்சி அறிக்கைகள், கொள்கைகள் மற்றும் கருத்தியல் ஆவணங்களை அணுகுங்கள்",
      href: "/manifestos",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: MessageSquare,
      title: language === "en" ? "AI Chat Assistant" : "AI அரட்டை உதவியாளர்",
      description: language === "en"
        ? "Intelligent chat system with bilingual support for party knowledge"
        : "கட்சி அறிவுக்கான இருமொழி ஆதரவுடன் அறிவார்ந்த அரட்டை அமைப்பு",
      href: "/app",
      color: "from-neon/20 to-cyan-500/20",
      protected: true
    }
  ]

  const stats = [
    { 
      label: language === "en" ? "Years of Service" : "சேவை ஆண்டுகள்", 
      value: "75+", 
      icon: Heart 
    },
    { 
      label: language === "en" ? "Electoral Victories" : "தேர்தல் வெற்றிகள்", 
      value: "150+", 
      icon: Target 
    },
    { 
      label: language === "en" ? "Assembly Seats Won" : "சட்டசபை இடங்கள் வென்றது", 
      value: "2000+", 
      icon: TrendingUp 
    }
  ]

  return (
    <div className="min-h-screen">
      <Navigation 
        user={user}
        onSignOut={handleSignOut}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Professional Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center professional-hero">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-neon/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-neon/80 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Professional Badge */}
            <div className="inline-flex items-center space-x-2 bg-neon/5 border border-neon/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 bg-neon rounded-full animate-pulse" />
              <span className="text-sm font-medium text-neon/80 uppercase tracking-wider">
                {language === "en" ? "I can search new contacts" : "புதிய தொடர்புகளை தேடலாம்"}
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-8xl mb-8 leading-tight">
              <div className="mb-4">
                <span className="gradient-text">
                  {language === "en" ? "What Can I Do" : "நான் என்ன செய்ய"}
                </span>
              </div>
              <div className="text-foreground/90">
                {language === "en" ? "for You Today?" : "முடியும் இன்று?"}
              </div>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed opacity-80">
              {language === "en" 
                ? "Your intelligent AI assistant for AIADMK knowledge, ready to help with information, guidance, and insights."
                : "அ.இ.அ.த.மு.க அறிவுக்கான உங்கள் அறிவார்ந்த AI உதவியாளர், தகவல், வழிகாட்டுதல் மற்றும் நுண்ணறிவுகளுடன் உதவ தயார்."
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <EnhancedButton 
                variant="hero" 
                size="xl" 
                className="group shadow-professional" 
                onClick={handleStartChat}
              >
                <MessageSquare className="w-5 h-5" />
                {language === "en" ? "Start Conversation" : "உரையாடல் தொடங்கு"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </EnhancedButton>
              
              <Link to="/about">
                <EnhancedButton variant="glow" size="xl" className="shadow-neon">
                  {language === "en" ? "Explore Features" : "அம்சங்களை ஆராயுங்கள்"}
                </EnhancedButton>
              </Link>
            </div>

            {/* Glowing Orb Animation */}
            <div className="relative flex justify-center items-center">
              <div className="glowing-orb w-32 h-32 rounded-full shadow-orb relative">
                <div className="absolute inset-4 bg-neon/20 rounded-full backdrop-blur-sm border border-neon/30">
                  <div className="absolute inset-3 bg-neon/10 rounded-full border border-neon/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-neon animate-spin" style={{ animationDuration: '8s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section - Professional Dashboard Style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
              {stats.map((stat, index) => (
                <GlassCard key={index} variant="neon" padding="lg" className="text-center group hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-neon/20 rounded-full blur-xl" />
                  </div>
                  
                  <div className="relative flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-professional rounded-2xl flex items-center justify-center group-hover:shadow-professional transition-all duration-500 border border-neon/20">
                      <stat.icon className="w-8 h-8 text-neon group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-display font-bold gradient-text">{stat.value}</div>
                      <div className="text-sm text-muted-foreground/80 font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 px-6 lg:px-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-1 h-1 bg-neon rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-32 w-1 h-1 bg-neon rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-neon rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6 gradient-text">
              {t("featuredSections")}
            </h2>
            <p className="text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
              {language === "en" 
                ? "Explore comprehensive information about AIADMK's history, leadership, and vision through our advanced AI-powered platform"
                : "எங்கள் மேம்பட்ட AI-இயங்கும் தளத்தின் மூலம் அ.இ.அ.த.மு.க-வின் வரலாறு, தலைமை மற்றும் பார்வை பற்றிய விரிவான தகவல்களை அறியுங்கள்"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                {feature.title.includes("AI Chat") || feature.title.includes("AI அரட்டை") ? (
                  <div 
                    className="cursor-pointer" 
                    onClick={handleStartChat}
                  >
                    <GlassCard
                      variant="default"
                      className="h-full group-hover:scale-105 transition-all duration-500 relative overflow-hidden border-neon/20 hover:border-neon/40 hover:shadow-professional"
                    >
                      {/* Feature highlight effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon to-transparent" />
                      </div>
                      
                      <GlassCardHeader className="relative">
                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-professional transition-all duration-500 border border-neon/30`}>
                          <feature.icon className="w-7 h-7 text-neon group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <GlassCardTitle className="text-xl mb-3 gradient-text">{feature.title}</GlassCardTitle>
                        <GlassCardDescription className="text-muted-foreground/80 leading-relaxed">{feature.description}</GlassCardDescription>
                      </GlassCardHeader>
                      <GlassCardContent>
                        <div className="flex items-center text-neon group-hover:text-neon/90 transition-colors">
                          <span className="text-sm font-medium uppercase tracking-wider">
                            {!user 
                              ? (language === "en" ? "Sign in to chat" : "அரட்டையிட உள்நுழையுங்கள்")
                              : (language === "en" ? "Start Chat" : "அரட்டை தொடங்கு")
                            }
                          </span>
                          <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  </div>
                ) : (
                  <Link to={feature.href}>
                    <GlassCard
                      variant="default"
                      className="h-full group-hover:scale-105 transition-all duration-500 cursor-pointer relative overflow-hidden border-glass-border/50 hover:border-neon/30 hover:shadow-neon"
                    >
                      {/* Feature highlight effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
                      </div>
                      
                      <GlassCardHeader className="relative">
                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-neon transition-all duration-500 border border-neon/20`}>
                          <feature.icon className="w-7 h-7 text-neon group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <GlassCardTitle className="text-xl mb-3">{feature.title}</GlassCardTitle>
                        <GlassCardDescription className="text-muted-foreground/80 leading-relaxed">{feature.description}</GlassCardDescription>
                      </GlassCardHeader>
                      <GlassCardContent>
                        <div className="flex items-center text-neon group-hover:text-neon/90 transition-colors">
                          <span className="text-sm font-medium uppercase tracking-wider">
                            {language === "en" ? "Explore" : "ஆராயுங்கள்"}
                          </span>
                          <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border py-12 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-neon rounded-xl flex items-center justify-center shadow-neon">
                <span className="text-primary-foreground font-display font-bold text-sm">அ</span>
              </div>
              <span className="font-display font-bold text-xl text-neon">AIADMK Knowledge Platform</span>
            </div>
            <p className="text-muted-foreground">
              {language === "en" 
                ? "© 2024 AIADMK Knowledge Platform. All rights reserved."
                : "© 2024 அ.இ.அ.த.மு.க அறிவு தளம். அனைத்து உரிமைகளும் محفوظ रणत्व."
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index