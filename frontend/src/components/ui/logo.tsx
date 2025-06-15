import { Bot } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Bot className="h-5 w-5 text-primary" />
      </div>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          HR Assistant
        </span>
      )}
    </Link>
  )
} 