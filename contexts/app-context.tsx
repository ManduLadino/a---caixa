"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light"
type SubscriptionTier = "free" | "basic" | "premium"

interface Reading {
  id: string
  date: string
  question: string
  reading: string
  mandalaParams: any
}

interface AppContextType {
  theme: Theme
  toggleTheme: () => void
  readings: Reading[]
  addReading: (reading: Omit<Reading, "id" | "date">) => void
  subscriptionTier: SubscriptionTier
  upgradeSubscription: (tier: SubscriptionTier) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [readings, setReadings] = useState<Reading[]>([])
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>("free")

  // Carrega dados salvos ao iniciar
  useEffect(() => {
    if (typeof window === "undefined") return

    // Carrega o tema
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("light-theme", savedTheme === "light")
    }

    // Carrega leituras salvas
    const savedReadings = localStorage.getItem("readings")
    if (savedReadings) {
      try {
        setReadings(JSON.parse(savedReadings))
      } catch (e) {
        console.error("Erro ao carregar leituras:", e)
      }
    }

    // Carrega nível de assinatura
    const savedTier = localStorage.getItem("subscriptionTier") as SubscriptionTier
    if (savedTier) {
      setSubscriptionTier(savedTier)
    }
  }, [])

  // Alterna entre temas claro e escuro
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("light-theme", newTheme === "light")
  }

  // Adiciona uma nova leitura ao histórico
  const addReading = (reading: Omit<Reading, "id" | "date">) => {
    const newReading = {
      ...reading,
      id: `reading-${Date.now()}`,
      date: new Date().toISOString(),
    }
    const updatedReadings = [...readings, newReading]
    setReadings(updatedReadings)
    localStorage.setItem("readings", JSON.stringify(updatedReadings))
  }

  // Atualiza o nível de assinatura
  const upgradeSubscription = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier)
    localStorage.setItem("subscriptionTier", tier)
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        readings,
        addReading,
        subscriptionTier,
        upgradeSubscription,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
