"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlowText } from "@/components/ui/glow-text"
import { Sparkles, BookOpen } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background effect */}
        <div className="absolute inset-0 bg-[url('/images/cosmos-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-gray-900"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float"
              style={{
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <GlowText glowColor="#c774f0">A CAIXA</GlowText>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Descubra os mistérios do seu Estado de Consciência Interna através das pedras místicas e da sabedoria
                ancestral
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/gabinete-mistico">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Gabinete Místico
                  </Button>
                </Link>
                <Link href="/caixa-virtual">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-950/30"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Caixa Virtual
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-K3tqDHeN01mLPOZcPSk4idKY4mPCul.png"
                  alt="Gabinete de pedras místicas"
                  width={500}
                  height={500}
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent bottom-0 h-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/80">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <GlowText glowColor="#9f7aea">Descubra Sua Jornada Interior</GlowText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Pedras Místicas"
              description="Explore nossa coleção de cristais energéticos cuidadosamente selecionados para guiar sua jornada espiritual."
              icon="✨"
            />
            <FeatureCard
              title="Leituras Personalizadas"
              description="Receba interpretações únicas baseadas na disposição das pedras místicas em A CAIXA."
              icon="🔮"
            />
            <FeatureCard
              title="Expansão da Consciência"
              description="Descubra caminhos para expandir seu Estado de Consciência Interna através de orientações espirituais."
              icon="🌌"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-purple-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <GlowText glowColor="#c774f0">Inicie Sua Jornada Agora</GlowText>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Abra A CAIXA e permita que as pedras místicas revelem os segredos do seu Estado de Consciência Interna.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/gabinete-mistico">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Gabinete Luxuoso
              </Button>
            </Link>
            <Link href="/caixa-virtual">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Caixa Virtual
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(15px) translateX(10px); }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 hover:bg-gray-800/70 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-amber-300">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
