import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { BackButton } from "@/components/ui/back-button"
import { useTranslation, type Language } from "@/components/language-toggle"
import { 
  Calendar, 
  Trophy, 
  Users, 
  TrendingUp, 
  Crown, 
  Award,
  Vote,
  BarChart3,
  Target,
  CheckCircle,
  XCircle
} from "lucide-react"

const Elections = () => {
  const [language, setLanguage] = useState<Language>("en")
  const [selectedElection, setSelectedElection] = useState<any>(null)
  const { t } = useTranslation(language)

  const elections = [
    {
      id: 1,
      year: "1977",
      type: "Assembly Election",
      seatsContested: 200,
      seatsWon: 130,
      voteShare: "30.0%",
      alliance: "None (AIADMK fought largely on its own)",
      leader: "M.G. Ramachandran (MGR)",
      result: "VICTORY",
      summary: "First big victory, MGR became CM, AIADMK replaced DMK in power.",
      significance: "Historic debut victory that established AIADMK as a major political force",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 2,
      year: "1980",
      type: "Lok Sabha Election",
      seatsContested: 38,
      seatsWon: 20,
      voteShare: "32.0%",
      alliance: "Indira Gandhi's Congress (I)",
      leader: "M.G. Ramachandran (MGR)",
      result: "VICTORY",
      summary: "Alliance with Congress helped AIADMK secure majority in Tamil Nadu.",
      significance: "Strategic alliance that strengthened AIADMK's national presence",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 3,
      year: "1991",
      type: "Assembly Election",
      seatsContested: 234,
      seatsWon: 225,
      voteShare: "44.4%",
      alliance: "Indian National Congress (INC)",
      leader: "J. Jayalalithaa",
      result: "LANDSLIDE",
      summary: "Historic landslide after Rajiv Gandhi assassination, AIADMK-Congress sweep.",
      significance: "Jayalalithaa's first victory and one of the most decisive wins in TN history",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 4,
      year: "2011",
      type: "Assembly Election",
      seatsContested: 160,
      seatsWon: 150,
      voteShare: "38.4%",
      alliance: "DMDK, Left parties, MDMK",
      leader: "J. Jayalalithaa",
      result: "VICTORY",
      summary: "Jayalalithaa returned as CM with huge majority.",
      significance: "Comeback victory that demonstrated AIADMK's resilience",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 5,
      year: "2021",
      type: "Assembly Election",
      seatsContested: 191,
      seatsWon: 75,
      voteShare: "33.3%",
      alliance: "BJP, PMK, others",
      leader: "Edappadi K. Palaniswami (EPS)",
      result: "DEFEAT",
      summary: "AIADMK lost power after 10 years, became opposition.",
      significance: "End of a decade-long rule, transition to new leadership era",
      color: "from-gray-500 to-slate-600"
    }
  ]

  const getResultIcon = (result: string) => {
    switch (result) {
      case "LANDSLIDE":
        return <Crown className="w-5 h-5" />
      case "VICTORY":
        return <CheckCircle className="w-5 h-5" />
      case "DEFEAT":
        return <XCircle className="w-5 h-5" />
      default:
        return <Vote className="w-5 h-5" />
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "LANDSLIDE":
        return "text-yellow-400"
      case "VICTORY":
        return "text-green-400"
      case "DEFEAT":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  if (selectedElection) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation
          language={language}
          onLanguageChange={setLanguage}
        />

        <div className="container mx-auto px-6 lg:px-8 py-12">
          <BackButton className="mb-4" />
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${selectedElection.color} text-white px-6 py-3 rounded-full mb-4`}>
                {getResultIcon(selectedElection.result)}
                <span className="font-bold text-lg">{selectedElection.year} {selectedElection.type}</span>
              </div>
              <h1 className="font-display font-bold text-3xl lg:text-4xl mb-2 text-neon">
                {selectedElection.result}
              </h1>
              <p className="text-xl text-muted-foreground">
                Led by {selectedElection.leader}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <GlassCard variant="default">
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-neon" />
                    Election Statistics
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Seats Contested:</span>
                      <span className="font-semibold text-lg">{selectedElection.seatsContested}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Seats Won:</span>
                      <span className="font-semibold text-lg text-neon">{selectedElection.seatsWon}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Vote Share:</span>
                      <span className="font-semibold text-lg text-neon">{selectedElection.voteShare}</span>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground mb-2">Victory Rate</div>
                      <div className="w-full bg-glass-hover rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${selectedElection.color}`}
                          style={{ width: `${(selectedElection.seatsWon / selectedElection.seatsContested) * 100}%` }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {((selectedElection.seatsWon / selectedElection.seatsContested) * 100).toFixed(1)}% success rate
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard variant="default">
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-neon" />
                    Alliance & Leadership
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Party Leader</div>
                      <div className="font-semibold text-neon">{selectedElection.leader}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Alliance Partners</div>
                      <div className="font-medium">{selectedElection.alliance}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Election Type</div>
                      <div className="font-medium">{selectedElection.type}</div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>

            <GlassCard variant="default" className="mb-6">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-neon" />
                  Result Summary
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-lg leading-relaxed mb-4">{selectedElection.summary}</p>
                <div className="bg-glass-light p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Historical Significance</div>
                  <p className="text-neon font-medium">{selectedElection.significance}</p>
                </div>
              </GlassCardContent>
            </GlassCard>

            <div className="text-center">
              <EnhancedButton 
                variant="glass" 
                onClick={() => setSelectedElection(null)}
                className="px-8 py-3"
              >
                ← Back to Elections Timeline
              </EnhancedButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="container mx-auto px-6 lg:px-8 py-12">
        <BackButton className="mb-4" />
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-neon/10 border border-neon/20 rounded-full px-6 py-3 mb-6">
            <Vote className="w-5 h-5 text-neon" />
            <span className="text-sm font-medium text-neon">Electoral History</span>
          </div>
          <h1 className="font-display font-bold text-4xl lg:text-5xl mb-6 text-neon">
            AIADMK Elections
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Journey through the electoral victories and defeats that shaped AIADMK's political legacy in Tamil Nadu
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-neon via-neon/50 to-transparent hidden lg:block" />
            
            <div className="space-y-8 lg:space-y-12">
              {elections.map((election, index) => (
                <div 
                  key={election.id} 
                  className={`flex flex-col lg:flex-row items-center gap-6 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-neon rounded-full border-4 border-background shadow-neon" />
                  
                  {/* Election Card */}
                  <div className="w-full lg:w-5/12">
                    <GlassCard
                      variant="default"
                      className="group hover:scale-105 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedElection(election)}
                    >
                      <GlassCardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${election.color} text-white px-3 py-1 rounded-full text-sm`}>
                            {getResultIcon(election.result)}
                            <span className="font-semibold">{election.result}</span>
                          </div>
                          <div className="text-2xl font-bold text-neon">{election.year}</div>
                        </div>
                        <GlassCardTitle className="text-xl mb-2">
                          {election.type}
                        </GlassCardTitle>
                        <div className="text-sm text-muted-foreground">
                          Led by {election.leader}
                        </div>
                      </GlassCardHeader>
                      <GlassCardContent>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-neon">{election.seatsWon}</div>
                            <div className="text-xs text-muted-foreground">Seats Won</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-neon">{election.voteShare}</div>
                            <div className="text-xs text-muted-foreground">Vote Share</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-neon">
                              {((election.seatsWon / election.seatsContested) * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Success Rate</div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {election.summary}
                        </p>
                        
                        <EnhancedButton variant="glass" size="sm" className="w-full group-hover:bg-neon/10">
                          View Details →
                        </EnhancedButton>
                      </GlassCardContent>
                    </GlassCard>
                  </div>
                  
                  {/* Spacer for timeline */}
                  <div className="hidden lg:block w-2/12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-20">
          <GlassCard variant="default" className="max-w-4xl mx-auto">
            <GlassCardHeader>
              <GlassCardTitle className="text-center text-2xl">
                Electoral Performance Summary
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-neon mb-2">
                    {elections.filter(e => e.result !== "DEFEAT").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Victories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-neon mb-2">
                    {elections.filter(e => e.result === "LANDSLIDE").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Landslides</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-neon mb-2">
                    {Math.round(elections.reduce((acc, e) => acc + parseFloat(e.voteShare), 0) / elections.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Vote Share</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-neon mb-2">44</div>
                  <div className="text-sm text-muted-foreground">Years in Politics</div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default Elections