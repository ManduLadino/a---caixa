"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { GlowText } from "@/components/ui/glow-text"

// Lista simplificada com apenas os nomes das pedras
const crystalNames = [
  "Ametista",
  "Quartzo Rosa",
  "Quartzo Transparente",
  "Turquesa",
  "Ágata Negra",
  "Ágata de Fogo",
  "Olho de Tigre",
  "Lápis-Lazúli",
  "Jade",
  "Pirita",
  "Ônix",
  "Amazonita",
  "Citrino",
  "Turmalina Negra",
  "Pedra da Lua",
  "Pedra do Sol",
  "Quartzo Azul",
  "Água-Marinha",
  "Cianita Azul",
  "Fluorita",
  "Obsidiana",
  "Calcita",
  "Cornalina",
  "Labradorita",
  "Jaspe Vermelho",
  "Rodonita",
  "Howlita",
  "Aventurina",
  "Ágata Musgo",
  "Topázio",
  "Granada",
  "Cristal de Morango",
  "Obsidiana Floco de Neve",
]

// Cores para as pedras (apenas para visualização)
const stoneColors = [
  "#9966CC",
  "#F4C2C2",
  "#F5F5F5",
  "#40E0D0",
  "#0D0D0D",
  "#B22222",
  "#B8860B",
  "#26619C",
  "#00A86B",
  "#CFB53B",
  "#0A0A0A",
  "#7FFFD4",
  "#E4D00A",
  "#2C3539",
  "#F5F5F5",
  "#E67E22",
  "#ADD8E6",
  "#B0E0E6",
  "#4682B4",
  "#9966CC",
  "#2E1E21",
  "#FFA500",
  "#B31B1B",
  "#6C7A89",
  "#B22222",
  "#E77471",
  "#F5F5F5",
  "#3CB371",
  "#D0F0C0",
  "#0D98BA",
  "#7B1113",
  "#FF69B4",
  "#2F4F4F",
]

