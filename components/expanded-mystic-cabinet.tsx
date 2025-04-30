"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, X, Info, Check, RotateCcw } from "lucide-react"
import ReadingResult from "@/components/reading-result"

// Definição das pedras com suas propriedades
const allStones = [
  {
    id: "ametista",
    name: "Ametista",
    image: "/amethyst-crystal.png",
    color: "#9966CC",
    category: "Proteção",
  },
  {
    id: "quartzoRosa",
    name: "Quartzo Rosa",
    image: "/rose-quartz-crystal.png",
    color: "#F4C2C2",
    category: "Amor",
  },
  {
    id: "turmalinaNegra",
    name: "Turmalina Negra",
    image: "/black-tourmaline-crystal.png",
    color: "#2C3539",
    category: "Proteção",
  },
  {
    id: "quartzoTransparente",
    name: "Quartzo Transparente",
    image: "/clear-quartz-crystal.png",
    color: "#F5F5F5",
    category: "Amplificação",
  },
  {
    id: "lapisLazuli",
    name: "Lápis-Lazúli",
    image: "/lapis-lazuli-crystal.png",
    color: "#26619C",
    category: "Sabedoria",
  },
  {
    id: "citrino",
    name: "Citrino",
    image: "/citrine-crystal.png",
    color: "#FFD700",
    category: "Prosperidade",
  },
  {
    id: "jade",
    name: "Jade",
    image: "/jade-crystal.png",
    color: "#00A86B",
    category: "Sorte",
  },
  {
    id: "aguaMarinha",
    name: "Água Marinha",
    image: "/aquamarine-crystal.png",
    color: "#ADD8E6",
    category: "Comunicação",
  },
  {
    id: "olhoDeTigre",
    name: "Olho de Tigre",
    image: "/tigers-eye-crystal.png",
    color: "#B8860B",
    category: "Proteção",
  },
  {
    id: "fluorita",
    name: "Fluorita",
    image: "/fluorite-crystal.png",
    color: "#9966CC",
    category: "Clareza",
  },
  {
    id: "esmeralda",
    name: "Esmeralda",
    image: "/emerald-crystal.png",
    color: "#50C878",
    category: "Amor",
  },
  {
    id: "granada",
    name: "Granada",
    image: "/garnet-crystal.png",
    color: "#7B1113",
    category: "Vitalidade",
  },
  {
    id: "hematita",
    name: "Hematita",
    image: "/hematite-crystal.png",
    color: "#2C3539",
    category: "Aterramento",
  },
  {
    id: "amazonita",
    name: "Amazonita",
    image: "/amazonite-crystal.png",
    color: "#00BFFF",
    category: "Harmonia",
  },
  {
    id: "calcitaLaranja",
    name: "Calcita Laranja",
    image: "/orange-calcite-crystal.png",
    color: "#FF7F50",
    category: "Criatividade",
  },
  {
    id: "crisoprase",
    name: "Crisoprase",
    image: "/chrysoprase-crystal.png",
    color: "#87CEAB",
    category: "Crescimento",
  },
  {
    id: "agataAzul",
    name: "Ágata Azul",
    image: "/blue-agate-crystal.png",
    color: "#1F75FE",
    category: "Comunicação",
  },
  {
    id: "agataMusgo",
    name: "Ágata Musgo",
    image: "/moss-agate-crystal.png",
    color: "#4F7942",
    category: "Abundância",
  },
  {
    id: "agataPreta",
    name: "Ágata Preta",
    image: "/black-agate-crystal.png",
    color: "#2F4F4F",
    category: "Proteção",
  },
  {
    id: "agataRosa",
    name: "Ágata Rosa",
    image: "/pink-agate-crystal.png",
    color: "#FFC0CB",
    category: "Amor",
  },
  {
    id: "agataVerde",
    name: "Ágata Verde",
    image: "/green-agate-crystal.png",
    color: "#4F7942",
    category: "Equilíbrio",
  },
  {
    id: "abalone",
    name: "Abalone",
    image: "/abalone-iridescent.png",
    color: "#83CFDF",
    category: "Intuição",
  },
  {
    id: "cianitaAzul",
    name: "Cianita Azul",
    image: "/blue-kyanite.png",
    color: "#4682B4",
    category: "Comunicação",
  },
  {
    id: "cianitaPreta",
    name: "Cianita Preta",
    image: "/black-kyanite-crystal.png",
    color: "#2F4F4F",
    category: "Aterramento",
  },
  {
    id: "carneliana",
    name: "Carneliana",
    image: "/carnelian-crystal.png",
    color: "#B22222",
    category: "Coragem",
  },
  {
    id: "obsidiana",
    name: "Obsidiana",
    image: "/obsidian-crystal.png",
    color: "#000000",
    category: "Proteção",
  },
  {
    id: "selenita",
    name: "Selenita",
    image: "/selenite-crystal.png",
    color: "#F5F5F5",
    category: "Clareza",
  },
  {
    id: "malaquita",
    name: "Malaquita",
    image: "/malachite-crystal.png",
    color: "#004D40",
    category: "Transformação",
  },
  {
    id: "labradorita",
    name: "Labradorita",
    image: "/labradorite-iridescent.png",
    color: "#483D8B",
    category: "Magia",
  },
  {
    id: "pirita",
    name: "Pirita",
    image: "/pyrite-cubic-crystal.png",
    color: "#DAA520",
    category: "Abundância",
  },
  {
    id: "sodalita",
    name: "Sodalita",
    image: "/blue-sodalite-crystal.png",
    color: "#24348B",
    category: "Intuição",
  },
  {
    id: "jaspeVermelho",
    name: "Jaspe Vermelho",
    image: "/red-jasper-stone.png",
    color: "#8B0000",
    category: "Força",
  },
  {
    id: "moonstone",
    name: "Pedra da Lua",
    image: "/moonstone-crystal.png",
    color: "#F8F8FF",
    category: "Intuição",
  },
]

