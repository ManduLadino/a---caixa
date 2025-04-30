"use client"

import SimplifiedCrystalCabinet from "@/components/simplified-crystal-cabinet"
import { ParticleBackground } from "@/components/ui/particle-background"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CaixaVirtualPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b0e] to-[#3d2815] text-amber-100 py-12 px-4">
      <ParticleBackground />

      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-amber-200 hover:bg-amber-900/30">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para A CAIXA
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
          A Caixa Mística
        </h1>
        <p className="text-center text-amber-200/80 mb-8">
          Selecione as pedras para sua leitura do Estado de Consciência Interna
        </p>

        <SimplifiedCrystalCabinet />

        <div className="mt-12 text-center text-amber-200/60 text-sm">
          <p className="mb-2">Selecione até 5 pedras conforme sua intuição e energia.</p>
          <p>© 2023 A Caixa Mística - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  )
}
