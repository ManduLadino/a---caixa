"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlowTextProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  delay?: number
}

export function GlowText({ children, className, glowColor = "#c774f0", delay = 0 }: GlowTextProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <span
      className={cn(
        "transition-all duration-1000 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
      style={{
        textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
      }}
    >
      {children}
    </span>
  )
}
