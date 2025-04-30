"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Logo3D() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-4"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="relative h-16 w-auto">
              <Image
                src="/images/a-caixa-official-logo.png"
                alt="A CAIXA - Oráculo Místico"
                width={140}
                height={140}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-amber-100 hover:text-amber-400 transition-colors text-sm font-medium">
              Início
            </Link>
            <Link href="/gabinete-3d" className="text-amber-400 border-b border-amber-400/50 text-sm font-medium">
              Gabinete 3D
            </Link>
            <Link
              href="/caixa-mistica"
              className="text-amber-100 hover:text-amber-400 transition-colors text-sm font-medium"
            >
              Caixa Mística
            </Link>
            <Link
              href="/historico"
              className="text-amber-100 hover:text-amber-400 transition-colors text-sm font-medium"
            >
              Histórico
            </Link>
          </nav>
        </div>
      </div>
    </motion.div>
  )
}
