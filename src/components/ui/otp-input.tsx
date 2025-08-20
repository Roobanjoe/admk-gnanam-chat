import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
  className?: string
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ value = "", onChange, length = 6, disabled = false, className }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0)
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    const handleInputChange = (index: number, inputValue: string) => {
      if (disabled) return

      // Only allow digits
      const digit = inputValue.replace(/[^0-9]/g, "")
      
      if (digit.length > 1) {
        // Handle paste
        const pastedValue = digit.slice(0, length)
        onChange(pastedValue)
        const nextIndex = Math.min(pastedValue.length, length - 1)
        setActiveIndex(nextIndex)
        inputRefs.current[nextIndex]?.focus()
        return
      }

      const newValue = value.split("")
      newValue[index] = digit
      const result = newValue.join("").slice(0, length)
      onChange(result)

      // Move to next input
      if (digit && index < length - 1) {
        setActiveIndex(index + 1)
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return

      if (e.key === "Backspace") {
        if (!value[index] && index > 0) {
          // Move to previous input if current is empty
          setActiveIndex(index - 1)
          inputRefs.current[index - 1]?.focus()
        } else {
          // Clear current input
          const newValue = value.split("")
          newValue[index] = ""
          onChange(newValue.join(""))
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        setActiveIndex(index - 1)
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === "ArrowRight" && index < length - 1) {
        setActiveIndex(index + 1)
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handleFocus = (index: number) => {
      setActiveIndex(index)
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "")
      if (pastedData) {
        const pastedValue = pastedData.slice(0, length)
        onChange(pastedValue)
        const nextIndex = Math.min(pastedValue.length, length - 1)
        setActiveIndex(nextIndex)
        inputRefs.current[nextIndex]?.focus()
      }
    }

    return (
      <div 
        ref={ref}
        className={cn("flex gap-2 justify-center", className)}
        onPaste={handlePaste}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold rounded-xl transition-all",
              "bg-glass backdrop-blur-glass border border-glass-border",
              "focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              activeIndex === index && "ring-2 ring-neon border-neon",
              value[index] && "bg-neon/10 border-neon text-neon"
            )}
          />
        ))}
      </div>
    )
  }
)
OTPInput.displayName = "OTPInput"

export { OTPInput }