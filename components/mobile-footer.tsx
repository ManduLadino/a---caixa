"use client"

import { useAppContext } from "@/contexts/app-context"

export default function MobileFooter() {
  const { theme } = useAppContext()

  return (
    <footer className="w-full py-3 px-4 border-t border-white/10 bg-black/20 backdrop-blur-md text-center">
      <p className="text-[#e6d8ff] text-xs mb-1">
        <span className="font-medium">Criado pelo Grupo Mandu Ladido</span>
      </p>
      <p className="text-[#e6d8ff] text-xs opacity-70">&copy; {new Date().getFullYear()} A CAIXA</p>
    </footer>
  )
}
