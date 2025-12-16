import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Navigation } from "@/components/navigation"
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card"
import { BackButton } from "@/components/ui/back-button"
import { useTranslation, type Language } from "@/components/language-toggle"
import { Calendar, ArrowRight } from "lucide-react"
import { leadersData } from "@/data/leaders"

const Leaders = () => {
  const [language, setLanguage] = useState<Language>("en")
  const navigate = useNavigate()
  const { t } = useTranslation(language)


  return (
    <div className="min-h-screen">
      <Navigation 
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="container mx-auto px-6 lg:px-8 py-12">
        <BackButton className="mb-4" />
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-4xl lg:text-5xl mb-6 text-neon">
            {t("leaders")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === "en"
              ? "Explore the visionary leaders who shaped AIADMK and Tamil Nadu's political landscape"
              : "அ.இ.அ. தி.மு.க மற்றும் தமிழ்நாட்டின் அரசியல் நிலப்பரப்பை வடிவமைத்த தொலைநோக்கு தலைவர்களை ஆராயுங்கள்"
            }
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leadersData.map((leader) => (
            <GlassCard
              key={leader.id}
              variant="default"
              className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/leaders/${leader.slug}`)}
            >
              <GlassCardHeader>
                <div className="w-full h-48 bg-glass-hover rounded-xl overflow-hidden mb-4 group-hover:bg-neon/10 transition-colors">
                  <img 
                    src={leader.image} 
                    alt={leader.name(language)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <GlassCardTitle className="text-lg line-clamp-2">
                  {leader.name(language)}
                </GlassCardTitle>
                <div className="text-sm text-muted-foreground mb-2">
                  {leader.title(language)}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>{leader.period}</span>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {leader.description(language)}
                </p>
                <div className="flex items-center text-neon group-hover:text-neon/80 transition-colors">
                  <span className="text-sm font-medium">
                    {language === "en" ? "Learn More" : "மேலும் அறிய"}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaders