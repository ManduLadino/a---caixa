"use client"

import { ParticleBackground } from "@/components/ui/particle-background"
import MobileNavbar from "@/components/mobile-navbar"
import { motion } from "framer-motion"
import { User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/contexts/app-context"
import SubscriptionDetails from "@/components/subscription-details"

export default function PerfilPage() {
  const { subscriptionTier, readings } = useAppContext()

  const getSubscriptionName = (tier: string) => {
    switch (tier) {
      case "premium":
        return "Premium"
      case "basic":
        return "Básico"
      default:
        return "Gratuito"
    }
  }

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
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <div className="flex flex-col items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-[#8e2de2]/30 flex items-center justify-center">
              <User className="w-16 h-16 text-[#ff9be2]" />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Seu Perfil</h1>
              <p className="text-[#ff9be2] mb-4">Usuário Místico</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Plano atual</p>
                  <p className="font-bold">{getSubscriptionName(subscriptionTier)}</p>
                </div>

                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Leituras realizadas</p>
                  <p className="font-bold">{readings.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" /> Configurações
            </Button>

            <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md mb-6"
      >
        <SubscriptionDetails />
      </motion.div>
    </main>
  )
}
