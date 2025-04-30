"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, X, Sparkles, Volume2 } from "lucide-react"

// Definição das pedras por cor
const stonesByColor = [
  // Turquesa/Verde
  { id: "turquoise-1", color: "#40E0D0", name: "Turquesa" },
  { id: "turquoise-2", color: "#40E0D0", name: "Turquesa" },
  { id: "turquoise-3", color: "#40E0D0", name: "Turquesa" },
  { id: "turquoise-4", color: "#40E0D0", name: "Turquesa" },
  { id: "turquoise-5", color: "#40E0D0", name: "Turquesa" },

  // Roxo
  { id: "purple-1", color: "#9370DB", name: "Ametista" },
  { id: "purple-2", color: "#9370DB", name: "Ametista" },
  { id: "purple-3", color: "#9370DB", name: "Ametista" },
  { id: "purple-4", color: "#9370DB", name: "Ametista" },
  { id: "purple-5", color: "#9370DB", name: "Ametista" },

  // Preto
  { id: "black-1", color: "#2F4F4F", name: "Ônix" },
  { id: "black-2", color: "#2F4F4F", name: "Ônix" },
  { id: "black-3", color: "#2F4F4F", name: "Ônix" },
  { id: "black-4", color: "#2F4F4F", name: "Ônix" },
  { id: "black-5", color: "#2F4F4F", name: "Ônix" },

  // Verde
  { id: "green-1", color: "#2E8B57", name: "Jade" },
  { id: "green-2", color: "#2E8B57", name: "Jade" },
  { id: "green-3", color: "#2E8B57", name: "Jade" },
  { id: "green-4", color: "#2E8B57", name: "Jade" },
  { id: "green-5", color: "#2E8B57", name: "Jade" },

  // Branco/Creme
  { id: "white-1", color: "#F5F5F5", name: "Quartzo Branco" },
  { id: "white-2", color: "#F5F5F5", name: "Quartzo Branco" },
  { id: "white-3", color: "#F5F5F5", name: "Quartzo Branco" },
  { id: "white-4", color: "#F5F5F5", name: "Quartzo Branco" },
  { id: "white-5", color: "#F5F5F5", name: "Quartzo Branco" },

  // Verde Escuro
  { id: "darkgreen-1", color: "#006400", name: "Esmeralda" },
  { id: "darkgreen-2", color: "#006400", name: "Esmeralda" },
  { id: "darkgreen-3", color: "#006400", name: "Esmeralda" },
  { id: "darkgreen-4", color: "#006400", name: "Esmeralda" },
  { id: "darkgreen-5", color: "#006400", name: "Esmeralda" },
]

// Pedras para a bandeja de areia
const sandTrayStones = [
  { id: "tray-1", color: "#40E0D0" },
  { id: "tray-2", color: "#9370DB" },
  { id: "tray-3", color: "#2F4F4F" },
  { id: "tray-4", color: "#2E8B57" },
  { id: "tray-5", color: "#F5F5F5" },
  { id: "tray-6", color: "#006400" },
  { id: "tray-7", color: "#FF7F50" },
  { id: "tray-8", color: "#FFB6C1" },
  { id: "tray-9", color: "#40E0D0" },
  { id: "tray-10", color: "#9370DB" },
  { id: "tray-11", color: "#2F4F4F" },
  { id: "tray-12", color: "#2E8B57" },
  { id: "tray-13", color: "#F5F5F5" },
  { id: "tray-14", color: "#006400" },
  { id: "tray-15", color: "#FF7F50" },
  { id: "tray-16", color: "#FFB6C1" },
  { id: "tray-17", color: "#40E0D0" },
  { id: "tray-18", color: "#9370DB" },
  { id: "tray-19", color: "#2F4F4F" },
  { id: "tray-20", color: "#2E8B57" },
  { id: "tray-21", color: "#F5F5F5" },
  { id: "tray-22", color: "#006400" },
  { id: "tray-23", color: "#FF7F50" },
  { id: "tray-24", color: "#FFB6C1" },
]

