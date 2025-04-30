"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/contexts/app-context"
import { Moon, Sun, Menu, X, Home, History, Crown, User, BarChart, BookOpen, Compass } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { theme, toggleTheme } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: Compass, label: "Oráculo", href: "/oraculo" },
    { icon: History, label: "Histórico", href: "/historico" },
    { icon: Crown, label: "Assinatura", href: "/assinatura" },
    { icon: User, label: "Perfil", href: "/perfil" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cartomente-brown-darker/80 backdrop-blur-md border-b border-cartomente-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl mr-2">🃏</span>
              <span className="font-cinzel font-bold text-xl text-cartomente-cream">CARTOMENTE</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cartomente-brown/50 text-cartomente-gold"
                      : "text-cartomente-cream hover:bg-cartomente-brown-dark/30"
                  }`}
                >
                  <span className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </span>
                </Link>
              )
            })}
            <Link
              href="/api-docs"
              className="px-3 py-2 rounded-md text-sm font-medium text-cartomente-cream hover:bg-cartomente-brown-dark/30"
            >
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                API Docs
              </span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-cartomente-cream hover:bg-cartomente-brown-dark/30"
            >
              <span className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Dashboard
              </span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-2 text-cartomente-cream hover:bg-cartomente-brown-dark/30"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2 text-cartomente-cream hover:bg-cartomente-brown-dark/30"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-cartomente-cream hover:bg-cartomente-brown-dark/30"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-cartomente-brown-darker/90 backdrop-blur-md">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "bg-cartomente-brown/50 text-cartomente-gold"
                        : "text-cartomente-cream hover:bg-cartomente-brown-dark/30"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </span>
                  </Link>
                )
              })}
              <Link
                href="/api-docs"
                className="block px-3 py-2 rounded-md text-base font-medium text-cartomente-cream hover:bg-cartomente-brown-dark/30"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  API Docs
                </span>
              </Link>
              <Link
                href="/admin/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-cartomente-cream hover:bg-cartomente-brown-dark/30"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2" />
                  Dashboard
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
