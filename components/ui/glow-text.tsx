// Atualizando o componente GlowText para o novo tema
import type { ReactNode } from "react"

interface GlowTextProps {
  children: ReactNode
  glowColor?: string
  className?: string
}

export function GlowText({ children, glowColor = "#d4a373", className = "" }: GlowTextProps) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}80, 0 0 30px ${glowColor}40`,
        color: "#faedcd",
        fontFamily: "var(--font-cinzel)",
      }}
    >
      {children}
    </span>
  )
}
