"use client"

import RealisticStoneBox from "@/components/realistic-stone-box"

export default function CaixaVirtualPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ff9be2] to-[#8e2de2]">
          A Caixa Mística Virtual
        </h1>
        <p className="text-center text-white/70 mb-8">
          Explore o poder das pedras místicas e receba uma leitura personalizada do seu Estado de Consciência Interna
        </p>

        <div className="flex justify-center">
          <RealisticStoneBox />
        </div>

        <div className="mt-12 text-center text-white/60 text-sm">
          <p className="mb-2">Arraste as pedras para reorganizá-las conforme sua intuição e energia.</p>
          <p>Shift+Clique em qualquer pedra para ver seu significado e propriedades.</p>
          <p>© 2023 A Caixa Mística - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  )
}
