"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface HolographicCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  delay?: number
}

export function HolographicCard({ children, className, intensity = 20, delay = 0 }: HolographicCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateXValue = ((y - centerY) / centerY) * intensity * -1
    const rotateYValue = ((x - centerX) / centerX) * intensity

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "perspective-1000 transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      )}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className={cn(
          "bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-glow transition-transform duration-200 ease-out",
          className,
        )}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          backgroundImage: `
            radial-gradient(
              circle at ${50 + (rotateY / intensity) * 50}% ${50 + (rotateX / intensity) * 50}%, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 25%, 
              rgba(255, 255, 255, 0) 50%
            )
          `,
        }}
      >
        {children}
      </Card>
    </div>
  )
}
