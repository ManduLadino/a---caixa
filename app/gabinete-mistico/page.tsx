import LuxuryStoneCabinet from "@/components/luxury-stone-cabinet"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "A CAIXA | Gabinete Místico de Pedras",
  description: "Explore o gabinete místico de pedras e cristais para sua leitura espiritual personalizada.",
}

export default function GabineteMisticoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff] overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Gabinete Místico de Pedras</h1>
        <p className="text-center text-lg mb-8 max-w-3xl mx-auto">
          Explore nosso gabinete místico contendo pedras preciosas com propriedades energéticas únicas. Selecione até 7
          pedras para sua leitura personalizada do Estado de Consciência Interna.
        </p>

        <LuxuryStoneCabinet />
      </div>
    </main>
  )
}
