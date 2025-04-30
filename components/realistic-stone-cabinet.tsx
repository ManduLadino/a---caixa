"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, X, Sparkles, Volume2 } from "lucide-react"

// Definição das pedras por cor
const stoneGroups = [
  {
    id: "turquoise",
    name: "Turquesa",
    color: "#40E0D0",
    count: 24,
    properties: ["Cura", "Proteção", "Sabedoria"],
    meaning: "Pedra de proteção e cura, conecta o céu e a terra, trazendo equilíbrio espiritual.",
  },
  {
    id: "amethyst",
    name: "Ametista",
    color: "#9370DB",
    count: 24,
    properties: ["Intuição", "Espiritualidade", "Calma"],
    meaning: "Pedra da intuição e conexão espiritual, acalma a mente e eleva a consciência.",
  },
  {
    id: "onyx",
    name: "Ônix",
    color: "#2F4F4F",
    count: 18,
    properties: ["Força", "Proteção", "Foco"],
    meaning: "Pedra de força e proteção, absorve energias negativas e fortalece a determinação.",
  },
  {
    id: "jade",
    name: "Jade",
    color: "#2E8B57",
    count: 18,
    properties: ["Harmonia", "Prosperidade", "Equilíbrio"],
    meaning: "Pedra da harmonia e equilíbrio, atrai prosperidade e bem-estar em todos os níveis.",
  },
  {
    id: "moonstone",
    name: "Pedra da Lua",
    color: "#F5F5F5",
    count: 24,
    properties: ["Intuição", "Feminilidade", "Novos começos"],
    meaning: "Pedra dos ciclos e da intuição, conecta com a energia lunar e os aspectos femininos.",
  },
  {
    id: "emerald",
    name: "Esmeralda",
    color: "#006400",
    count: 18,
    properties: ["Amor", "Renovação", "Sabedoria"],
    meaning: "Pedra do coração, promove amor incondicional, renovação e sabedoria profunda.",
  },
]

// Pedras para o fundo de areia
const sandStones = Array.from({ length: 60 }, (_, i) => {
  // Distribuir as cores de forma equilibrada
  const groupIndex = Math.floor(i / 10) % stoneGroups.length
  const group = stoneGroups[groupIndex]

  return {
    id: `sand-${i}`,
    color: group.color,
    size: 4 + Math.random() * 6,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
  }
})

