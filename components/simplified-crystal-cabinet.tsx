"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { GlowText } from "@/components/ui/glow-text"

// Vamos reduzir o tamanho do componente e focar apenas nas pedras principais

// Mantenha a definição de crystalData, mas reduza para apenas 15 pedras principais
const crystalData = [
  {
    id: 1,
    name: "Abalone",
    keywords: "Beleza, Purificação, Intuição, Proteção Emocional",
    description:
      "Conhecida por favorecer a beleza e purificar energias, a Abalone é associada ao aumento da luz pessoal e do magnetismo.",
    color: "#7DB6B3",
    image: "/abalone-iridescent.png",
  },
  {
    id: 2,
    name: "Ágata Azul",
    keywords: "Calma, Cura Emocional, Comunicação, Paz Interior",
    description: "Considerada uma pedra de paz interior, cura física e emocional, e elevação espiritual.",
    color: "#4682B4",
    image: "/blue-agate-crystal.png",
  },
  {
    id: 3,
    name: "Ágata Musgo",
    keywords: "Natureza, Estabilidade, Renovação, Conexão com a Terra",
    description: "Uma pedra estabilizadora com forte ligação à natureza, revigorante para a alma.",
    color: "#4F7942",
    image: "/moss-agate-crystal.png",
  },
  {
    id: 4,
    name: "Ágata Preta",
    keywords: "Proteção, Equilíbrio, Força Interior, Sorte",
    description: "Promove equilíbrio, proteção e estabilidade. Considerada uma pedra de cura e verdade.",
    color: "#2F4F4F",
    image: "/black-agate-crystal.png",
  },
  {
    id: 5,
    name: "Ágata Rosa",
    keywords: "Amor Incondicional, Conforto, Segurança, Autoaceitação",
    description: "Esta variedade de Ágata acalma, conforta e proporciona segurança, aliviando o stress.",
    color: "#FFB6C1",
    image: "/pink-agate-crystal.png",
  },
  {
    id: 6,
    name: "Ágata Verde",
    keywords: "Sorte, Harmonia, Saúde, Autoconfiança",
    description: "Considerada uma pedra de sorte, beleza, harmonia e fertilidade.",
    color: "#2E8B57",
    image: "/green-agate-crystal.png",
  },
  {
    id: 7,
    name: "Água Marinha",
    keywords: "Calma, Clareza, Comunicação, Coragem",
    description: "Com uma energia calmante, reduz o stress e tranquiliza a mente, elevando a espiritualidade.",
    color: "#ADD8E6",
    image: "/aquamarine-crystal.png",
  },
  {
    id: 8,
    name: "Amazonita",
    keywords: "Sorte, Sucesso, Equilíbrio, Expressão",
    description: "Conhecida por atrair boa sorte, abrir caminhos para o sucesso e afastar energias negativas.",
    color: "#7FFFD4",
    image: "/amazonite-crystal.png",
  },
  {
    id: 9,
    name: "Ametista",
    keywords: "Espiritualidade, Calma, Proteção, Transmutação",
    description: "Uma pedra poderosa e protetora com alta vibração espiritual.",
    color: "#9966CC",
    image: "/amethyst-crystal.png",
  },
  {
    id: 10,
    name: "Calcita Laranja",
    keywords: "Energia, Criatividade, Alegria, Confiança",
    description: "Uma pedra energizante e purificadora que equilibra as emoções e combate a depressão.",
    color: "#FFA500",
    image: "/orange-calcite-crystal.png",
  },
  {
    id: 11,
    name: "Cianita Azul",
    keywords: "Proteção Espiritual, Intuição, Comunicação, Alinhamento",
    description: "Possui uma alta vibração espiritual, conectando com guias espirituais e facilitando a meditação.",
    color: "#4169E1",
    image: "/blue-kyanite.png",
  },
  {
    id: 12,
    name: "Citrino",
    keywords: "Prosperidade, Alegria, Sucesso, Energia Solar",
    description: "Conhecido como a pedra da abundância e prosperidade, ensina a manifestar e atrair riqueza.",
    color: "#FFD700",
    image: "/citrine-crystal.png",
  },
  {
    id: 13,
    name: "Cornalina",
    keywords: "Vitalidade, Coragem, Criatividade, Motivação",
    description: "Repleta de energia vital, promove coragem, criatividade e motivação.",
    color: "#B22222",
    image: "/carnelian-crystal.png",
  },
  {
    id: 14,
    name: "Quartzo Rosa",
    keywords: "Amor Incondicional, Cura Emocional, Paz, Compaixão",
    description: "A pedra do amor incondicional e da paz infinita. É o cristal mais importante para o coração.",
    color: "#F4C2C2",
    image: "/rose-quartz-crystal.png",
  },
  {
    id: 15,
    name: "Turmalina Negra",
    keywords: "Proteção Suprema, Aterramento, Limpeza Energética, Neutralização",
    description: "Considerada a pedra de proteção mais completa contra energias negativas e ataques psíquicos.",
    color: "#2C3539",
    image: "/black-tourmaline-crystal.png",
  },
]

