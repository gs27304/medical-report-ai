import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex items-center justify-center">
       
       <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 0L20.4545 5.33333L0 25.3333V14.6667L15 0Z" fill="#06D1D4"></path>
<path d="M2.90827 28.177L15 40L30 25.3334V14.6667L20.4545 5.33337L0 25.3334L0.0041688 25.3375L20.4545 5.33337V20.6667L11.25 29.6667V20.1324L2.90827 28.177Z" fill="#3628A0"></path>
</svg>
      </div>
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            textSizeClasses[size]
          )}
        >
          PathoLens
        </span>
      )}
    </div>
  )
}

