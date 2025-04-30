import MysticStoneBox from "@/components/mystic-stone-box"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { GlowText } from "@/components/ui/glow-text"

export default function CaixaMisticaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20 pb-10">
      <Navbar />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <GlowText glowColor="#c774f0">A CAIXA</GlowText>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            As pedras falam quando os discípulos silenciam. Descubra os mistérios do seu Estado de Consciência Interna
            através da disposição das pedras místicas.
          </p>
        </div>

        <MysticStoneBox />

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Como Funciona a Leitura</h2>
          <p className="text-gray-300 mb-6">
            A disposição das pedras místicas na caixa revela padrões energéticos que refletem seu estado interior atual.
            Cada pedra possui propriedades vibratórias únicas que, quando combinadas, formam uma narrativa personalizada
            sobre sua jornada espiritual.
          </p>
          <p className="text-gray-300">
            Selecione as pedras que ressoam com você intuitivamente. Não há escolhas certas ou erradas - apenas o que
            sua energia interior guia você a escolher neste momento. A leitura resultante oferecerá insights sobre sua
            percepção interior atual, bloqueios energéticos ocultos e caminhos para expansão do seu Estado de
            Consciência Interna.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