// Modifique o componente para ser mais compacto
export default function SimplifiedCrystalCabinet() {
  const [selectedCrystal, setSelectedCrystal] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [stonesInDrawer, setStonesInDrawer] = useState<number[]>([])

  // Função para selecionar um cristal
  const handleCrystalClick = (id: number) => {
    // Se a pedra já estiver na caixa, remova-a
    if (stonesInDrawer.includes(id)) {
      setStonesInDrawer(stonesInDrawer.filter((stoneId) => stoneId !== id))
    } else {
      // Caso contrário, adicione-a (limitando a 5 pedras)
      if (stonesInDrawer.length < 5) {
        setStonesInDrawer([...stonesInDrawer, id])
      }
    }
  }

  // Função para mostrar informações da pedra
  const showCrystalInfo = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCrystal(id)
    setShowInfo(true)
  }

  // Função para fechar o modal de informações
  const closeInfo = () => {
    setShowInfo(false)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Armário principal inspirado na imagem de referência */}
      <div
        className="relative w-full bg-gradient-to-b from-amber-800 to-amber-700 rounded-lg overflow-hidden border-8 p-6"
        style={{
          borderImage: "linear-gradient(45deg, #d4af37, #8B4513, #d4af37) 1",
          boxShadow: "0 0 20px rgba(139, 69, 19, 0.5)",
        }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-amber-100">
            <GlowText glowColor="#ffd700">A CAIXA MÍSTICA</GlowText>
          </h2>
          <p className="text-amber-200 text-sm">Selecione até 5 pedras para sua leitura</p>
        </div>

        {/* Grade de cristais */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {crystalData.map((crystal) => (
            <motion.div
              key={crystal.id}
              className={`relative cursor-pointer group ${
                stonesInDrawer.includes(crystal.id) ? "ring-2 ring-amber-300 ring-offset-2 ring-offset-amber-800" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCrystalClick(crystal.id)}
            >
              <div
                className="w-full aspect-square rounded-md relative overflow-hidden"
                style={{
                  backgroundColor: crystal.color,
                  boxShadow: `0 0 10px ${crystal.color}80`,
                }}
              >
                <Image
                  src={crystal.image || "/placeholder.svg"}
                  alt={crystal.name}
                  fill
                  className="object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />
              </div>
              <div className="text-center mt-2 text-amber-100 text-xs font-medium">{crystal.name}</div>
              <button
                onClick={(e) => showCrystalInfo(crystal.id, e)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-800/70 text-amber-200 flex items-center justify-center text-xs"
              >
                i
              </button>
            </motion.div>
          ))}
        </div>

        {/* A CAIXA - Área das pedras selecionadas */}
        <div
          className="bg-gradient-to-b from-amber-900/80 to-amber-800/80 backdrop-blur-sm rounded-lg p-4 border-2"
          style={{
            borderImage: "linear-gradient(to right, #d4af37, #8B4513, #d4af37) 1",
          }}
        >
          <h3 className="text-xl font-bold text-amber-100 mb-4 text-center">
            <GlowText glowColor="#ffd700">Pedras Selecionadas</GlowText>
          </h3>

          {stonesInDrawer.length === 0 ? (
            <p className="text-center text-amber-200/80 py-4">Selecione pedras acima para colocá-las na CAIXA.</p>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {stonesInDrawer.map((id) => {
                const crystal = crystalData.find((c) => c.id === id)
                if (!crystal) return null

                return (
                  <motion.div
                    key={crystal.id}
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleCrystalClick(crystal.id)}
                  >
                    <div
                      className="w-16 h-16 rounded-md relative overflow-hidden"
                      style={{
                        backgroundColor: crystal.color,
                        boxShadow: `0 0 15px ${crystal.color}`,
                      }}
                    >
                      <Image
                        src={crystal.image || "/placeholder.svg"}
                        alt={crystal.name}
                        fill
                        className="object-cover mix-blend-overlay"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-amber-200 bg-amber-900/90 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {crystal.name}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {stonesInDrawer.length > 0 && (
            <div className="mt-6 text-center">
              <Button className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400">
                Realizar Leitura
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de informações do cristal */}
      <AnimatePresence>
        {showInfo && selectedCrystal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeInfo}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-amber-900 to-amber-800 border border-amber-600/50 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cristal selecionado */}
              {(() => {
                const crystal = crystalData.find((c) => c.id === selectedCrystal)
                if (!crystal) return null

                return (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-md relative overflow-hidden"
                          style={{
                            backgroundColor: crystal.color,
                            boxShadow: `0 0 15px ${crystal.color}80`,
                          }}
                        >
                          <Image
                            src={crystal.image || "/placeholder.svg"}
                            alt={crystal.name}
                            fill
                            className="object-cover mix-blend-overlay"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />
                        </div>
                        <h3 className="text-2xl font-bold text-amber-100">{crystal.name}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeInfo}
                        className="text-amber-400 hover:text-amber-200"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm uppercase tracking-wider text-amber-400 mb-1">Palavras-Chave</h4>
                      <p className="text-amber-100">{crystal.keywords}</p>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-amber-400 mb-1">Perfil Místico</h4>
                      <p className="text-amber-100">{crystal.description}</p>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400"
                        onClick={closeInfo}
                      >
                        Fechar
                      </Button>
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
