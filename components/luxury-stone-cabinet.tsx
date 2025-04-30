"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, X, Sparkles, Volume2 } from "lucide-react"
import { stonePrompts } from "@/lib/stone-prompts"

// Definição das pedras com suas propriedades
const stoneData = [
  // Primeira prateleira
  { id: "labradorite", name: "Labradorite", color: "#3A7D7E", position: { shelf: 0, index: 0 } },
  { id: "agree", name: "Agree", color: "#89CFF0", position: { shelf: 0, index: 1 } },
  { id: "abalone", name: "Abalone", color: "#4F7942", position: { shelf: 0, index: 2 } },
  { id: "abalone2", name: "Abalone", color: "#5F8575", position: { shelf: 0, index: 3 } },
  { id: "onyx", name: "Ônix", color: "#0D0D0D", position: { shelf: 0, index: 4 } },
  { id: "malachite", name: "Malaquita", color: "#CD5C5C", position: { shelf: 0, index: 5 } },
  { id: "rhodagrosite", name: "Rhodagrosite", color: "#228B22", position: { shelf: 0, index: 6 } },

  // Segunda prateleira
  { id: "kyarite", name: "Kyarite", color: "#3A7D7E", position: { shelf: 1, index: 0 } },
  { id: "amoityop", name: "Amoityop", color: "#9370DB", position: { shelf: 1, index: 1 } },
  { id: "petrihual", name: "Petrihual", color: "#4F7942", position: { shelf: 1, index: 2 } },
  { id: "arsieronite", name: "Arsieronite", color: "#5F8575", position: { shelf: 1, index: 3 } },
  { id: "moonstone", name: "Pedra da Lua", color: "#ADD8E6", position: { shelf: 1, index: 4 } },
  { id: "matacite", name: "Matacite", color: "#2E8B57", position: { shelf: 1, index: 5 } },
  { id: "rhodochraite", name: "Rhodochraite", color: "#C71585", position: { shelf: 1, index: 6 } },

  // Terceira prateleira
  { id: "malachite2", name: "Malaquita", color: "#0000CD", position: { shelf: 2, index: 0 } },
  { id: "cenerite", name: "Cenerite", color: "#40E0D0", position: { shelf: 2, index: 1 } },
  { id: "fluorite", name: "Fluorita", color: "#00FF7F", position: { shelf: 2, index: 2 } },
  { id: "aventurite", name: "Aventurita", color: "#2E8B57", position: { shelf: 2, index: 3 } },
  { id: "sodelite", name: "Sodelita", color: "#0000CD", position: { shelf: 2, index: 4 } },
  { id: "lipa", name: "Lipa Lesdi", color: "#191970", position: { shelf: 2, index: 5 } },
  { id: "carnelian", name: "Cornalina", color: "#FF4500", position: { shelf: 2, index: 6 } },

  // Quarta prateleira
  { id: "chrosepase", name: "Chrosepase", color: "#4F7942", position: { shelf: 3, index: 0 } },
  { id: "angelite", name: "Angelita", color: "#ADD8E6", position: { shelf: 3, index: 1 } },
  { id: "aquamarine", name: "Água Marinha", color: "#00BFFF", position: { shelf: 3, index: 2 } },
  { id: "aquamarine2", name: "Água Marinha", color: "#2E8B57", position: { shelf: 3, index: 3 } },
  { id: "sodalite", name: "Sodalita", color: "#191970", position: { shelf: 3, index: 4 } },
  { id: "rose-quartz", name: "Quartzo Rosa", color: "#FFB6C1", position: { shelf: 3, index: 5 } },
  { id: "garnet", name: "Granada", color: "#800000", position: { shelf: 3, index: 6 } },
]

