"use client"

import { ParticleBackground } from "@/components/ui/particle-background"
import SimplifiedCrystalCabinet from "@/components/simplified-crystal-cabinet"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { GlowText } from "@/components/ui/glow-text"

export default function ArmarioMisticoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-8 pt-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff] overflow-x-hidden">
      <ParticleBackground />

      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para A CAIXA
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            <GlowText glowColor="#c774f0">🔮 A CAIXA</GlowText>
          </h1>
          <p className="text-xl text-gray-300">Armário Místico de Cristais</p>
        </div>

        <SimplifiedCrystalCabinet />

        <div className="mt-12 text-center text-sm text-white/70">
          <p>Explore o armário místico de cristais e descubra o poder das 44 pedras sagradas.</p>
          <p>Abra o armário para ver as pedras, e abra A CAIXA para selecionar pedras para sua leitura mística.</p>
        </div>
      </div>
    </main>
  )
}