export default function MysticCrystalCabinet() {
  const [selectedStones, setSelectedStones] = useState<string[]>([])
  const [cabinetOpen, setCabinetOpen] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [glowingStones, setGlowingStones] = useState<number[]>([])

  // Efeito para criar animação de brilho aleatório nas pedras
  useEffect(() => {
    const interval = setInterval(() => {
      const randomStones = Array.from({ length: 3 }, () => Math.floor(Math.random() * crystalNames.length))
      setGlowingStones(randomStones)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Função para selecionar uma pedra
  const handleStoneClick = (name: string) => {
    if (selectedStones.includes(name)) {
      setSelectedStones(selectedStones.filter((stoneName) => stoneName !== name))
    } else {
      if (selectedStones.length < 5) {
        setSelectedStones([...selectedStones, name])
      }
    }
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Armário principal */}
      <motion.div
        className="relative w-full bg-gradient-to-b from-amber-900 to-amber-800 rounded-lg overflow-hidden border-8"
        style={{
          borderImage: "linear-gradient(45deg, #d4af37, #8B4513, #d4af37) 1",
          boxShadow: "0 0 30px rgba(139, 69, 19, 0.7)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Topo ornamentado do armário */}
        <div
          className="relative h-24 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 border-b-4 flex items-center justify-center"
          style={{
            borderImage: "linear-gradient(to right, #d4af37, #8B4513, #d4af37) 1",
          }}
        >
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold">
              <GlowText glowColor="#ffd700">A CAIXA MÍSTICA</GlowText>
            </h2>
            <p className="text-amber-200 text-sm mt-1">Selecione até 5 pedras para sua leitura</p>
          </div>

          <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 flex items-center justify-center z-10 border-2 border-amber-600">
            <Sparkles className="w-6 h-6 text-amber-900" />
          </div>
        </div>

        {/* Portas do armário */}
        <div className="relative">
          {/* Porta esquerda */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-amber-800/90 to-amber-700/90 backdrop-blur-sm border-r-2 z-20"
            style={{
              borderImage: "linear-gradient(to bottom, #d4af37, #8B4513, #d4af37) 1",
              transformOrigin: "left",
              display: cabinetOpen ? "none" : "block",
            }}
            animate={{
              rotateY: cabinetOpen ? -105 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-16 bg-gradient-to-b from-[#d4af37] via-[#8B4513] to-[#d4af37] rounded-full" />
          </motion.div>

          {/* Porta direita */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-800/90 to-amber-700/90 backdrop-blur-sm border-l-2 z-20"
            style={{
              borderImage: "linear-gradient(to bottom, #d4af37, #8B4513, #d4af37) 1",
              transformOrigin: "right",
              display: cabinetOpen ? "none" : "block",
            }}
            animate={{
              rotateY: cabinetOpen ? 105 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-16 bg-gradient-to-b from-[#d4af37] via-[#8B4513] to-[#d4af37] rounded-full" />
          </motion.div>

          {/* Conteúdo do armário - apenas os nomes das pedras */}
          <div className="relative min-h-[500px] p-6">
            {/* Grade de nomes das pedras */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {crystalNames.map((name, index) => (
                <motion.div
                  key={index}
                  className={`relative cursor-pointer group ${
                    selectedStones.includes(name) ? "ring-2 ring-amber-300 ring-offset-2 ring-offset-amber-800" : ""
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  animate={{
                    boxShadow: glowingStones.includes(index)
                      ? `0 0 15px ${stoneColors[index % stoneColors.length]}`
                      : `0 0 5px ${stoneColors[index % stoneColors.length]}80`,
                  }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleStoneClick(name)}
                >
                  <div
                    className="w-full aspect-square rounded-md relative overflow-hidden flex items-center justify-center"
                    style={{
                      backgroundColor: stoneColors[index % stoneColors.length],
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />

                    {/* Efeito de brilho */}
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{
                        opacity: glowingStones.includes(index) ? [0, 0.3, 0] : 0,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: glowingStones.includes(index) ? Number.POSITIVE_INFINITY : 0,
                      }}
                    />

                    {/* Nome da pedra no centro */}
                    <span className="text-white text-xs font-medium text-center px-1 relative z-10 text-shadow-sm">
                      {name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Gaveta inferior (A CAIXA) - Apenas com os nomes das pedras selecionadas */}
        <motion.div
          className="relative bg-gradient-to-b from-amber-900 to-amber-950 border-t-4 p-6"
          style={{
            borderImage: "linear-gradient(to right, #d4af37, #8B4513, #d4af37) 1",
          }}
          animate={{
            height: drawerOpen ? "auto" : "80px",
          }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-3 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full cursor-pointer"
            onClick={() => setDrawerOpen(!drawerOpen)}
          />

          <div className="flex items-center justify-center h-10">
            <h3 className="text-xl font-bold text-center">
              <GlowText glowColor="#ffd700">A CAIXA</GlowText>
            </h3>
          </div>

          {/* Conteúdo da gaveta quando aberta */}
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                {selectedStones.length === 0 ? (
                  <p className="text-center text-amber-200/80 py-4">Selecione pedras acima para colocá-las na CAIXA.</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-6 justify-center py-6">
                      {selectedStones.map((name, index) => {
                        const colorIndex = crystalNames.indexOf(name)
                        return (
                          <motion.div
                            key={index}
                            className="relative cursor-pointer"
                            whileHover={{ scale: 1.1, y: -5 }}
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              y: {
                                duration: 2 + Math.random() * 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                              },
                            }}
                            onClick={() => handleStoneClick(name)}
                          >
                            <div
                              className="w-20 h-20 rounded-md relative overflow-hidden flex items-center justify-center"
                              style={{
                                backgroundColor: stoneColors[colorIndex % stoneColors.length],
                                boxShadow: `0 0 20px ${stoneColors[colorIndex % stoneColors.length]}`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />

                              {/* Efeito de brilho */}
                              <motion.div
                                className="absolute inset-0 bg-white/20"
                                animate={{
                                  opacity: [0, 0.3, 0],
                                }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              />

                              {/* Nome da pedra no centro */}
                              <span className="text-white text-xs font-medium text-center px-1 relative z-10 text-shadow-sm">
                                {name}
                              </span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    <div className="mt-4 text-center pb-4">
                      <Button className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400">
                        Realizar Leitura Mística
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Botões de controle */}
      <div className="flex gap-4 mt-6 justify-center">
        <Button
          onClick={() => setCabinetOpen(!cabinetOpen)}
          className="bg-gradient-to-r from-amber-700 to-amber-600 text-white hover:from-amber-600 hover:to-amber-500"
        >
          {cabinetOpen ? "Fechar Armário" : "Abrir Armário"}
        </Button>
        <Button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="bg-gradient-to-r from-amber-700 to-amber-600 text-white hover:from-amber-600 hover:to-amber-500"
        >
          {drawerOpen ? "Fechar A CAIXA" : "Abrir A CAIXA"}
        </Button>
      </div>
    </div>
  )
}