// Pedras para a bandeja inferior
const trayStones = [
  { id: "tray-1", color: "#40E0D0", shape: "oval" },
  { id: "tray-2", color: "#00BFFF", shape: "crystal" },
  { id: "tray-3", color: "#ADD8E6", shape: "oval" },
  { id: "tray-4", color: "#2E8B57", shape: "round" },
  { id: "tray-5", color: "#191970", shape: "oval" },
  { id: "tray-6", color: "#FFB6C1", shape: "round" },
  { id: "tray-7", color: "#800000", shape: "round" },
  { id: "tray-8", color: "#40E0D0", shape: "oval" },
  { id: "tray-9", color: "#9370DB", shape: "crystal" },
  { id: "tray-10", color: "#ADD8E6", shape: "oval" },
  { id: "tray-11", color: "#191970", shape: "oval" },
  { id: "tray-12", color: "#FFB6C1", shape: "round" },
  { id: "tray-13", color: "#800000", shape: "round" },
  { id: "tray-14", color: "#40E0D0", shape: "oval" },
  { id: "tray-15", color: "#2E8B57", shape: "oval" },
  { id: "tray-16", color: "#191970", shape: "oval" },
  { id: "tray-17", color: "#FFB6C1", shape: "round" },
  { id: "tray-18", color: "#800000", shape: "round" },
]