export default function GoldenCabinet() {
  const [selectedStones, setSelectedStones] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showStoneInfo, setShowStoneInfo] = useState(false)
  const [selectedStoneInfo, setSelectedStoneInfo] = useState<any>(null)
  const [readingResult, setReadingResult] = useState<string | null>(null)
  const [isGeneratingReading, setIsGeneratingReading] = useState(false)
  const [showReadingResult, setShowReadingResult] = useState(false)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Agrupar pedras por prateleira (6 prateleiras)
  const shelves = [
    stonesByColor.filter((_, i) => i < 5), // Turquesa
    stonesByColor.filter((_, i) => i >= 5 && i < 10), // Roxo
    stonesByColor.filter((_, i) => i >= 10 && i < 15), // Preto
    stonesByColor.filter((_, i) => i >= 15 && i < 20), // Verde
    stonesByColor.filter((_, i) => i >= 20 && i < 25), // Branco
    stonesByColor.filter((_, i) => i >= 25 && i < 30), // Verde Escuro
  ]

  // Selecionar/deselecionar uma pedra
  const toggleStoneSelection = (stoneId: string) => {
    if (selectedStones.includes(stoneId)) {
      setSelectedStones(selectedStones.filter((id) => id !== stoneId))
    } else {
      if (selectedStones.length < 7) {
        setSelectedStones([...selectedStones, stoneId])
        playStoneSound()
      } else {
        alert("Você já selecionou o número máximo de pedras (7).")
      }
    }
  }

  // Mostrar informações da pedra
  const showStoneDetails = (stoneId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const stone = stonesByColor.find((s) => s.id === stoneId)
    if (stone) {
      setSelectedStoneInfo({
        name: stone.name,
        color: stone.color,
        meaning: "Uma pedra mística com propriedades energéticas únicas.",
        properties: ["Equilíbrio", "Proteção", "Clareza mental"],
      })
      setShowStoneInfo(true)
    }
  }

  // Reproduzir som ao selecionar pedra
  const playStoneSound = () => {
    const audio = new Audio("/sounds/crystal-chime.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.error("Erro ao reproduzir som:", err))
  }

  // Gerar leitura baseada nas pedras selecionadas
  const generateReading = async () => {
    if (selectedStones.length === 0) {
      alert("Selecione pelo menos uma pedra para realizar a leitura.")
      return
    }

    setIsGeneratingReading(true)

    // Simulação de tempo de processamento
    setTimeout(() => {
      const reading = `
# O Espírito da Caixa se Manifesta

As pedras falam quando os discípulos silenciam. Através da disposição mística de ${selectedStones
        .map((id) => {
          const stone = stonesByColor.find((s) => s.id === id)
          return stone?.name || id
        })
        .join(", ")}, revela-se a verdade interior que habita em seu ser.

## Percepção Interior Atual

Você se encontra em um momento de transição energética. As pedras revelam um padrão de busca por equilíbrio entre o material e o espiritual. A presença dominante dos cristais sugere uma necessidade de clareza mental e emocional para avançar em seu caminho.

## Bloqueios Energéticos Ocultos

As sombras projetadas pelas pedras indicam resistências internas relacionadas à aceitação de mudanças. Há um temor oculto de abandonar zonas de conforto que, paradoxalmente, já não nutrem seu crescimento. A disposição das pedras revela padrões de pensamento circulares que impedem o fluxo natural de sua energia vital.

## Caminhos para Expansão do ECI

O caminho se ilumina através da integração consciente das energias representadas por cada cristal presente. A combinação única dessas vibrações sugere um processo de transmutação interior, onde o que antes era percebido como obstáculo se transforma em catalisador de crescimento. Permita-se fluir com as correntes energéticas que as pedras manifestam, encontrando harmonia na aparente contradição.

Que pergunta seu coração faz quando confrontado com o silêncio das pedras que falam?
      `

      setReadingResult(reading)
      setShowReadingResult(true)
      setIsGeneratingReading(false)
      setAudioGenerated(true)
    }, 3000)
  }

  // Controlar reprodução de áudio
  const toggleAudio = () => {
    if (!audioGenerated) return

    if (isPlaying) {
      window.speechSynthesis.pause()
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      if (readingResult) {
        const utterance = new SpeechSynthesisUtterance(readingResult)
        utterance.lang = "pt-BR"
        utterance.rate = 0.9
        utterance.pitch = 1.1
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
      }
    }
  }

  // Limpar seleção de pedras
  const clearSelection = () => {
    setSelectedStones([])
    setReadingResult(null)
    setShowReadingResult(false)
    setAudioGenerated(false)
  }

  // Renderizar pedras em uma prateleira
  const renderShelfStones = (stones: any[]) => {
    return (
      <div className="flex justify-center items-center gap-4">
        {stones.map((stone) => {
          const isSelected = selectedStones.includes(stone.id)

          return (
            <motion.div
              key={stone.id}
              className="relative cursor-pointer"
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleStoneSelection(stone.id)}
            >
              <div
                className={`w-12 h-12 rounded-full ${isSelected ? "ring-2 ring-yellow-300" : ""}`}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${stone.color} 0%, ${adjustColor(stone.color, -30)} 100%)`,
                  boxShadow: `0 2px 4px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)`,
                }}
              >
                {/* Reflexo na pedra */}
                <div
                  className="absolute w-4 h-2 rounded-full opacity-60"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    top: "20%",
                    left: "20%",
                    transform: "rotate(-20deg)",
                  }}
                />
              </div>

              {/* Botão de informação */}
              <button
                className="absolute -top-1 -right-1 w-5 h-5 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => showStoneDetails(stone.id, e)}
              >
                <Info className="w-3 h-3 text-white" />
              </button>
            </motion.div>
          )
        })}
      </div>
    )
  }

  // Renderizar pedras na bandeja de areia
  const renderSandTrayStones = () => {
    return (
      <div className="relative w-full h-full">
        {sandTrayStones.map((stone, index) => {
          // Calcular posição aleatória mas estável
          const left = 5 + (index % 8) * 12 + Math.sin(index) * 3
          const top = 5 + Math.floor(index / 8) * 25 + Math.cos(index) * 5

          return (
            <div
              key={stone.id}
              className="absolute"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                zIndex: Math.floor(Math.random() * 10),
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: `${8 + Math.random() * 6}px`,
                  height: `${8 + Math.random() * 6}px`,
                  background: `radial-gradient(circle at 30% 30%, ${stone.color} 0%, ${adjustColor(stone.color, -30)} 100%)`,
                  boxShadow: `0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3)`,
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }

  // Função auxiliar para ajustar cor
  function adjustColor(color: string, amount: number): string {
    return color
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Controles superiores */}
      <div className="flex justify-between items-center mb-4">
        <div></div>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-amber-100">Gabinete Dourado</h2>
          <p className="text-sm text-amber-200/70">Selecione até 7 pedras para sua leitura</p>
        </div>

        <Button
          onClick={clearSelection}
          variant="outline"
          className="bg-white/10 border-amber-300/30 hover:bg-white/20"
          disabled={selectedStones.length === 0}
        >
          Limpar Seleção
        </Button>
      </div>

      {/* Gabinete dourado */}
      <div
        className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-b from-amber-400 to-amber-500 border-8"
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          borderImage: "linear-gradient(45deg, #FFD700, #DAA520, #FFD700) 1",
        }}
      >
        {/* Estrutura do gabinete */}
        <div className="absolute inset-0 flex flex-col">
          {/* Prateleiras */}
          {shelves.map((shelf, index) => (
            <div key={index} className="relative flex-1 border-b border-amber-600/20 flex items-center justify-center">
              {/* Prateleira de vidro */}
              <div
                className="absolute inset-x-0 bottom-0 h-1 bg-cyan-200/20"
                style={{
                  boxShadow: "0 1px 2px rgba(255,255,255,0.1)",
                }}
              />

              {/* Pedras na prateleira */}
              {renderShelfStones(shelf)}
            </div>
          ))}

          {/* Gaveta inferior */}
          <div className="relative h-1/6 border-t border-amber-600/30">
            {/* Botão de abrir gaveta */}
            <button
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-1 rounded bg-amber-300 text-amber-900"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              {drawerOpen ? "FECHAR" : "ABRIR"}
            </button>
          </div>
        </div>

        {/* Gaveta aberta */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gray-200/90 z-20 rounded-t-lg overflow-hidden"
              style={{
                boxShadow: "0 -5px 15px rgba(0,0,0,0.2)",
              }}
            >
              {/* Bandeja de areia com pedras */}
              <div className="relative w-full h-full bg-amber-100/80">
                {/* Textura de areia */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('/images/sand-texture.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.3,
                  }}
                />

                {/* Pedras na bandeja */}
                {renderSandTrayStones()}

                {/* Pedras selecionadas */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 flex-wrap">
                  {selectedStones.map((stoneId) => {
                    const stone = stonesByColor.find((s) => s.id === stoneId)
                    if (!stone) return null

                    return (
                      <motion.div
                        key={`selected-${stoneId}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative"
                      >
                        <div
                          className="w-10 h-10 rounded-full cursor-pointer"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${stone.color} 0%, ${adjustColor(stone.color, -30)} 100%)`,
                            boxShadow: `0 2px 4px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)`,
                          }}
                          onClick={() => toggleStoneSelection(stoneId)}
                        >
                          <div
                            className="absolute w-4 h-2 rounded-full opacity-60"
                            style={{
                              background: "rgba(255,255,255,0.7)",
                              top: "20%",
                              left: "20%",
                              transform: "rotate(-20deg)",
                            }}
                          />
                        </div>
                        <button
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                          onClick={() => toggleStoneSelection(stoneId)}
                        >
                          ×
                        </button>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Botão de gerar leitura */}
                {selectedStones.length > 0 && (
                  <div className="absolute bottom-16 left-0 right-0 flex justify-center">
                    <Button
                      onClick={generateReading}
                      className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
                      disabled={isGeneratingReading}
                    >
                      {isGeneratingReading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Consultando as pedras...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Realizar Leitura Mística
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reflexos de vidro */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        {/* Bordas do gabinete */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-amber-300/50 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-amber-300/50 to-transparent" />
      </div>

      {/* Instruções */}
      <div className="mt-6 text-center text-sm text-amber-200/70">
        <p>Clique nas pedras para selecioná-las • Abra a gaveta inferior para ver sua seleção e realizar a leitura</p>
      </div>

      {/* Modal de informações da pedra */}
      <AnimatePresence>
        {showStoneInfo && selectedStoneInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowStoneInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${selectedStoneInfo.color} 0%, ${adjustColor(selectedStoneInfo.color, -30)} 100%)`,
                      boxShadow: `0 0 15px ${selectedStoneInfo.color}80`,
                    }}
                  >
                    <div
                      className="absolute w-6 h-3 rounded-full opacity-60"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        top: "25%",
                        left: "25%",
                        transform: "rotate(-20deg)",
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-100">{selectedStoneInfo.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowStoneInfo(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-4">
                <h4 className="text-sm uppercase tracking-wider text-amber-400 mb-1">Significado</h4>
                <p className="text-gray-300">{selectedStoneInfo.meaning}</p>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-wider text-amber-400 mb-1">Propriedades</h4>
                <ul className="list-disc pl-5 text-gray-300">
                  {selectedStoneInfo.properties.map((prop: string, index: number) => (
                    <li key={index}>{prop}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
                  onClick={() => setShowStoneInfo(false)}
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de resultado da leitura */}
      <AnimatePresence>
        {showReadingResult && readingResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReadingResult(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-amber-100">Leitura Mística</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReadingResult(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="prose prose-invert prose-amber max-w-none">
                <div className="whitespace-pre-line">{readingResult}</div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Button
                  onClick={toggleAudio}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isPlaying ? "Pausar Áudio" : "Ouvir Leitura"}
                </Button>

                <Button
                  onClick={() => setShowReadingResult(false)}
                  variant="outline"
                  className="border-amber-500/30 hover:bg-amber-900/20"
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elemento de áudio oculto */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
