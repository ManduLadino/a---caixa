"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Verifica se a largura da tela é menor que 768px
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verifica inicialmente
    checkMobile()

    // Adiciona listener para redimensionamento
    window.addEventListener("resize", checkMobile)

    // Limpa o listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
