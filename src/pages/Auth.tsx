import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card"
import { Label } from "@/components/ui/label"
import { LanguageToggle, useTranslation, type Language } from "@/components/language-toggle"
import { PhoneInput } from "@/components/ui/phone-input"
import { OTPInput } from "@/components/ui/otp-input"
import { toast } from "sonner"
import { ArrowLeft, Phone, Shield, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { sendOTP, verifyOTP, onAuthStateChange, initializeRecaptcha, cleanup } from "@/lib/auth"

type AuthStep = "phone" | "otp" | "success"

const Auth = () => {
  const [step, setStep] = useState<AuthStep>("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const [countdown, setCountdown] = useState(0)
  const navigate = useNavigate()
  const { t } = useTranslation(language)

  useEffect(() => {
    // Check if user is already logged in and set up auth listener
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        navigate("/")
      }
    })

    // Initialize reCAPTCHA
    initializeRecaptcha()

    return () => {
      unsubscribe()
      cleanup()
    }
  }, [navigate])

  useEffect(() => {
    // Countdown timer for resend OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone validation - should start with + and have at least 10 digits
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    return phoneRegex.test(phone)
  }

  const handleSendOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error(language === "en" 
        ? "Please enter a valid phone number" 
        : "சரியான தொலைபேசி எண்ணை உள்ளிடுங்கள்")
      return
    }

    setIsLoading(true)
    try {
      const result = await sendOTP(phoneNumber)
      
      if (result.success) {
        toast.success(language === "en" 
          ? "OTP sent to your phone" 
          : "OTP உங்கள் தொலைபேசிக்கு அனுப்பப்பட்டது")
        
        setStep("otp")
        setCountdown(60) // 60 second cooldown
      } else {
        throw new Error(result.error || 'Failed to send OTP')
      }
    } catch (error: any) {
      console.error('Send OTP error:', error)
      if (error.message.includes('Too many') || error.message.includes('quota')) {
        toast.error(language === "en" 
          ? "Too many requests. Please try again later." 
          : "அதிகமான கோரிக்கைகள். பின்னர் முயற்சிக்கவும்.")
      } else {
        toast.error(language === "en" 
          ? error.message || "Failed to send OTP. Please try again." 
          : "OTP அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error(language === "en" 
        ? "Please enter the complete 6-digit code" 
        : "முழு 6 இலக்க குறியீட்டை உள்ளிடுங்கள்")
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyOTP(otpCode)
      
      if (result.success && result.user) {
        setStep("success")
        toast.success(language === "en" 
          ? "Successfully logged in!" 
          : "வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!")
        setTimeout(() => navigate("/"), 1500)
      } else {
        throw new Error(result.error || 'Failed to verify OTP')
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error)
      if (error.message.includes('Invalid') || error.message.includes('code')) {
        toast.error(language === "en" 
          ? "Invalid OTP. Please check and try again." 
          : "தவறான OTP. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.")
      } else if (error.message.includes('expired')) {
        toast.error(language === "en" 
          ? "OTP has expired. Please request a new one." 
          : "OTP காலாவதியாகிவிட்டது. புதிதாக கோருங்கள்.")
        setStep("phone")
        setOtpCode("")
      } else {
        toast.error(language === "en" 
          ? error.message || "Failed to verify OTP. Please try again." 
          : "OTP சரிபார்க்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeNumber = () => {
    setStep("phone")
    setOtpCode("")
    setCountdown(0)
  }

  const handleResendOTP = () => {
    if (countdown === 0) {
      setOtpCode("")
      handleSendOTP()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
              {step === "phone" && <Phone className="w-8 h-8 text-primary-foreground" />}
              {step === "otp" && <Shield className="w-8 h-8 text-primary-foreground" />}
              {step === "success" && <span className="text-primary-foreground font-display font-bold text-2xl">✓</span>}
            </div>
            <GlassCardTitle className="text-2xl">
              {step === "phone" && (language === "en" ? "Enter your phone number" : "உங்கள் தொலைபேசி எண்ணை உள்ளிடுங்கள்")}
              {step === "otp" && (language === "en" ? "Verify your phone" : "உங்கள் தொலைபேசியை சரிபார்க்கவும்")}
              {step === "success" && (language === "en" ? "Welcome!" : "வரவேற்கிறோம்!")}
            </GlassCardTitle>
            <GlassCardDescription>
              {step === "phone" && (language === "en" 
                ? "We'll send you a verification code to sign in" 
                : "உள்நுழைய நாங்கள் உங்களுக்கு ஒரு சரிபார்ப்பு குறியீட்டை அனுப்புவோம்")}
              {step === "otp" && (language === "en" 
                ? `We've sent a 6-digit code to ${phoneNumber}` 
                : `${phoneNumber} க்கு 6 இலக்க குறியீட்டை அனுப்பியுள்ளோம்`)}
              {step === "success" && (language === "en" 
                ? "You're signed in. Redirecting to your dashboard..." 
                : "நீங்கள் உள்நுழைந்துள்ளீர்கள். உங்கள் டாஷ்போர்டுக்கு திருப்பி விடப்படுகிறது...")}
            </GlassCardDescription>
          </GlassCardHeader>

          <GlassCardContent className="space-y-6">
            {/* reCAPTCHA container (invisible) */}
            <div id="recaptcha-container"></div>
            
            {/* Language Toggle */}
            <div className="flex justify-center">
              <LanguageToggle 
                language={language} 
                onLanguageChange={setLanguage} 
              />
            </div>

            {/* Phone Input Step */}
            {step === "phone" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {language === "en" ? "Phone Number" : "தொலைபேசி எண்"}
                  </Label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    defaultCountry="IN"
                  />
                </div>

                <EnhancedButton
                  type="button"
                  variant="neon"
                  size="lg"
                  className="w-full"
                  onClick={handleSendOTP}
                  disabled={isLoading || !phoneNumber}
                >
                  {isLoading ? (language === "en" ? "Sending..." : "அனுப்புகிறது...") : (language === "en" ? "Send OTP" : "OTP அனுப்பு")}
                </EnhancedButton>
              </div>
            )}

            {/* OTP Input Step */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-center block">
                    {language === "en" ? "Enter verification code" : "சரிபார்ப்பு குறியீட்டை உள்ளிடுங்கள்"}
                  </Label>
                  <OTPInput
                    value={otpCode}
                    onChange={setOtpCode}
                    length={6}
                    disabled={isLoading}
                  />
                </div>

                <EnhancedButton
                  type="button"
                  variant="neon"
                  size="lg"
                  className="w-full"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otpCode.length !== 6}
                >
                  {isLoading ? (language === "en" ? "Verifying..." : "சரிபார்க்கிறது...") : (language === "en" ? "Verify & Continue" : "சரிபார்த்து தொடரவும்")}
                </EnhancedButton>

                <div className="text-center space-y-3">
                  {countdown > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {language === "en" 
                          ? `Resend in ${countdown}s` 
                          : `${countdown}வ மீண்டும் அனுப்பு`}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-sm text-neon hover:text-neon/80 transition-colors"
                      disabled={isLoading}
                    >
                      {language === "en" ? "Didn't receive it? Resend OTP" : "பெறவில்லையா? OTP ஐ மீண்டும் அனுப்பு"}
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    className="text-sm text-muted-foreground hover:text-neon transition-colors block mx-auto"
                  >
                    {language === "en" ? "Change number" : "எண்ணை மாற்று"}
                  </button>
                </div>
              </div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <div className="text-center space-y-4">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {language === "en" ? "You're signed in!" : "நீங்கள் உள்நுழைந்துள்ளீர்கள்!"}
                </p>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}

export default Auth