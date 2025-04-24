"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, History, CreditCard, User, Box } from "lucide-react"

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-lg z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/mobile" className="text-xl font-bold text-white">
          A Caixa
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {isOpen && (
        <div className="container mx-auto px-4 py-4 bg-black/80 border-t border-white/10">
          <ul className="space-y-3">
            <li>
              <Link
                href="/mobile"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                onClick={toggleMenu}
              >
                <Home size={20} />
                <span>Início</span>
              </Link>
            </li>
            <li>
              <Link
                href="/caixa-virtual"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                onClick={toggleMenu}
              >
                <Box size={20} />
                <span>Caixa Virtual</span>
              </Link>
            </li>
            <li>
              <Link
                href="/mobile/historico"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                onClick={toggleMenu}
              >
                <History size={20} />
                <span>Histórico</span>
              </Link>
            </li>
            <li>
              <Link
                href="/mobile/assinatura"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                onClick={toggleMenu}
              >
                <CreditCard size={20} />
                <span>Assinatura</span>
              </Link>
            </li>
            <li>
              <Link
                href="/mobile/perfil"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                onClick={toggleMenu}
              >
                <User size={20} />
                <span>Perfil</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
