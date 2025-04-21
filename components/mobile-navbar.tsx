"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/contexts/app-context"
import { Moon, Sun, Menu, X, Home, History, Crown, User, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MobileNavbar() {
  const { theme, toggleTheme } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Início", href: "/mobile" },
    { icon: History, label: "Histórico", href: "/mobile/historico" },
    { icon: Crown, label: "Assinatura", href: "/mobile/assinatura" },
    { icon: User, label: "Perfil", href: "/mobile/perfil" },
  ]

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "A CAIXA - Oráculo Digital com IA",
          text: "Descubra seu futuro com A CAIXA, o oráculo digital que une misticismo ancestral à inteligência artificial!",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Erro ao compartilhar:", error)
      }
    }
  }

  return (
    <>
      {/* Barra superior */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link href="/mobile" className="flex items-center">
            <span className="text-2xl mr-2">🔮</span>
            <span className="font-bold text-xl text-[#e6d8ff]">A CAIXA</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-[#e6d8ff] hover:bg-white/10 w-9 h-9"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-[#e6d8ff] hover:bg-white/10 w-9 h-9"
            >
              <Share2 className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#e6d8ff] hover:bg-white/10 w-9 h-9"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menu expansível */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black/30 backdrop-blur-md">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive ? "bg-[#8e2de2]/30 text-white" : "text-[#e6d8ff] hover:bg-white/10"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Barra de navegação inferior */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="flex justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 ${isActive ? "text-[#ff9be2]" : "text-[#e6d8ff]"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
