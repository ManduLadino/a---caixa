"use client"

import { useAppContext } from "@/contexts/app-context"

export default function Footer() {
  const { theme } = useAppContext()

  return (
    <footer className="w-full py-4 px-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-3 md:mb-0">
          <p className="text-[#e6d8ff] text-sm">
            <span className="font-medium">Criado pelo Grupo Mandu Ladido</span>
          </p>
        </div>
        <div className="text-[#e6d8ff] text-xs opacity-70">
          &copy; {new Date().getFullYear()} A CAIXA - Oráculo Digital com IA
        </div>
      </div>
    </footer>
  )
}
