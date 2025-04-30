import ArmarioPedrasCompleto from "@/components/armario-pedras-completo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "A CAIXA | Armário Místico de Pedras",
  description:
    "Explore o armário místico com 44 pedras energéticas e crie sua própria experiência de leitura personalizada.",
}

export default function ArmarioMisticoCompletoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-8 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff] overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <ArmarioPedrasCompleto />
      </div>
    </main>
  )
}
