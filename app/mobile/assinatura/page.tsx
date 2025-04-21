"use client"

import { ParticleBackground } from "@/components/ui/particle-background"
import MobileNavbar from "@/components/mobile-navbar"
import SubscriptionPlans from "@/components/subscription-plans"
import { motion } from "framer-motion"
import { Crown } from "lucide-react"
import MobileFooter from "@/components/mobile-footer"

export default function AssinaturaPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-16 pb-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff]">
      <MobileNavbar />
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mb-6"
      >
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Crown className="h-6 w-6 text-[#ff9be2]" /> Planos
          </h1>
          <p className="text-center mb-4">
            Eleve sua experiência mística com nossos planos especiais. Desbloqueie recursos exclusivos e aprofunde sua
            jornada espiritual.
          </p>
        </div>
      </motion.div>

      <SubscriptionPlans />
      <div className="pb-20">
        <MobileFooter />
      </div>
    </main>
  )
}
