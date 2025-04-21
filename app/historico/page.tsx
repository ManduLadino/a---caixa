"use client"

import { HolographicCard } from "@/components/ui/holographic-card"
import { ParticleBackground } from "@/components/ui/particle-background"
import Navbar from "@/components/navbar"
import ReadingHistory from "@/components/reading-history"
import { motion } from "framer-motion"
import { ScrollText } from "lucide-react"

export default function HistoricoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-8 pt-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff] overflow-x-hidden">
      <Navbar />
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mb-6"
      >
        <HolographicCard>
          <h1 className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <ScrollText className="h-6 w-6 text-[#ff9be2]" /> Seu Histórico de Leituras
          </h1>
          <p className="text-center mb-6">
            Aqui você encontra todas as suas leituras místicas anteriores. Reviva suas experiências e acompanhe sua
            jornada espiritual.
          </p>
        </HolographicCard>
      </motion.div>

      <ReadingHistory />
    </main>
  )
}
