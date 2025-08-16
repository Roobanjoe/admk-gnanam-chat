import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { BackButton } from "@/components/ui/back-button"
import { useTranslation, type Language } from "@/components/language-toggle"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { User, Calendar, Award, ArrowRight } from "lucide-react"

// Import leader images - updated
import cnAnnaduraiImg from "@/assets/leaders/cn-annadurai.jpg"
import mgRamachandranImg from "@/assets/leaders/mg-ramachandran.jpg"
import jJayalalithaaImg from "@/assets/leaders/j-jayalalithaa.jpg"
import edappadiPalaniswamiImg from "@/assets/leaders/edappadi-palaniswami.jpg"

const Leaders = () => {
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState<Language>("en")
  const [selectedLeader, setSelectedLeader] = useState<any>(null)
  const { t } = useTranslation(language)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

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

  const leaders = [
    {
      id: 1,
      name: language === "en" ? "C. N. Annadurai" : "சி. என். அண்ணாதுரை",
      title: language === "en" ? "Founder of Dravidian Movement" : "திராவிட இயக்கத்தின் நிறுவனர்",
      period: "1909 - 1969",
      image: cnAnnaduraiImg,
      description: language === "en"
        ? "Known as 'Anna' (Elder Brother), C.N. Annadurai was a pioneering leader of the Dravidian movement and served as the Chief Minister of Tamil Nadu from 1967 to 1969."
        : "'அண்ணா' (மூத்த சகோதரன்) என்று அறியப்பட்ட சி.என். அண்ணாதுரை திராவிட இயக்கத்தின் முன்னோடி தலைவர் மற்றும் 1967 முதல் 1969 வரை தமிழ்நாட்டின் முதலமைச்சராக பணியாற்றினார்",
      achievements: language === "en"
        ? ["First DMK Chief Minister", "Champion of Tamil language", "Social reformer", "Acclaimed writer and orator"]
        : ["முதல் திமுக முதலமைச்சர்", "தமிழ் மொழியின் ஆதரவாளர்", "சமூக சீர்திருத்தவாதி", "புகழ்பெற்ற எழுத்தாளர் மற்றும் பேச்சாளர்"]
    },
    {
      id: 2,
      name: language === "en" ? "M. G. Ramachandran" : "எம். ஜி. ராமச்சந்திரன்",
      title: language === "en" ? "Founder of AIADMK" : "அ.இ.அ.த.மு.க நிறுவனர்",
      period: "1917 - 1987",
      image: mgRamachandranImg,
      description: language === "en"
        ? "Popularly known as MGR, he was an actor-turned-politician who founded AIADMK in 1972 and served as Tamil Nadu's Chief Minister for ten years."
        : "எம்ஜிஆர் என்று பிரபலமாக அழைக்கப்பட்ட அவர் நடிகரிலிருந்து அரசியல்வாதியானவர், 1972 இல் அ.இ.அ.த.மு.க-ஐ நிறுவியவர் மற்றும் பத்து ஆண்டுகள் தமிழ்நாட்டின் முதலமைச்சராக பணியாற்றியவர்",
      achievements: language === "en"
        ? ["Founded AIADMK", "Three-time Chief Minister", "Film industry icon", "Pioneer of welfare schemes"]
        : ["அ.இ.அ.த.மு.க நிறுவனர்", "மூன்று முறை முதலமைச்சர்", "திரைத்துறை ஐகன்", "நலத்திட்டங்களின் முன்னோடி"]
    },
    {
      id: 3,
      name: language === "en" ? "J. Jayalalithaa" : "ஜே. ஜெயலலிதா",
      title: language === "en" ? "Iron Lady of Tamil Nadu" : "தமிழ்நாட்டின் இரும்பு பெண்",
      period: "1948 - 2016",
      image: jJayalalithaaImg,
      description: language === "en"
        ? "Known as 'Amma' (Mother), J. Jayalalithaa was a charismatic leader who served as Chief Minister for over 14 years and championed women's rights."
        : "'அம்மா' (தாய்) என்று அறியப்பட்ட ஜே. ஜெயலலிதா 14 ஆண்டுகளுக்கும் மேலாக முதலமைச்சராக பணியாற்றிய கவர்ச்சிமிக்க தலைவர் மற்றும் பெண்கள் உரிமைகளுக்காக போராடியவர்",
      achievements: language === "en"
        ? ["Six-time Chief Minister", "Women empowerment advocate", "Revolutionary welfare schemes", "International recognition"]
        : ["ஆறு முறை முதலமைச்சர்", "பெண்கள் அதிகாரமளிப்பு வக்கீல்", "புரட்சிகர நலத்திட்டங்கள்", "சர்வதேச அங்கீகாரம்"]
    },
    {
      id: 4,
      name: language === "en" ? "Edappadi K. Palaniswami" : "எடப்பாடி கே. பழனிசாமி",
      title: language === "en" ? "Current General Secretary" : "தற்போதைய பொதுச் செயலாளர்",
      period: "1954 - Present",
      image: "/lovable-uploads/37803aec-9a29-4b46-8d2a-14d6870b2138.png",
      description: language === "en"
        ? "A seasoned politician and administrator who served as Chief Minister and is currently leading the party as General Secretary."
        : "முதலமைச்சராக பணியாற்றிய அனுபவமிக்க அரசியல்வாதி மற்றும் நிர்வாகி, தற்போது கட்சியின் பொதுச் செயலாளராக தலைமை தாங்குகிறார்",
      achievements: language === "en"
        ? ["Former Chief Minister", "Experienced administrator", "Party leader", "Development advocate"]
        : ["முன்னாள் முதலமைச்சர்", "அனுபவமிக்க நிர்வாகி", "கட்சி தலைவர்", "வளர்ச்சி வக்கீல்"]
    }
  ]

  if (selectedLeader) {
    return (
      <div className="min-h-screen">
        <Navigation 
          user={user}
          onSignOut={handleSignOut}
          language={language}
          onLanguageChange={setLanguage}
        />
        
        <div className="container mx-auto px-6 lg:px-8 py-12">
          <EnhancedButton
            variant="glass"
            onClick={() => setSelectedLeader(null)}
            className="mb-8"
          >
            ← {language === "en" ? "Back to Leaders" : "தலைவர்களுக்கு திரும்பு"}
          </EnhancedButton>

          <div className="max-w-4xl mx-auto">
            <GlassCard variant="elevated" padding="lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="w-full h-64 bg-glass-hover rounded-2xl overflow-hidden mb-6">
                    <img 
                      src={selectedLeader.image} 
                      alt={selectedLeader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h1 className="font-display font-bold text-2xl mb-2 text-neon">
                      {selectedLeader.name}
                    </h1>
                    <p className="text-muted-foreground mb-4">{selectedLeader.title}</p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedLeader.period}</span>
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
                        {selectedLeader.description}
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="font-display font-semibold text-xl mb-4 text-neon">
                        {language === "en" ? "Key Achievements" : "முக்கிய சாதனைகள்"}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedLeader.achievements.map((achievement: string, index: number) => (
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

  return (
    <div className="min-h-screen">
      <Navigation 
        user={user}
        onSignOut={handleSignOut}
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
              : "அ.இ.அ.த.மு.க மற்றும் தமிழ்நாட்டின் அரசியல் நிலப்பரப்பை வடிவமைத்த தொலைநோக்கு தலைவர்களை ஆராயுங்கள்"
            }
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leaders.map((leader) => (
            <GlassCard
              key={leader.id}
              variant="default"
              className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedLeader(leader)}
            >
              <GlassCardHeader>
                <div className="w-full h-48 bg-glass-hover rounded-xl overflow-hidden mb-4 group-hover:bg-neon/10 transition-colors">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <GlassCardTitle className="text-lg line-clamp-2">
                  {leader.name}
                </GlassCardTitle>
                <div className="text-sm text-muted-foreground mb-2">
                  {leader.title}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>{leader.period}</span>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {leader.description}
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