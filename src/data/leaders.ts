import { Language } from "@/components/language-toggle"

export interface Leader {
  id: number
  slug: string
  name: (language: Language) => string
  title: (language: Language) => string
  period: string
  image: string
  description: (language: Language) => string
  achievements: (language: Language) => string[]
}

export const leadersData: Leader[] = [
  {
    id: 1,
    slug: "c-n-annadurai",
    name: (language: Language) => language === "en" ? "C. N. Annadurai" : "சி. என். அண்ணாதுரை",
    title: (language: Language) => language === "en" ? "Founder of Dravidian Movement" : "திராவிட இயக்கத்தின் நிறுவனர்",
    period: "1909 - 1969",
    image: "/lovable-uploads/e1d58dd2-9cba-4d26-8e84-88974cb0d694.png",
    description: (language: Language) => language === "en"
      ? "Known as 'Anna' (Elder Brother), C.N. Annadurai was a pioneering leader of the Dravidian movement and served as the Chief Minister of Tamil Nadu from 1967 to 1969."
      : "'அண்ணா' (மூத்த சகோதரன்) என்று அறியப்பட்ட சி.என். அண்ணாதுரை திராவிட இயக்கத்தின் முன்னோடி தலைவர் மற்றும் 1967 முதல் 1969 வரை தமிழ்நாட்டின் முதலமைச்சராக பணியாற்றினார்",
    achievements: (language: Language) => language === "en"
      ? ["First DMK Chief Minister", "Champion of Tamil language", "Social reformer", "Acclaimed writer and orator"]
      : ["முதல் திமுக முதலமைச்சர்", "தமிழ் மொழியின் ஆதரவாளர்", "சமூக சீர்திருத்தவாதி", "புகழ்பெற்ற எழுத்தாளர் மற்றும் பேச்சாளர்"]
  },
  {
    id: 2,
    slug: "m-g-ramachandran",
    name: (language: Language) => language === "en" ? "M. G. Ramachandran" : "எம். ஜி. ராமச்சந்திரன்",
    title: (language: Language) => language === "en" ? "Founder of AIADMK" : "அ.இ.அ.த.மு.க நிறுவனர்",
    period: "1917 - 1987",
    image: "/lovable-uploads/aa084626-b12f-46b6-926d-29c179d3e9c8.png",
    description: (language: Language) => language === "en"
      ? "Popularly known as MGR, he was an actor-turned-politician who founded AIADMK in 1972 and served as Tamil Nadu's Chief Minister for ten years."
      : "எம்ஜிஆர் என்று பிரபலமாக அழைக்கப்பட்ட அவர் நடிகரிலிருந்து அரசியல்வாதியானவர், 1972 இல் அ.இ.அ.த.மு.க-ஐ நிறுவியவர் மற்றும் பத்து ஆண்டுகள் தமிழ்நாட்டின் முதலமைச்சராக பணியாற்றியவர்",
    achievements: (language: Language) => language === "en"
      ? ["Founded AIADMK", "Three-time Chief Minister", "Film industry icon", "Pioneer of welfare schemes"]
      : ["அ.இ.அ.த.மு.க நிறுவனர்", "மூன்று முறை முதலமைச்சர்", "திரைத்துறை ஐகன்", "நலத்திட்டங்களின் முன்னோடி"]
  },
  {
    id: 3,
    slug: "j-jayalalithaa",
    name: (language: Language) => language === "en" ? "J. Jayalalithaa" : "ஜே. ஜெயலலிதா",
    title: (language: Language) => language === "en" ? "Iron Lady of Tamil Nadu" : "தமிழ்நாட்டின் இரும்பு பெண்",
    period: "1948 - 2016",
    image: "/lovable-uploads/903e2f1f-62f2-4423-a729-8e88b8c0346e.png",
    description: (language: Language) => language === "en"
      ? "Known as 'Amma' (Mother), J. Jayalalithaa was a charismatic leader who served as Chief Minister for over 14 years and championed women's rights."
      : "'அம்மா' (தாய்) என்று அறியப்பட்ட ஜே. ஜெயலலிதா 14 ஆண்டுகளுக்கும் மேலாக முதலமைச்சராக பணியாற்றிய கவர்ச்சிமிக்க தலைவர் மற்றும் பெண்கள் உரிமைகளுக்காக போராடியவர்",
    achievements: (language: Language) => language === "en"
      ? ["Six-time Chief Minister", "Women empowerment advocate", "Revolutionary welfare schemes", "International recognition"]
      : ["ஆறு முறை முதலமைச்சர்", "பெண்கள் அதிகாரமளிப்பு வக்கீல்", "புரட்சிகர நலத்திட்டங்கள்", "சர்வதேச அங்கீகாரம்"]
  },
  {
    id: 4,
    slug: "edappadi-k-palaniswami",
    name: (language: Language) => language === "en" ? "Edappadi K. Palaniswami" : "எடப்பாடி கே. பழனிசாமி",
    title: (language: Language) => language === "en" ? "Current General Secretary" : "தற்போதைய பொதுச் செயலாளர்",
    period: "1954 - Present",
    image: "/lovable-uploads/37803aec-9a29-4b46-8d2a-14d6870b2138.png",
    description: (language: Language) => language === "en"
      ? "A seasoned politician and administrator who served as Chief Minister and is currently leading the party as General Secretary."
      : "முதலமைச்சராக பணியாற்றிய அனுபவமிக்க அரசியல்வாதி மற்றும் நிர்வாகி, தற்போது கட்சியின் பொதுச் செயலாளராக தலைமை தாங்குகிறார்",
    achievements: (language: Language) => language === "en"
      ? ["Former Chief Minister", "Experienced administrator", "Party leader", "Development advocate"]
      : ["முன்னாள் முதலமைச்சர்", "அனுபவமிக்க நிர்வாகி", "கட்சி தலைவர்", "வளர்ச்சி வக்கீல்"]
  }
]

export const getLeaderBySlug = (slug: string): Leader | undefined => {
  return leadersData.find(leader => leader.slug === slug)
}