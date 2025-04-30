"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlowText } from "@/components/ui/glow-text"
import { HolographicCard } from "@/components/ui/holographic-card"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { Sparkles, BookOpen, Compass, History } from "lucide-react"

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <main className="min-h-screen pt-20 pb-10 wood-texture">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute -top-16 -left-16 -right-16 -bottom-16 bg-cartomente-gold rounded-full filter blur-3xl opacity-10 animate-pulse-slow"
            />
            <h1 className="font-cinzel text-6xl font-bold mb-4 relative">
              <GlowText glowColor="#d4af37">CARTOMENTE</GlowText>
            </h1>
          </div>
          <p className="text-cartomente-cream text-xl max-w-3xl mx-auto">
            Descubra os mistérios do seu destino através das cartas místicas e da sabedoria ancestral
          </p>
        </motion.div>

        {/* Seção de destaque */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="font-cinzel text-3xl font-bold mb-4 text-cartomente-gold">O Oráculo Digital</h2>
            <p className="text-cartomente-cream mb-6 text-lg">
              Cartomente combina a sabedoria ancestral do tarô com inteligência artificial avançada para revelar
              insights profundos sobre seu caminho e destino.
            </p>
            <p className="text-cartomente-cream mb-6">
              Nosso oráculo digital interpreta as cartas místicas com precisão e profundidade, oferecendo orientação
              personalizada para suas questões mais importantes.
            </p>
            <Link href="/oraculo">
              <Button className="bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream">
                <Compass className="mr-2 h-4 w-4" /> Consultar o Oráculo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative h-80 md:h-96"
          >
            <div className="absolute inset-0 flex justify-center">
              <div className="relative w-48 h-80 perspective-1000">
                <motion.div
                  animate={{ rotateY: [0, 180, 360], rotateX: [5, -5, 5] }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 20,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute w-full h-full transform-style-3d"
                >
                  <div className="absolute w-full h-full tarot-card card-back" />
                </motion.div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-48 h-80 perspective-1000">
                <motion.div
                  animate={{ rotateY: [10, 190, 370], rotateX: [-5, 5, -5] }}
                  transition={{
                    duration: 25,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 2,
                  }}
                  className="absolute w-full h-full transform-style-3d"
                >
                  <div className="absolute w-full h-full tarot-card card-back" />
                </motion.div>
              </div>

              <div className="absolute -top-10 -left-10 w-48 h-80 perspective-1000">
                <motion.div
                  animate={{ rotateY: [20, 200, 380], rotateX: [8, -2, 8] }}
                  transition={{
                    duration: 22,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                  className="absolute w-full h-full transform-style-3d"
                >
                  <div className="absolute w-full h-full tarot-card card-back" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Seção de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="card-hover"
          >
            <HolographicCard className="h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cartomente-brown flex items-center justify-center">
                  <Compass className="h-8 w-8 text-cartomente-cream" />
                </div>
                <h3 className="font-cinzel text-xl font-bold mb-2 text-cartomente-gold">Consulta ao Oráculo</h3>
                <p className="text-cartomente-cream mb-4">
                  Receba orientação personalizada através das cartas místicas interpretadas com precisão pela nossa IA.
                </p>
                <Link href="/oraculo">
                  <Button variant="outline">Consultar Agora</Button>
                </Link>
              </div>
            </HolographicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="card-hover"
          >
            <HolographicCard className="h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cartomente-brown flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-cartomente-cream" />
                </div>
                <h3 className="font-cinzel text-xl font-bold mb-2 text-cartomente-gold">Biblioteca Mística</h3>
                <p className="text-cartomente-cream mb-4">
                  Explore nossa vasta coleção de conhecimentos sobre tarô, símbolos místicos e interpretações.
                </p>
                <Link href="/biblioteca">
                  <Button variant="outline">Explorar</Button>
                </Link>
              </div>
            </HolographicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="card-hover"
          >
            <HolographicCard className="h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cartomente-brown flex items-center justify-center">
                  <History className="h-8 w-8 text-cartomente-cream" />
                </div>
                <h3 className="font-cinzel text-xl font-bold mb-2 text-cartomente-gold">Histórico de Leituras</h3>
                <p className="text-cartomente-cream mb-4">
                  Acesse suas consultas anteriores e acompanhe como as previsões se manifestam em sua jornada.
                </p>
                <Link href="/historico">
                  <Button variant="outline">Ver Histórico</Button>
                </Link>
              </div>
            </HolographicCard>
          </motion.div>
        </div>

        {/* Seção de depoimentos */}
        <div className="mb-16">
          <h2 className="font-cinzel text-3xl font-bold mb-8 text-center text-cartomente-gold">
            O Que Dizem Nossos Consulentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <HolographicCard>
                <div className="flex flex-col h-full">
                  <p className="text-cartomente-cream mb-4 italic">
                    "A consulta ao Cartomente foi reveladora. As cartas captaram exatamente o momento que estou vivendo
                    e ofereceram orientação valiosa para minhas decisões."
                  </p>
                  <div className="mt-auto flex items-center">
                    <div className="w-10 h-10 rounded-full bg-cartomente-brown mr-3 flex items-center justify-center">
                      <span className="text-cartomente-cream font-bold">M</span>
                    </div>
                    <div>
                      <p className="text-cartomente-gold font-bold">Maria C.</p>
                      <p className="text-cartomente-cream text-sm">São Paulo, SP</p>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <HolographicCard>
                <div className="flex flex-col h-full">
                  <p className="text-cartomente-cream mb-4 italic">
                    "Impressionante como as cartas e a interpretação foram precisas. Recebi insights que me ajudaram a
                    tomar decisões importantes em um momento de incerteza."
                  </p>
                  <div className="mt-auto flex items-center">
                    <div className="w-10 h-10 rounded-full bg-cartomente-brown mr-3 flex items-center justify-center">
                      <span className="text-cartomente-cream font-bold">R</span>
                    </div>
                    <div>
                      <p className="text-cartomente-gold font-bold">Ricardo T.</p>
                      <p className="text-cartomente-cream text-sm">Rio de Janeiro, RJ</p>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </motion.div>
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-center"
        >
          <HolographicCard className="max-w-3xl mx-auto">
            <h2 className="font-cinzel text-2xl font-bold mb-4 text-cartomente-gold">
              Descubra o Que as Cartas Reservam Para Você
            </h2>
            <p className="text-cartomente-cream mb-6">
              Inicie sua jornada de autoconhecimento e descubra insights valiosos sobre seu passado, presente e futuro.
            </p>
            <Link href="/oraculo">
              <Button className="bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream">
                <Sparkles className="mr-2 h-4 w-4" /> Consultar o Oráculo Agora
              </Button>
            </Link>
          </HolographicCard>
        </motion.div>
      </div>
    </main>
  )
}
