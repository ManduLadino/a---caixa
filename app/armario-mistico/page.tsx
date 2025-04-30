import ExpandedMysticCabinet from "@/components/expanded-mystic-cabinet"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { GlowText } from "@/components/ui/glow-text"

export default function ArmarioMisticoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 pt-20 pb-10">
      <Navbar />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <GlowText glowColor="#c774f0">Armário Místico</GlowText>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore nosso armário místico contendo 33 pedras preciosas com propriedades energéticas únicas. Selecione
            quantas pedras achar melhores para sua leitura personalizada.
          </p>
        </div>

        <ExpandedMysticCabinet />

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">O Poder das Pedras</h2>
          <p className="text-gray-300 mb-6">
            Cada pedra em nosso armário místico possui uma vibração única que ressoa com diferentes aspectos do seu ser.
            Quando você seleciona intuitivamente as pedras que mais lhe atraem, está permitindo que sua energia interior
            guie o processo de autoconhecimento.
          </p>
          <p className="text-gray-300">
            A combinação das pedras escolhidas cria uma assinatura energética única que revela aspectos do seu Estado de
            Consciência Interna atual. Nossa leitura personalizada interpreta essa assinatura, oferecendo insights
            profundos sobre sua jornada espiritual e emocional.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