export default function RealisticStoneCabinet() {
  const [selectedStones, setSelectedStones] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showStoneInfo, setShowStoneInfo] = useState(false)
  const [selectedStoneInfo, setSelectedStoneInfo] = useState<any>(null)
  const [readingResult, setReadingResult] = useState<string | null>(null)
  const [isGeneratingReading, setIsGeneratingReading] = useState(false)
  const [showReadingResult, setShowReadingResult] = useState(false)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [drawerHeight, setDrawerHeight] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const cabinetRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Calcular altura da gaveta quando o componente montar
  useEffect(() => {
    if (cabinetRef.current) {
      const cabinetHeight = cabinetRef.current.offsetHeight
      setDrawerHeight(cabinetHeight * 0.25) // 25% da altura do gabinete
    }
  }, [])

  // Selecionar/deselecionar uma pedra
  const toggleStoneSelection = (stoneId: string, groupId: string) => {
    const fullId = `${groupId}-${stoneId}`

    if (selectedStones.includes(fullId)) {
      setSelectedStones(selectedStones.filter((id) => id !== fullId))
    } else {
      if (selectedStones.length < 7) {
        setSelectedStones([...selectedStones, fullId])
        playStoneSound()
      } else {
        alert("Você já selecionou o número máximo de pedras (7).")
      }
    }
  }

  // Mostrar informações da pedra
  const showStoneDetails = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const group = stoneGroups.find((g) => g.id === groupId)
    if (group) {
      setSelectedStoneInfo({
        name: group.name,
        color: group.color,
        meaning: group.meaning,
        properties: group.properties,
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
          const [groupId] = id.split("-")
          const group = stoneGroups.find((g) => g.id === groupId)
          return group?.name || id
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

  // Renderizar um grupo de pedras em uma prateleira
  const renderStoneGroup = (group: (typeof stoneGroups)[0], index: number) => {
    // Determinar se o grupo deve estar à esquerda ou direita
    const isLeft = index % 2 === 0

    return (
      <div
        key={group.id}
        className="relative h-full flex items-center justify-center"
        style={{
          gridColumn: isLeft ? "1" : "2",
          gridRow: Math.floor(index / 2) + 1,
        }}
      >
        <div
          className="relative w-full h-3/4 cursor-pointer group"
          onClick={() => {
            // Selecionar uma pedra aleatória deste grupo
            const randomStoneId = Math.floor(Math.random() * group.count).toString()
            toggleStoneSelection(randomStoneId, group.id)
          }}
        >
          {/* Grupo de pedras */}
          <div className="absolute inset-0 flex flex-wrap items-center justify-center">
            {Array.from({ length: group.count }).map((_, i) => {
              const stoneId = i.toString()
              const fullId = `${group.id}-${stoneId}`
              const isSelected = selectedStones.includes(fullId)

              // Calcular posição para criar um monte natural de pedras
              const row = Math.floor(i / 6)
              const col = i % 6
              const offsetX = col * 14 + (row % 2 ? 7 : 0) + (Math.random() * 4 - 2)
              const offsetY = row * 10 + (Math.random() * 4 - 2)
              const zIndex = row

              return (
                <div
                  key={stoneId}
                  className={`absolute rounded-full ${isSelected ? "ring-2 ring-yellow-300 ring-offset-1" : ""}`}
                  style={{
                    width: `${8 + Math.random() * 4}px`,
                    height: `${6 + Math.random() * 4}px`,
                    background: `radial-gradient(circle at 30% 30%, ${group.color} 0%, ${adjustColor(group.color, -30)} 100%)`,
                    boxShadow: `0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)`,
                    left: `${offsetX}%`,
                    top: `${offsetY}%`,
                    zIndex,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleStoneSelection(stoneId, group.id)
                  }}
                >
                  {/* Reflexo na pedra */}
                  <div
                    className="absolute w-1/3 h-1/4 rounded-full opacity-60"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      top: "20%",
                      left: "20%",
                      transform: "rotate(-20deg)",
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Nome do grupo */}
          <div className="absolute bottom-0 left-0 right-0 text-center text-xs font-medium text-amber-100/80">
            {group.name}
          </div>

          {/* Botão de informação */}
          <button
            className="absolute top-0 right-0 w-6 h-6 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => showStoneDetails(group.id, e)}
          >
            <Info className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    )
  }

  // Renderizar pedras na base de areia
  const renderSandStones = () => {
    return (
      <div className="relative w-full h-full">
        {/* Textura de areia */}
        <div
          className="absolute inset-0 bg-amber-50/90"
          style={{
            backgroundImage: "url('/images/sand-texture.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Pedras na areia */}
        {sandStones.map((stone, index) => (
          <div
            key={stone.id}
            className="absolute rounded-full"
            style={{
              width: `${stone.size}px`,
              height: `${stone.size * 0.8}px`,
              background: `radial-gradient(circle at 30% 30%, ${stone.color} 0%, ${adjustColor(stone.color, -30)} 100%)`,
              boxShadow: `0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3)`,
              left: `${stone.x}%`,
              top: `${stone.y}%`,
              transform: `rotate(${stone.rotation}deg)`,
              zIndex: Math.floor(Math.random() * 10),
            }}
          >
            {/* Reflexo na pedra */}
            <div
              className="absolute w-1/3 h-1/4 rounded-full opacity-60"
              style={{
                background: "rgba(255,255,255,0.7)",
                top: "20%",
                left: "20%",
                transform: "rotate(-20deg)",
              }}
            />
          </div>
        ))}
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
          <h2 className="text-xl md:text-2xl font-bold text-amber-100">Gabinete Místico</h2>
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
      <div ref={cabinetRef} className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
        {/* Estrutura do gabinete */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-amber-400 to-amber-500 border-8 rounded-lg"
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            borderImage: "linear-gradient(45deg, #FFD700, #DAA520, #FFD700) 1",
          }}
        >
          {/* Reflexos metálicos */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />

          {/* Interior do gabinete */}
          <div className="absolute inset-[5%] bg-gray-100/90 flex flex-col">
            {/* Área de prateleiras */}
            <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-px bg-amber-800/10">
              {stoneGroups.map((group, index) => renderStoneGroup(group, index))}

              {/* Prateleiras de vidro */}
              {[1, 2].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 h-px bg-cyan-200/40"
                  style={{
                    top: `${(i + 1) * 33.33}%`,
                    boxShadow: "0 1px 2px rgba(255,255,255,0.2)",
                  }}
                />
              ))}

              {/* Divisória central */}
              <div
                className="absolute top-0 bottom-0 w-px left-1/2 bg-cyan-200/30"
                style={{
                  boxShadow: "0 0 2px rgba(255,255,255,0.2)",
                }}
              />
            </div>

            {/* Base com areia e pedras */}
            <div className="h-1/6 relative">{renderSandStones()}</div>
          </div>

          {/* Gaveta inferior */}
          <div className="absolute left-0 right-0 bottom-0 h-[15%] border-t border-amber-600/30 flex items-center justify-center">
            {/* Botão de abrir gaveta */}
            <button
              className="px-8 py-2 bg-amber-300 text-amber-900 font-semibold rounded-sm hover:bg-amber-200 transition-colors"
              onClick={() => setDrawerOpen(!drawerOpen)}
              style={{
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {drawerOpen ? "FECHAR" : "ABRIR"}
            </button>
          </div>

          {/* Reflexos de vidro */}
          <div className="absolute inset-[5%] pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
        </div>

        {/* Gaveta aberta */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              ref={drawerRef}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-x-[5%] bottom-[5%] bg-gray-200/90 z-20 rounded-t-lg overflow-hidden"
              style={{
                height: drawerHeight,
                boxShadow: "0 -5px 15px rgba(0,0,0,0.2)",
              }}
            >
              {/* Bandeja de seleção */}
              <div className="relative w-full h-full bg-amber-100/80 p-4">
                {/* Textura de veludo */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('/images/velvet-texture.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.2,
                  }}
                />

                {/* Título da bandeja */}
                <h3 className="text-center text-amber-900 font-medium mb-2">Pedras Selecionadas</h3>

                {/* Pedras selecionadas */}
                <div className="flex justify-center items-center gap-3 flex-wrap">
                  {selectedStones.length === 0 ? (
                    <p className="text-amber-800/70 text-sm italic">Selecione pedras do gabinete para sua leitura</p>
                  ) : (
                    selectedStones.map((fullId) => {
                      const [groupId, stoneId] = fullId.split("-")
                      const group = stoneGroups.find((g) => g.id === groupId)
                      if (!group) return null

                      return (
                        <motion.div
                          key={`selected-${fullId}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative"
                        >
                          <div
                            className="w-12 h-12 rounded-full cursor-pointer flex items-center justify-center"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, ${group.color} 0%, ${adjustColor(group.color, -30)} 100%)`,
                              boxShadow: `0 3px 6px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.3)`,
                            }}
                            onClick={() => toggleStoneSelection(stoneId, groupId)}
                          >
                            <div
                              className="absolute w-4 h-2 rounded-full opacity-60"
                              style={{
                                background: "rgba(255,255,255,0.7)",
                                top: "25%",
                                left: "25%",
                                transform: "rotate(-20deg)",
                              }}
                            />
                          </div>
                          <div className="absolute -bottom-5 left-0 right-0 text-center text-xs font-medium text-amber-900">
                            {group.name}
                          </div>
                          <button
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                            onClick={() => toggleStoneSelection(stoneId, groupId)}
                          >
                            ×
                          </button>
                        </motion.div>
                      )
                    })
                  )}
                </div>

                {/* Botão de gerar leitura */}
                {selectedStones.length > 0 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
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
      </div>

      {/* Instruções */}
      <div className="mt-6 text-center text-sm text-amber-200/70">
        <p>
          Clique nos grupos de pedras para selecioná-las • Passe o mouse sobre um grupo e clique no ícone (i) para ver
          detalhes
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
    </div>
  )
}
