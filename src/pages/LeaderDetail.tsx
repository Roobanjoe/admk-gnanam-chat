import { useState, useEffect } from "react"
import { useParams, Navigate } from "react-router-dom"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { useTranslation, type Language } from "@/components/language-toggle"
import { Calendar, Award, ArrowLeft } from "lucide-react"
import { getLeaderBySlug, type Leader } from "@/data/leaders"

const LeaderDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [language, setLanguage] = useState<Language>("en")
  const { t } = useTranslation(language)

  const leader = slug ? getLeaderBySlug(slug) : undefined

  // Redirect to 404 if leader not found
  if (!leader) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        language={language}
        onLanguageChange={setLanguage}
      />
      
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <EnhancedButton
          variant="glass"
          onClick={() => window.history.back()}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === "en" ? "Back to Leaders" : "தலைவர்களுக்கு திரும்பு"}
        </EnhancedButton>

        <div className="max-w-4xl mx-auto">
          <GlassCard variant="elevated" padding="lg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="w-full h-64 bg-glass-hover rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={leader.image} 
                    alt={leader.name(language)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h1 className="font-display font-bold text-2xl mb-2 text-neon">
                    {leader.name(language)}
                  </h1>
                  <p className="text-muted-foreground mb-4">{leader.title(language)}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{leader.period}</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-semibold text-xl mb-4 text-neon">
                      {language === "en" ? "Biography" : "வாழ்க்கை வரலாறு"}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {leader.description(language)}
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="font-display font-semibold text-xl mb-4 text-neon">
                      {language === "en" ? "Key Achievements" : "முக்கிய சாதனைகள்"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {leader.achievements(language).map((achievement: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-neon/10 rounded-xl border border-neon/20">
                          <Award className="w-4 h-4 text-neon flex-shrink-0" />
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default LeaderDetail