// Categorias para filtrar as pedras
const categories = [
  "Todas",
  "Amor",
  "Proteção",
  "Prosperidade",
  "Sabedoria",
  "Comunicação",
  "Clareza",
  "Intuição",
  "Força",
]

export default function ExpandedMysticCabinet() {
  const [selectedStones, setSelectedStones] = useState<string[]>([])
  const [showInfo, setShowInfo] = useState(false)
  const [currentStone, setCurrentStone] = useState<string | null>(null)
  const [isGeneratingReading, setIsGeneratingReading] = useState(false)
  const [readingResult, setReadingResult] = useState<string | null>(null)
  const [showReadingResult, setShowReadingResult] = useState(false)
  const [cabinetRotation, setCabinetRotation] = useState(0)
  const [activeCategory, setActiveCategory] = useState("Todas")
  const [mandalaParams, setMandalaParams] = useState({})

  // Filtrar pedras por categoria
  const filteredStones =
    activeCategory === "Todas" ? allStones : allStones.filter((stone) => stone.category === activeCategory)

  // Função para selecionar/deselecionar uma pedra
  const toggleStoneSelection = (stoneId: string) => {
    if (selectedStones.includes(stoneId)) {
      setSelectedStones(selectedStones.filter((id) => id !== stoneId))
    } else {
      setSelectedStones([...selectedStones, stoneId])
    }
  }

  // Função para mostrar informações da pedra
  const showStoneInfo = (stoneId: string) => {
    setCurrentStone(stoneId)
    setShowInfo(true)
  }

  // Função para girar o armário
  const rotateCabinet = () => {
    setCabinetRotation(cabinetRotation + 90)
  }

  // Função para gerar uma leitura baseada nas pedras selecionadas
  const generateReading = async () => {
    if (selectedStones.length === 0) return

    setIsGeneratingReading(true)

    // Simulando o tempo de geração da leitura
    setTimeout(() => {
      // Gerar parâmetros para a mandala baseados nas pedras selecionadas
      const colors = selectedStones.map((id) => {
        const stone = allStones.find((s) => s.id === id)
        return stone ? stone.color : "#FFFFFF"
      })

      // Determinar símbolos baseados nas categorias das pedras selecionadas
      const categories = selectedStones.map((id) => {
        const stone = allStones.find((s) => s.id === id)
        return stone ? stone.category : ""
      })

      const symbols = []
      if (categories.includes("Amor")) symbols.push("flor")
      if (categories.includes("Proteção")) symbols.push("estrela")
      if (categories.includes("Sabedoria")) symbols.push("olho")
      if (categories.includes("Comunicação")) symbols.push("espiral")
      if (categories.includes("Intuição")) symbols.push("lua")
      if (categories.includes("Força")) symbols.push("triângulo")
      if (categories.includes("Clareza")) symbols.push("círculo")
      if (categories.includes("Prosperidade")) symbols.push("hexágono")

      // Determinar a forma baseada na categoria mais comum
      const categoryCounts: Record<string, number> = {}
      categories.forEach((category) => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      })

      let dominantCategory = "Amor"
      let maxCount = 0

      Object.entries(categoryCounts).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count
          dominantCategory = category
        }
      })

      let shape = "circle"
      if (dominantCategory === "Amor") shape = "flower"
      if (dominantCategory === "Proteção") shape = "triangle"
      if (dominantCategory === "Força") shape = "square"
      if (dominantCategory === "Sabedoria") shape = "star"

      setMandalaParams({
        colors,
        complexity: Math.min(10, selectedStones.length + 5),
        layers: Math.min(12, Math.max(3, selectedStones.length)),
        shape,
        symbols: symbols.length > 0 ? symbols : ["estrela", "espiral", "lua", "flor", "olho"],
        rotationSpeed: 1,
        highQuality: selectedStones.length > 5,
      })

      // Gerar a leitura
      const stoneNames = selectedStones
        .map((id) => {
          const stone = allStones.find((s) => s.id === id)
          return stone ? stone.name : "Pedra desconhecida"
        })
        .join(", ")

      const reading = `
        <h3>O Espírito da Caixa se Manifesta</h3>
        
        <p>As pedras falam quando os discípulos silenciam. Através da disposição mística de ${stoneNames}, revela-se a verdade interior que habita em seu ser.</p>
        
        <h4>Percepção Interior Atual</h4>
        <p>Você se encontra em um momento de transição energética. As pedras revelam um padrão de busca por equilíbrio entre o material e o espiritual. A presença dominante dos cristais sugere uma necessidade de clareza mental e emocional para avançar em seu caminho.</p>
        
        <h4>Bloqueios Energéticos Ocultos</h4>
        <p>As sombras projetadas pelas pedras indicam resistências internas relacionadas à aceitação de mudanças. Há um temor oculto de abandonar zonas de conforto que, paradoxalmente, já não nutrem seu crescimento. A disposição das pedras revela padrões de pensamento circulares que impedem o fluxo natural de sua energia vital.</p>
        
        <h4>Caminhos para Expansão do ECI</h4>
        <p>O caminho se ilumina através da integração consciente das energias representadas por cada cristal presente. A combinação única dessas vibrações sugere um processo de transmutação interior, onde o que antes era percebido como obstáculo se transforma em catalisador de crescimento. Permita-se fluir com as correntes energéticas que as pedras manifestam, encontrando harmonia na aparente contradição.</p>
        
        <p>Que pergunta seu coração faz quando confrontado com o silêncio das pedras que falam?</p>
      `

      setReadingResult(reading)
      setShowReadingResult(true)
      setIsGeneratingReading(false)
    }, 3000)
  }

  // Organizar as pedras em prateleiras (5-6 pedras por prateleira)
  const shelves = []
  const stonesPerShelf = 6
  for (let i = 0; i < filteredStones.length; i += stonesPerShelf) {
    shelves.push(filteredStones.slice(i, i + stonesPerShelf))
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Filtros de categoria */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={activeCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Contador de pedras selecionadas */}
      <div className="text-center mb-4">
        <p className="text-gray-300">
          {selectedStones.length} pedras selecionadas de {allStones.length} disponíveis
        </p>
      </div>

      {/* Armário de cristais */}
      <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto mb-8">
        <motion.div
          className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700/50"
          animate={{ rotateY: cabinetRotation }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Fundo do armário com textura */}
          <div className="absolute inset-0 bg-[url('/images/wood-texture.png')] opacity-20"></div>

          {/* Efeito de iluminação */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-purple-500/10"></div>

          {/* Estrutura do armário */}
          <div className="absolute inset-0 p-4 overflow-y-auto">
            <div className="h-full flex flex-col justify-between">
              {shelves.map((shelf, shelfIndex) => (
                <div
                  key={shelfIndex}
                  className="relative min-h-[100px] w-full border-b border-gray-300/10 flex items-center justify-around mb-4"
                >
                  {/* Prateleira */}
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>

                  {/* Pedras na prateleira */}
                  <div className="flex flex-wrap justify-center gap-4 w-full py-2">
                    {shelf.map((stone) => (
                      <motion.div
                        key={stone.id}
                        className="relative cursor-pointer group"
                        whileHover={{ scale: 1.1, y: -5 }}
                      >
                        <div
                          className={`relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden transition-all duration-300 ${
                            selectedStones.includes(stone.id)
                              ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900"
                              : ""
                          }`}
                          onClick={() => toggleStoneSelection(stone.id)}
                          style={{
                            backgroundColor: stone.color + "20",
                            boxShadow: `0 0 15px ${stone.color}40`,
                          }}
                        >
                          <Image
                            src={stone.image || "/placeholder.svg"}
                            alt={stone.name}
                            fill
                            className="object-contain p-1"
                          />

                          {/* Efeito de brilho nas pedras selecionadas */}
                          {selectedStones.includes(stone.id) && (
                            <div className="absolute inset-0 bg-white/10 rounded-md animate-pulse"></div>
                          )}

                          {/* Ícone de seleção */}
                          {selectedStones.includes(stone.id) && (
                            <div className="absolute top-1 right-1 bg-purple-600 rounded-full w-5 h-5 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Botão de informação */}
                        <button
                          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700 z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            showStoneInfo(stone.id)
                          }}
                        >
                          <Info className="w-3 h-3 text-gray-300" />
                        </button>

                        {/* Nome da pedra */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap transition-opacity z-20">
                          {stone.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reflexos e sombras */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>

          {/* Efeito de vidro */}
          <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>

          {/* Bordas iluminadas */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"></div>
        </motion.div>

        {/* Botão para girar o armário */}
        <button
          onClick={rotateCabinet}
          className="absolute bottom-4 right-4 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
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

      {/* Modal de informações da pedra */}
      {showInfo && currentStone && (
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
              const stone = allStones.find((s) => s.id === currentStone)
              if (!stone) return null

              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-md relative overflow-hidden"
                        style={{
                          backgroundColor: stone.color + "20",
                          boxShadow: `0 0 15px ${stone.color}40`,
                        }}
                      >
                        <Image
                          src={stone.image || "/placeholder.svg"}
                          alt={stone.name}
                          fill
                          className="object-contain p-1"
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
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Categoria</h4>
                    <p className="text-white">{stone.category}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Propriedades</h4>
                    <p className="text-white">
                      {stone.category === "Amor" &&
                        "Promove o amor incondicional, cura emocional e relacionamentos harmoniosos."}
                      {stone.category === "Proteção" &&
                        "Oferece proteção energética, afasta energias negativas e fortalece o campo áurico."}
                      {stone.category === "Prosperidade" &&
                        "Atrai abundância, sucesso financeiro e oportunidades de crescimento."}
                      {stone.category === "Sabedoria" &&
                        "Estimula a sabedoria interior, clareza mental e discernimento."}
                      {stone.category === "Comunicação" &&
                        "Facilita a comunicação clara, expressão autêntica e conexões interpessoais."}
                      {stone.category === "Clareza" && "Promove clareza mental, foco e organização de pensamentos."}
                      {stone.category === "Intuição" &&
                        "Desperta a intuição, percepção extrassensorial e conexão com o eu superior."}
                      {stone.category === "Força" && "Fortalece a determinação, coragem e resistência emocional."}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Como Usar</h4>
                    <p className="text-white">
                      Esta pedra pode ser utilizada em meditações, colocada em ambientes para harmonização energética,
                      ou carregada junto ao corpo para absorver suas propriedades vibratórias.
                    </p>
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

      {/* Modal de resultado da leitura */}
      {showReadingResult && readingResult && (
        <ReadingResult
          reading={readingResult}
          mandalaParams={mandalaParams}
          onClose={() => setShowReadingResult(false)}
        />
      )}
    </div>
  )
}
