import ACaixa3DCompleta from "@/components/a-caixa-3d-completa"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "A CAIXA | Experiência 3D Completa",
  description:
    "Explore a experiência completa da CAIXA MÍSTICA em 3D, com interação avançada e leituras personalizadas.",
}

export default function Caixa3DCompletaPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-16 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff] overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <ACaixa3DCompleta />
      </div>
    </main>
  )
}
