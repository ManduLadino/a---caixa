import MysticCrystalCabinet from "@/components/mystic-crystal-cabinet"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "A Caixa Mística | Armário de Cristais",
  description: "Explore o armário místico de cristais e pedras energéticas para sua leitura espiritual personalizada.",
}

export default function CaixaVirtualPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff] overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Armário Místico de Cristais</h1>
        <p className="text-center text-lg mb-8 max-w-3xl mx-auto">
          Explore nosso armário místico contendo 33 pedras preciosas com propriedades energéticas únicas. Selecione até
          5 pedras para sua leitura personalizada.
        </p>

        <MysticCrystalCabinet />
      </div>
    </main>
  )
}
