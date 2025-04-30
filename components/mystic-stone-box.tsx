"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Info } from "lucide-react"
import { stonePrompts } from "@/lib/stone-prompts"

// Definição das pedras com suas propriedades
const stones = [
  {
    id: "ametista",
    name: "Ametista",
    image: "/amethyst-crystal.png",
    position: { x: 35, y: 45 },
    rotation: 15,
    scale: 1.2,
    zIndex: 5,
  },
  {
    id: "quartzoRosa",
    name: "Quartzo Rosa",
    image: "/rose-quartz-crystal.png",
    position: { x: 65, y: 30 },
    rotation: -10,
    scale: 1.1,
    zIndex: 4,
  },
  {
    id: "turmalinaNegra",
    name: "Turmalina Negra",
    image: "/black-tourmaline-crystal.png",
    position: { x: 20, y: 70 },
    rotation: 5,
    scale: 1,
    zIndex: 3,
  },
  {
    id: "quartzoTransparente",
    name: "Quartzo Transparente",
    image: "/clear-quartz-crystal.png",
    position: { x: 75, y: 65 },
    rotation: -5,
    scale: 0.9,
    zIndex: 2,
  },
  {
    id: "lapisLazuli",
    name: "Lápis-Lazúli",
    image: "/lapis-lazuli-crystal.png",
    position: { x: 50, y: 55 },
    rotation: 20,
    scale: 0.85,
    zIndex: 6,
  },
  {
    id: "citrino",
    name: "Citrino",
    image: "/citrine-crystal.png",
    position: { x: 25, y: 25 },
    rotation: -15,
    scale: 0.95,
    zIndex: 1,
  },
  {
    id: "jade",
    name: "Jade",
    image: "/jade-crystal.png",
    position: { x: 60, y: 75 },
    rotation: 10,
    scale: 0.8,
    zIndex: 7,
  },
]

export default function MysticStoneBox() {
  const [selectedStone, setSelectedStone] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [reading, setReading] = useState("")
  const [isGeneratingReading, setIsGeneratingReading] = useState(false)
  const [selectedStones, setSelectedStones] = useState<string[]>([])

  // Função para selecionar/deselecionar uma pedra
  const toggleStoneSelection = (stoneId: string) => {
    setSelectedStone(stoneId)

    if (selectedStones.includes(stoneId)) {
      setSelectedStones(selectedStones.filter((id) => id !== stoneId))
    } else {
      setSelectedStones([...selectedStones, stoneId])
    }
  }

  // Função para mostrar informações da pedra
  const showStoneInfo = (stoneId: string) => {
    setSelectedStone(stoneId)
    setShowInfo(true)
  }

  // Função para gerar uma leitura baseada nas pedras selecionadas
  const generateReading = async () => {
    if (selectedStones.length === 0) return

    setIsGeneratingReading(true)

    // Simulando o tempo de geração da leitura
    setTimeout(() => {
      const stoneDetails = selectedStones
        .map((id) => {
          const stone = stonePrompts[id as keyof typeof stonePrompts]
          return stone ? `${stone.name} (${stone.meaning})` : "Pedra desconhecida"
        })
        .join(", ")

      setReading(`
        <h3>O Espírito da Caixa se Manifesta</h3>
        
        <p>As pedras falam quando os discípulos silenciam. Através da disposição mística de ${stoneDetails}, revela-se a verdade interior que habita em seu ser.</p>
        
        <h4>Percepção Interior Atual</h4>
        <p>Você se encontra em um momento de transição energética. As pedras revelam um padrão de busca por equilíbrio entre o material e o espiritual. A presença dominante dos cristais sugere uma necessidade de clareza mental e emocional para avançar em seu caminho.</p>
        
        <h4>Bloqueios Energéticos Ocultos</h4>
        <p>As sombras projetadas pelas pedras indicam resistências internas relacionadas à aceitação de mudanças. Há um temor oculto de abandonar zonas de conforto que, paradoxalmente, já não nutrem seu crescimento. A disposição das pedras revela padrões de pensamento circulares que impedem o fluxo natural de sua energia vital.</p>
        
        <h4>Caminhos para Expansão do ECI</h4>
        <p>O caminho se ilumina através da integração consciente das energias representadas por cada cristal presente. A combinação única dessas vibrações sugere um processo de transmutação interior, onde o que antes era percebido como obstáculo se transforma em catalisador de crescimento. Permita-se fluir com as correntes energéticas que as pedras manifestam, encontrando harmonia na aparente contradição.</p>
        
        <p>Que pergunta seu coração faz quando confrontado com o silêncio das pedras que falam?</p>
      `)

      setIsGeneratingReading(false)
    }, 3000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative aspect-square max-w-2xl mx-auto mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700/50">
        {/* Fundo da caixa com textura */}
        <div className="absolute inset-0 bg-[url('/images/parchment-texture.png')] opacity-10"></div>

        {/* Efeito de iluminação */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"></div>

        {/* Pedras na caixa */}
        {stones.map((stone) => (
          <motion.div
            key={stone.id}
            className={`absolute cursor-pointer`}
            style={{
              left: `${stone.position.x}%`,
              top: `${stone.position.y}%`,
              zIndex: stone.zIndex,
              transform: `translate(-50%, -50%) rotate(${stone.rotation}deg) scale(${stone.scale})`,
            }}
            whileHover={{ scale: stone.scale * 1.1 }}
            animate={
              selectedStones.includes(stone.id)
                ? {
                    y: -10,
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
                  }
                : {}
            }
          >
            {/* Container da pedra */}
            <div
              className={`relative w-20 h-20 md:w-24 md:h-24 ${selectedStones.includes(stone.id) ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900" : ""}`}
              onClick={() => toggleStoneSelection(stone.id)}
            >
              <Image src={stone.image || "/placeholder.svg"} alt={stone.name} fill className="object-contain" />

              {/* Efeito de brilho nas pedras selecionadas */}
              {selectedStones.includes(stone.id) && (
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              )}
            </div>

            {/* Botão de informação */}
            <button
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation()
                showStoneInfo(stone.id)
              }}
            >
              <Info className="w-3 h-3 text-gray-300" />
            </button>

            {/* Nome da pedra */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 bg-gray-800/80 px-2 py-0.5 rounded whitespace-nowrap">
              {stone.name}
            </div>
          </motion.div>
        ))}

        {/* Reflexos e sombras */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
      </div>

      {/* Instruções e botões */}
      <div className="text-center mb-8">
        <p className="text-gray-300 mb-4">
          Selecione as pedras que chamam sua atenção para receber uma leitura personalizada do seu Estado de Consciência
          Interna.
        </p>
        <Button
          onClick={generateReading}
          disabled={selectedStones.length === 0 || isGeneratingReading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGeneratingReading ? "Consultando as pedras..." : "Gerar Leitura"}
        </Button>
      </div>

      {/* Resultado da leitura */}
      {reading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700/50 mb-8"
        >
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: reading }}></div>
        </motion.div>
      )}

      {/* Modal de informações da pedra */}
      {showInfo && selectedStone && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pedra selecionada */}
            {(() => {
              const stone = stonePrompts[selectedStone as keyof typeof stonePrompts]
              const stoneData = stones.find((s) => s.id === selectedStone)

              if (!stone || !stoneData) return null

              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={stoneData.image || "/placeholder.svg"}
                          alt={stone.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{stone.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowInfo(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Significado</h4>
                    <p className="text-white">{stone.meaning}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Descrição</h4>
                    <p className="text-white">{stone.description}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Origem</h4>
                    <p className="text-white">{stone.origin}</p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => setShowInfo(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
