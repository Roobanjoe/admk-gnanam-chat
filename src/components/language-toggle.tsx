import { useState } from "react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Languages } from "lucide-react"

interface LanguageToggleProps {
  language: "en" | "ta"
  onLanguageChange: (lang: "en" | "ta") => void
  className?: string
}

export function LanguageToggle({ 
  language, 
  onLanguageChange, 
  className 
}: LanguageToggleProps) {
  return (
    <EnhancedButton
      variant="glass"
      size="sm"
      onClick={() => onLanguageChange(language === "en" ? "ta" : "en")}
      className={className}
    >
      <Languages className="w-4 h-4" />
      <span className="font-medium">
        {language === "en" ? "தமிழ்" : "EN"}
      </span>
    </EnhancedButton>
  )
}

// Translations map
export const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    leaders: "Leaders", 
    elections: "Elections",
    manifestos: "Manifestos",
    chat: "Chat",
    settings: "Settings",
    knowledge: "Knowledge",
    signIn: "Sign In",
    signOut: "Sign Out",
    
    // Hero section
    heroTitle: "AIADMK",
    heroSubtitle: "Knowledge Platform",
    startChat: "Start Chat",
    learnMore: "Learn More",
    
    // Features
    featuredSections: "Featured Sections",
    partyLeaders: "Party Leaders",
    electionHistory: "Election History",
    partyManifestos: "Party Manifestos",
    
    // Auth
    phone: "Phone Number",
    enterPhone: "Enter your phone number",
    sendOTP: "Send OTP",
    verifyOTP: "Verify OTP",
    otpSent: "OTP sent to your phone",
    resendOTP: "Resend OTP",
    
    // Chat
    newConversation: "New Conversation",
    typeMessage: "Type your message...",
    send: "Send",
    
    // Settings
    defaultLanguage: "Default Language",
    temperature: "Temperature",
    maxTokens: "Max Tokens",
    theme: "Theme",
    tnPartyOnly: "TN/Party-only answers",
    clearHistory: "Clear History",
    
    // Common
    loading: "Loading...",
    error: "Error",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View"
  },
  ta: {
    // Navigation  
    home: "முகப்பு",
    about: "எங்களைப் பற்றி",
    leaders: "தலைவர்கள்",
    elections: "தேர்தல்கள்", 
    manifestos: "தேர்தல் அறிக்கைகள்",
    chat: "அரட்டை",
    settings: "அமைப்புகள்",
    knowledge: "அறிவு",
    signIn: "உள்நுழை",
    signOut: "வெளியேறு",
    
    // Hero section
    heroTitle: "அ.இ.அ.த.மு.க",
    heroSubtitle: "அறிவு தளம்",
    startChat: "அரட்டை தொடங்கு",
    learnMore: "மேலும் அறிய",
    
    // Features
    featuredSections: "சிறப்பு பிரிவுகள்",
    partyLeaders: "கட்சி தலைவர்கள்",
    electionHistory: "தேர்தல் வரலாறு", 
    partyManifestos: "கட்சி அறிக்கைகள்",
    
    // Auth
    phone: "தொலைபேசி எண்",
    enterPhone: "உங்கள் தொலைபேசி எண்ணை உள்ளிடுங்கள்",
    sendOTP: "OTP அனுப்பு",
    verifyOTP: "OTP சரிபார்",
    otpSent: "OTP உங்கள் தொலைபேசிக்கு அனுப்பப்பட்டது",
    resendOTP: "OTP மீண்டும் அனுப்பு",
    
    // Chat
    newConversation: "புதிய உரையாடல்",
    typeMessage: "உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...",
    send: "அனுப்பு",
    
    // Settings
    defaultLanguage: "முன்னிருப்பு மொழி",
    temperature: "வெப்பநிலை",
    maxTokens: "அதிகபட்ச டோக்கன்கள்",
    theme: "தீம்",
    tnPartyOnly: "தமிழ்நாடு/கட்சி மட்டும் பதில்கள்",
    clearHistory: "வரலாற்றை அழி",
    
    // Common
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    save: "சேமி",
    cancel: "ரத்து செய்",
    delete: "நீக்கு",
    edit: "திருத்து", 
    view: "பார்"
  }
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export function useTranslation(language: Language) {
  return {
    t: (key: TranslationKey): string => {
      if (!language || !translations[language]) {
        return key;
      }
      return translations[language][key] || key;
    },
    language
  }
}