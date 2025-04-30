"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import Logo3D from "@/components/logo-3d"
import Footer3D from "@/components/footer-3d"

// Carregamento dinâmico do componente 3D para evitar problemas de SSR
const Cabinet3DViewer = dynamic(() => import("@/components/cabinet-3d-viewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <p className="text-amber-100 font-serif">Carregando o Gabinete Místico...</p>
      </div>
    </div>
  ),
})

export default function Gabinete3DPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Logo3D />

      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-center text-amber-400 mb-2">
            Gabinete Místico 3D
          </h1>
          <p className="text-center text-amber-100/80 mb-8 max-w-2xl mx-auto">
            Explore o gabinete em três dimensões, selecione as pedras místicas e descubra os segredos do seu Estado de
            Consciência Interna.
          </p>

          <div className="w-full h-[70vh] rounded-lg overflow-hidden shadow-2xl border border-amber-400/20">
            <Suspense fallback={<div className="w-full h-full bg-black/50 animate-pulse"></div>}>
              <Cabinet3DViewer />
            </Suspense>
          </div>

          <div className="mt-8 text-center">
            <p className="text-amber-100/70 text-sm italic">
              Interaja com o gabinete usando o mouse: clique para selecionar pedras, arraste para girar a visualização,
              e use o scroll para zoom.
            </p>
          </div>
        </div>
      </main>

      <Footer3D />
    </div>
  )
}
