import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Navigation } from "@/components/navigation"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card"
import { useTranslation, type Language } from "@/components/language-toggle"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import ParticleBackground from "@/components/ParticleBackground"
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
  const [language, setLanguage] = useState<Language>("en")
  const navigate = useNavigate()
  const { t } = useTranslation(language)

  const handleStartChat = () => {
    // Navigate directly to chat page
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
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navigation 
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20">        
        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center pt-12 lg:pt-20">
            <div className="inline-flex items-center space-x-2 bg-neon/10 border border-neon/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-neon" />
              <span className="text-sm font-medium text-neon">
                {language === "en" ? "Powered by AI Technology" : "AI தொழில்நுட்பத்தால் இயக்கப்படுகிறது"}
              </span>
            </div>
            
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl mb-6 leading-tight">
              <span className="text-neon flex items-center justify-center gap-4">
                <img 
                  src="/lovable-uploads/4c55a5ae-529c-4bca-b792-7c364b28e82b.png" 
                  alt="CHAT_AI_ADMK Logo" 
                  className="w-16 lg:w-20 h-16 lg:h-20 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4),0_0_40px_rgba(0,255,255,0.2)]"
                />
                CHAT_AI_ADMK
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <EnhancedButton 
                variant="hero" 
                size="xl" 
                className="group" 
                onClick={handleStartChat}
              >
                <MessageSquare className="w-5 h-5" />
                {t("startChat")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </EnhancedButton>
              
              <Link to="/about">
                <EnhancedButton variant="glow" size="xl">
                  {t("learnMore")}
                </EnhancedButton>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
              {stats.map((stat, index) => (
                <GlassCard key={index} variant="neon" padding="lg" className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-neon/20 rounded-xl flex items-center justify-center group-hover:bg-neon/30 transition-colors">
                      <stat.icon className="w-6 h-6 text-neon" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-display font-bold text-neon">{stat.value}</div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl lg:text-4xl mb-4 text-neon">
              {t("featuredSections")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "en" 
                ? "Explore comprehensive information about AIADMK's history, leadership, and vision"
                : "அ.இ.அ.த.மு.க-வின் வரலாறு, தலைமை மற்றும் பார்வை பற்றிய விரிவான தகவல்களை அறியுங்கள்"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group">
                {feature.title.includes("AI Chat") || feature.title.includes("AI அரட்டை") ? (
                  <div 
                    className="cursor-pointer" 
                    onClick={handleStartChat}
                  >
                    <GlassCard
                      variant="default"
                      className="h-full group-hover:scale-105 transition-all duration-300"
                    >
                      <GlassCardHeader>
                        <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon transition-shadow`}>
                          <feature.icon className="w-6 h-6 text-neon" />
                        </div>
                        <GlassCardTitle className="text-lg">{feature.title}</GlassCardTitle>
                        <GlassCardDescription>{feature.description}</GlassCardDescription>
                      </GlassCardHeader>
                      <GlassCardContent>
                        <div className="flex items-center text-neon group-hover:text-neon/80 transition-colors">
                          <span className="text-sm font-medium">
                            {language === "en" ? "Start Chat" : "அரட்டை தொடங்கு"}
                          </span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  </div>
                ) : (
                  <Link to={feature.href}>
                    <GlassCard
                      variant="default"
                      className="h-full group-hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      <GlassCardHeader>
                        <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon transition-shadow`}>
                          <feature.icon className="w-6 h-6 text-neon" />
                        </div>
                        <GlassCardTitle className="text-lg">{feature.title}</GlassCardTitle>
                        <GlassCardDescription>{feature.description}</GlassCardDescription>
                      </GlassCardHeader>
                      <GlassCardContent>
                        <div className="flex items-center text-neon group-hover:text-neon/80 transition-colors">
                          <span className="text-sm font-medium">
                            {language === "en" ? "Explore" : "ஆராயுங்கள்"}
                          </span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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