export default function LuxuryStoneCabinet() {
  const [selectedStones, setSelectedStones] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cabinetStyle, setCabinetStyle] = useState<"wood" | "gold">("wood")
  const [showStoneInfo, setShowStoneInfo] = useState(false)
  const [selectedStoneInfo, setSelectedStoneInfo] = useState<any>(null)
  const [readingResult, setReadingResult] = useState<string | null>(null)
  const [isGeneratingReading, setIsGeneratingReading] = useState(false)
  const [showReadingResult, setShowReadingResult] = useState(false)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const cabinetRef = useRef<HTMLDivElement>(null)
  const [cabinetDimensions, setCabinetDimensions] = useState({ width: 0, height: 0 })

  // Atualizar dimensões do gabinete ao redimensionar
  useEffect(() => {
    if (!cabinetRef.current) return

    const updateDimensions = () => {
      if (cabinetRef.current) {
        const { width, height } = cabinetRef.current.getBoundingClientRect()
        setCabinetDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Alternar estilo do gabinete
  const toggleCabinetStyle = () => {
    setCabinetStyle(cabinetStyle === "wood" ? "gold" : "wood")
  }

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
    const stone = stoneData.find((s) => s.id === stoneId)
    if (stone) {
      setSelectedStoneInfo({
        name: stone.name,
        color: stone.color,
        meaning: stonePrompts[stoneId]?.meaning || "Uma pedra mística com propriedades energéticas únicas.",
        properties: stonePrompts[stoneId]?.properties || ["Equilíbrio", "Proteção", "Clareza mental"],
      })
      setShowStoneInfo(true)
    }
  }

  // Reproduzir som ao selecionar pedra
  const playStoneSound = () => {
    try {
      // Verificar se estamos no navegador antes de tentar reproduzir o som
      if (typeof window !== "undefined") {
        // Usar um som que sabemos que existe ou verificar se existe antes de reproduzir
        const audio = new Audio("/sounds/crystal-chime.mp3")
        audio.volume = 0.3

        // Adicionar tratamento de erro para o evento de erro de carregamento
        audio.onerror = (e) => {
          console.log("Erro ao carregar o som: ", e)
        }

        // Verificar se o arquivo existe antes de tentar reproduzir
        const playPromise = audio.play()

        // Tratar a promessa retornada por play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Reprodução iniciada com sucesso
            })
            .catch((err) => {
              console.log("Alternativa: usando efeito sonoro padrão")
              // Fallback para um beep simples gerado via API Web Audio
              const audioContext = new (window.AudioContext || window.webkitAudioContext)()
              const oscillator = audioContext.createOscillator()
              const gainNode = audioContext.createGain()

              oscillator.type = "sine"
              oscillator.frequency.value = 800
              gainNode.gain.value = 0.1

              oscillator.connect(gainNode)
              gainNode.connect(audioContext.destination)

              oscillator.start()
              setTimeout(() => oscillator.stop(), 200)
            })
        }
      }
    } catch (err) {
      console.error("Erro ao reproduzir som:", err)
    }
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
          const stone = stoneData.find((s) => s.id === id)
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

  // Renderizar uma pedra na prateleira
  const renderShelfStone = (stone: any) => {
    const isSelected = selectedStones.includes(stone.id)

    return (
      <motion.div
        key={stone.id}
        className="relative cursor-pointer group"
        whileHover={{ y: -5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleStoneSelection(stone.id)}
      >
        <div
          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ${
            isSelected ? "ring-2 ring-yellow-300 ring-offset-2" : ""
          }`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${stone.color} 0%, ${adjustColor(stone.color, -30)} 100%)`,
            boxShadow: `0 4px 8px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.3)`,
          }}
        >
          {/* Reflexo na pedra */}
          <div
            className="absolute w-6 h-3 rounded-full opacity-60"
            style={{
              background: "rgba(255,255,255,0.7)",
              top: "20%",
              left: "20%",
              transform: "rotate(-20deg)",
            }}
          />
        </div>

        {/* Nome da pedra */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center font-medium opacity-80 w-full">
          {stone.name}
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
  }

  // Renderizar uma pedra na bandeja
  const renderTrayStone = (stone: any, index: number) => {
    // Calcular posição aleatória mas estável na bandeja
    const left = 10 + (index % 6) * 15 + Math.sin(index) * 5
    const top = 10 + Math.floor(index / 6) * 15 + Math.cos(index) * 5

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
          className={`${stone.shape === "crystal" ? "polygon" : stone.shape === "oval" ? "oval" : "rounded-full"}`}
          style={{
            width: `${12 + Math.random() * 8}px`,
            height: `${10 + Math.random() * 6}px`,
            background: `radial-gradient(circle at 30% 30%, ${stone.color} 0%, ${adjustColor(stone.color, -30)} 100%)`,
            boxShadow: `0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)`,
          }}
        />
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
        <Button
          onClick={toggleCabinetStyle}
          variant="outline"
          className="bg-white/10 border-amber-300/30 hover:bg-white/20"
        >
          {cabinetStyle === "wood" ? "Gabinete Dourado" : "Gabinete de Madeira"}
        </Button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-amber-100">A CAIXA MÍSTICA</h2>
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

      {/* Gabinete de pedras */}
      <div
        ref={cabinetRef}
        className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden ${
          cabinetStyle === "wood"
            ? "bg-gradient-to-b from-amber-800 to-amber-900 border-8 border-amber-700"
            : "bg-gradient-to-b from-amber-400 to-amber-500 border-8"
        }`}
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          borderImage:
            cabinetStyle === "wood"
              ? "linear-gradient(45deg, #8B4513, #A0522D, #8B4513) 1"
              : "linear-gradient(45deg, #FFD700, #DAA520, #FFD700) 1",
        }}
      >
        {/* Fundo do gabinete */}
        <div
          className="absolute inset-0 bg-gray-100/10"
          style={{
            backgroundImage: cabinetStyle === "wood" ? "url('/images/wood-texture.png')" : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />

        {/* Estrutura do gabinete */}
        <div className="absolute inset-0 flex flex-col">
          {/* Prateleiras */}
          {Array.from({ length: 4 }).map((_, shelfIndex) => (
            <div
              key={shelfIndex}
              className="relative flex-1 border-b border-amber-600/20 flex items-center justify-center"
            >
              {/* Prateleira de vidro */}
              <div
                className="absolute inset-x-0 bottom-0 h-1 bg-cyan-200/20"
                style={{
                  boxShadow: "0 1px 2px rgba(255,255,255,0.1)",
                }}
              />

              {/* Pedras na prateleira */}
              <div className="flex justify-around items-center w-full px-4">
                {stoneData
                  .filter((stone) => stone.position.shelf === shelfIndex)
                  .map((stone) => renderShelfStone(stone))}
              </div>
            </div>
          ))}

          {/* Gaveta inferior */}
          <div className="relative h-1/6 border-t border-amber-600/30">
            {/* Botão de abrir gaveta */}
            <button
              className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-1 rounded ${
                cabinetStyle === "wood" ? "bg-amber-800 text-amber-200" : "bg-amber-300 text-amber-900"
              }`}
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
                {trayStones.map((stone, index) => renderTrayStone(stone, index))}

                {/* Pedras selecionadas */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 flex-wrap">
                  {selectedStones.map((stoneId) => {
                    const stone = stoneData.find((s) => s.id === stoneId)
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
        <p>
          Clique nas pedras para selecioná-las • Passe o mouse sobre uma pedra e clique no ícone (i) para ver detalhes
        </p>
        <p>Abra a gaveta inferior para ver sua seleção e realizar a leitura</p>
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

      {/* Estilos para formas de pedras */}
      <style jsx global>{`
        .polygon {
          clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
        .oval {
          border-radius: 50%;
          transform: scaleX(1.5);
        }
      `}</style>
    </div>
  )
}
