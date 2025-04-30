"use client"
import ArmarioMisticoPositivo from "@/components/armario-mistico-positivo"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { GlowText } from "@/components/ui/glow-text"

export default function ArmarioMisticoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-8 pt-20 wood-texture overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="text-cartomente-cream hover:bg-cartomente-brown/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Cartomente
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-cinzel text-5xl font-bold mb-2">
            <GlowText>Cartomente - A CAIXA</GlowText>
          </h1>
          <p className="text-xl text-cartomente-cream">Armário Místico de Pedras Positivas</p>
        </div>

        <ArmarioMisticoPositivo />

        <div className="mt-12 text-center text-sm text-cartomente-cream/70">
          <p>Explore o armário místico de pedras e descubra o poder das energias positivas.</p>
          <p>Abra o armário para ver as pedras, e abra A CAIXA para selecionar pedras para sua mandala da vida.</p>
        </div>
      </div>
    </main>
  )
}
