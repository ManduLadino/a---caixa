"use client"

import type React from "react"

// Atualizando o componente HolographicCard para o novo tema
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import type { ReactNode } from "react"

interface HolographicCardProps {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
}

export function HolographicCard({ children, className = "", delay = 0, id }: HolographicCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true)
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

    const rotateXValue = ((y - centerY) / centerY) * 5
    const rotateYValue = ((centerX - x) / centerX) * 5

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      id={id}
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-lg p-6 ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
        backgroundImage: "url('/images/parchment-texture.png')",
        backgroundSize: "cover",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(212, 163, 115, 0.3)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative z-10">{children}</div>
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 + rotateX * 2}%, rgba(212, 163, 115, 0.8), transparent 70%)`,
          transition: "background 0.1s ease-out",
        }}
      />
    </motion.div>
  )
}
