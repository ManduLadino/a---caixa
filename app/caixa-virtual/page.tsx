"use client"

import RealisticStoneBox from "@/components/realistic-stone-box"

export default function CaixaVirtualPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#ff9be2]">A Caixa - Oráculo das Pedras Místicas</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        Explore o poder das 33 pedras místicas. Organize-as na caixa virtual, faça sua pergunta e receba uma leitura
        personalizada do seu Estado de Consciência Interna.
      </p>

      <div className="flex justify-center">
        <RealisticStoneBox />
      </div>

      <div className="mt-12 text-center text-sm text-white/70">
        <p className="mb-2">Cada pedra possui propriedades energéticas únicas que influenciam sua leitura.</p>
        <p>Shift+Clique em qualquer pedra para descobrir seu significado e origem.</p>
      </div>
    </div>
  )
}
