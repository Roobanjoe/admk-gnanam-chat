import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
}

const countries: Country[] = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
]

interface PhoneInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value?: string
  onChange?: (value: string) => void
  defaultCountry?: string
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, defaultCountry = "IN", ...props }, ref) => {
    const [selectedCountry, setSelectedCountry] = React.useState(
      countries.find(c => c.code === defaultCountry) || countries[1]
    )
    const [phoneNumber, setPhoneNumber] = React.useState("")

    React.useEffect(() => {
      // Parse existing value if provided
      if (value && !phoneNumber) {
        const country = countries.find(c => value.startsWith(c.dialCode))
        if (country) {
          setSelectedCountry(country)
          setPhoneNumber(value.slice(country.dialCode.length))
        }
      }
    }, [value, phoneNumber])

    const handleCountryChange = (countryCode: string) => {
      const country = countries.find(c => c.code === countryCode)
      if (country) {
        setSelectedCountry(country)
        const fullNumber = country.dialCode + phoneNumber
        onChange?.(fullNumber)
      }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const number = e.target.value.replace(/[^0-9]/g, "") // Only allow numbers
      setPhoneNumber(number)
      const fullNumber = selectedCountry.dialCode + number
      onChange?.(fullNumber)
    }

    return (
      <div className="flex">
        <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-24 rounded-r-none border-r-0 bg-glass backdrop-blur-glass border-glass-border">
            <SelectValue>
              <span className="flex items-center gap-1">
                <span className="text-sm">{selectedCountry.flag}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-glass backdrop-blur-glass border-glass-border">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span className="text-sm">{country.dialCode}</span>
                  <span className="text-sm text-muted-foreground">{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
            {selectedCountry.dialCode}
          </span>
          <Input
            {...props}
            ref={ref}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={cn(
              "rounded-l-none pl-16 bg-glass backdrop-blur-glass border-glass-border",
              className
            )}
            placeholder="123 456 7890"
          />
        </div>
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }