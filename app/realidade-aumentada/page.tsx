"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ParticleBackground } from "@/components/ui/particle-background"

// Importação dinâmica do componente de realidade aumentada
const AugmentedRealityViewer = dynamic(() => import("@/components/augmented-reality-viewer"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#8e2de2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Carregando experiência de realidade aumentada...</p>
      </div>
    </div>
  ),
})

export default function RealidadeAumentadaPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-16 pb-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff]">
      <ParticleBackground />

      <div className="w-full max-w-4xl flex items-center mb-6">
        <Link href="/">
          <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center flex-grow">Realidade Aumentada</h1>
      </div>

      {isClient ? (
        <AugmentedRealityViewer onClose={() => {}} />
      ) : (
        <div className="w-full max-w-4xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
          <p className="text-center">Carregando experiência de realidade aumentada...</p>
        </div>
      )}
    </main>
  )
}
