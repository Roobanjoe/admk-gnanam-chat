import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card"
import { BackButton } from "@/components/ui/back-button"
import { useTranslation, type Language } from "@/components/language-toggle"
import { Calendar, Users, Heart, Award, Flag, Target } from "lucide-react"

const About = () => {
  const [language, setLanguage] = useState<Language>("en")
  const { t } = useTranslation(language)

  const timeline = [
    {
      year: "1972",
      title: language === "en" ? "Foundation" : "ஸ்தாபना",
      description: language === "en" 
        ? "AIADMK was founded by M. G. Ramachandran after breaking away from DMK"
        : "திமுகவிலிருந்து பிரிந்த பின்னர் எம். ஜி. ராமச்சந்திரன் அ.இ.அ.த.மு.க-ஐ நிறுவினார்"
    },
    {
      year: "1977",
      title: language === "en" ? "First Victory" : "முதல் வெற்றி",
      description: language === "en"
        ? "First electoral victory in Tamil Nadu Assembly elections under MGR's leadership"
        : "எம்ஜிஆர் தலைமையில் தமிழ்நாடு சட்டமன்றத் தேர்தலில் முதல் தேர்தல் வெற்றி"
    },
    {
      year: "1987",
      title: language === "en" ? "Leadership Transition" : "தலைமை மாற்றம்",
      description: language === "en"
        ? "After MGR's passing, J. Jayalalithaa emerged as the party's leader"
        : "எம்ஜிஆர் இறப்புக்குப் பிறகு, ஜே. ஜெயலலிதா கட்சியின் தலைவராக உருவெடுத்தார்"
    },
    {
      year: "1991",
      title: language === "en" ? "Return to Power" : "அதிகாரத்திற்கு திரும்புதல்",
      description: language === "en"
        ? "Jayalalithaa became Chief Minister for the first time"
        : "ஜெயலலிதா முதல் முறையாக முதலமைச்சரானார்"
    },
    {
      year: "2021",
      title: language === "en" ? "New Leadership" : "புதிய தலைமை",
      description: language === "en"
        ? "Edappadi K. Palaniswami became the party's interim general secretary"
        : "எடப்பாடி கே. பழனிசாமி கட்சியின் இடைக்கால பொதுச் செயலாளரானார்"
    }
  ]

  const values = [
    {
      icon: Heart,
      title: language === "en" ? "Social Welfare" : "சமூக நலன்",
      description: language === "en"
        ? "Commitment to uplifting the underprivileged sections of society"
        : "சமுதாயத்தின் பின்தங்கிய பிரிவினரை உயர்த்துவதற்கான உறுதிப்பாடு"
    },
    {
      icon: Flag,
      title: language === "en" ? "Tamil Identity" : "தமிழ் அடையாளம்",
      description: language === "en"
        ? "Preserving and promoting Tamil language, culture, and heritage"
        : "தமிழ் மொழி, கலாச்சாரம் மற்றும் பாரம்பரியத்தை பாதுகாத்தல் மற்றும் மேம்படுத்துதல்"
    },
    {
      icon: Users,
      title: language === "en" ? "Women Empowerment" : "பெண்கள் அதிகாரமளித்தல்",
      description: language === "en"
        ? "Pioneering women's rights and empowerment initiatives"
        : "பெண்கள் உரிமைகள் மற்றும் அதிகாரமளிப்பு முன்முயற்சிகளில் முன்னோடி"
    },
    {
      icon: Target,
      title: language === "en" ? "Good Governance" : "நல்ல ஆட்சி",
      description: language === "en"
        ? "Transparent and efficient administration for public welfare"
        : "பொது நலனுக்காக வெளிப்படையான மற்றும் திறமையான நிர்வாகம்"
    }
  ]

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
            {language === "en" ? "About AIADMK" : "அ.இ.அ.த.மு.க பற்றி"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === "en"
              ? "All India Anna Dravida Munnetra Kazhagam - A political movement dedicated to the welfare of Tamil Nadu and its people"
              : "அகில இந்திய அண்ணா திராவிட முன்னேற்றக் கழகம் - தமிழ்நாடு மற்றும் அதன் மக்களின் நலனுக்காக அர்ப்பணித்த அரசியல் இயக்கம்"
            }
          </p>
        </div>

        {/* Overview */}
        <div className="mb-20">
          <GlassCard variant="elevated" padding="lg">
            <GlassCardHeader>
              <GlassCardTitle className="text-2xl mb-4">
                {language === "en" ? "Party Overview" : "கட்சி மேலோட்டம்"}
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="prose prose-invert max-w-none">
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  {language === "en"
                    ? "The All India Anna Dravida Munnetra Kazhagam (AIADMK) is a Dravidian political party in India, particularly in the state of Tamil Nadu where it has been one of the two major parties since the 1970s. The party was founded in 1972 by M. G. Ramachandran and is named after C. N. Annadurai, the former Chief Minister of Tamil Nadu."
                    : "அகில இந்திய அண்ணா திராவிட முன்னேற்றக் கழகம் (அ.இ.அ.த.மு.க) இந்தியாவில், குறிப்பாக தமிழ்நாடு மாநிலத்தில் உள்ள ஒரு திராவிட அரசியல் கட்சியாகும், இது 1970களில் இருந்து இரண்டு முக்கிய கட்சிகளில் ஒன்றாக இருந்து வருகிறது. இந்த கட்சி 1972 இல் எம். ஜி. ராமச்சந்திரனால் நிறுவப்பட்டது, தமிழ்நாட்டின் முன்னாள் முதலமைச்சர் சி. என். அண்ணாதுரையின் பெயரிடப்பட்டது."
                  }
                </p>
                <p>
                  {language === "en"
                    ? "The party has played a crucial role in Tamil Nadu's political landscape, governing the state for multiple terms and implementing various welfare schemes that have benefited millions of people. AIADMK has been at the forefront of championing Tamil rights, women's empowerment, and social justice."
                    : "தமிழ்நாட்டின் அரசியல் நிலப்பரப்பில் கட்சி முக்கிய பங்கு வகித்துள்ளது, பல முறை மாநிலத்தை ஆட்சி செய்து, மில்லியன் கணக்கான மக்களுக்கு பயனளித்த பல்வேறு நலத்திட்டங்களை நடைமுறைப்படுத்தியுள்ளது. தமிழ் உரிமைகள், பெண்கள் அதிகாரமளித்தல் மற்றும் சமூக நீதிக்காக போராடுவதில் அ.இ.அ.த.மு.க முன்னணியில் இருந்து வருகிறது."
                  }
                </p>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="font-display font-bold text-3xl mb-12 text-center text-neon">
            {language === "en" ? "Core Values" : "முக்கிய மதிப்புகள்"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <GlassCard key={index} variant="neon" className="text-center group hover:scale-105 transition-all duration-300">
                <GlassCardContent className="p-6">
                  <div className="w-16 h-16 bg-neon/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-neon/30 transition-colors">
                    <value.icon className="w-8 h-8 text-neon" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3 text-neon">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="font-display font-bold text-3xl mb-12 text-center text-neon">
            {language === "en" ? "Historical Timeline" : "வரலாற்று காலவரிசை"}
          </h2>
          <div className="space-y-6">
            {timeline.map((event, index) => (
              <GlassCard key={index} variant="default" className="group hover:border-neon/30 transition-all duration-300">
                <GlassCardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-neon/20 rounded-xl flex items-center justify-center group-hover:bg-neon/30 transition-colors">
                        <Calendar className="w-6 h-6 text-neon" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl font-display font-bold text-neon">{event.year}</span>
                      </div>
                      <h3 className="font-display font-semibold text-xl mb-2 text-foreground">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About