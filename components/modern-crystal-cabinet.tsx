"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"
import Link from "next/link"

// Definição das pedras com suas propriedades
const crystalData = [
  {
    id: 1,
    name: "Quartzo Rosa",
    keywords: "Amor, Cura Emocional, Paz, Compaixão",
    description: "A pedra do amor incondicional e da paz infinita.",
    color: "#F4C2C2",
    image: "/rose-quartz-crystal.png",
  },
  {
    id: 2,
    name: "Ametista",
    keywords: "Espiritualidade, Calma, Proteção, Transmutação",
    description: "Uma pedra poderosa e protetora com alta vibração espiritual.",
    color: "#9966CC",
    image: "/amethyst-crystal.png",
  },
  {
    id: 3,
    name: "Citrino",
    keywords: "Prosperidade, Alegria, Sucesso, Energia Solar",
    description: "Conhecido como a pedra da abundância e prosperidade.",
    color: "#FFD700",
    image: "/citrine-crystal.png",
  },
  {
    id: 4,
    name: "Água Marinha",
    keywords: "Calma, Clareza, Comunicação, Coragem",
    description: "Com uma energia calmante, reduz o stress e tranquiliza a mente.",
    color: "#ADD8E6",
    image: "/aquamarine-crystal.png",
  },
  {
    id: 5,
    name: "Jade",
    keywords: "Serenidade, Sorte, Harmonia, Sabedoria",
    description: "Símbolo de serenidade, pureza e sabedoria.",
    color: "#00A86B",
    image: "/jade-crystal.png",
  },
  {
    id: 6,
    name: "Olho de Tigre",
    keywords: "Proteção, Clareza Mental, Coragem, Equilíbrio",
    description: "Uma pedra protetora tradicionalmente usada como talismã.",
    color: "#B8860B",
    image: "/tigers-eye-crystal.png",
  },
  {
    id: 7,
    name: "Fluorita",
    keywords: "Proteção Psíquica, Clareza Mental, Organização",
    description: "Uma pedra de grande proteção, especialmente contra influências externas.",
    color: "#9966CC",
    image: "/fluorite-crystal.png",
  },
  {
    id: 8,
    name: "Cristal de Quartzo",
    keywords: "Amplificação, Clareza, Cura Universal, Energia",
    description: "Considerado o 'mestre curador', é altamente energético e versátil.",
    color: "#F5F5F5",
    image: "/clear-quartz-crystal.png",
  },
  {
    id: 9,
    name: "Esmeralda",
    keywords: "Amor Bem-Sucedido, Inspiração, Abundância",
    description: "Conhecida como a 'pedra do amor bem-sucedido'.",
    color: "#50C878",
    image: "/emerald-crystal.png",
  },
  {
    id: 10,
    name: "Granada",
    keywords: "Paixão, Vitalidade, Coragem, Regeneração",
    description: "Irradia paixão, vitalidade e energia.",
    color: "#7B1113",
    image: "/garnet-crystal.png",
  },
  {
    id: 11,
    name: "Hematita",
    keywords: "Aterramento, Proteção, Força de Vontade, Foco",
    description: "Perfeita para aterramento e proteção.",
    color: "#2C3539",
    image: "/hematite-crystal.png",
  },
  {
    id: 12,
    name: "Lápis-Lazúli",
    keywords: "Sabedoria, Verdade, Intuição, Paz Interior",
    description: "Abre o terceiro olho e equilibra o chakra da garganta.",
    color: "#26619C",
    image: "/lapis-lazuli-crystal.png",
  },
]

export default function ModernCrystalCabinet() {
  const [selectedCrystal, setSelectedCrystal] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [rotationAngle, setRotationAngle] = useState(0)

  // Função para girar o gabinete
  const rotateCabinet = () => {
    setIsRotating(true)
    setRotationAngle((prev) => prev + 90)
    setTimeout(() => {
      setIsRotating(false)
    }, 1000)
  }

  // Função para mostrar informações da pedra
  const handleCrystalClick = (id: number) => {
    setSelectedCrystal(id)
    setShowInfo(true)
  }

  // Função para fechar o modal de informações
  const closeInfo = () => {
    setShowInfo(false)
    setSelectedCrystal(null)
  }

  // Organiza os cristais em prateleiras (3 cristais por prateleira, 4 prateleiras)
  const shelves = Array.from({ length: 4 }, (_, i) => crystalData.slice(i * 3, (i + 1) * 3))

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Gabinete moderno de cristais */}
      <motion.div
        className="relative w-full aspect-square max-w-md mx-auto"
        animate={{ rotateY: rotationAngle }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Faces do gabinete */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-gray-100/5 backdrop-blur-sm border border-gray-300/20 rounded-lg overflow-hidden"
            style={{
              transform: `rotateY(${index * 90}deg) translateZ(${Math.min(200, window.innerWidth * 0.2)}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            {/* Efeito de iluminação LED */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"></div>

            {/* Efeito de vidro */}
            <div className="absolute inset-0 bg-white/5"></div>

            {/* Estrutura do gabinete */}
            <div className="absolute inset-0 p-4">
              <div className="h-full flex flex-col justify-between">
                {shelves.map((shelf, shelfIndex) => (
                  <div
                    key={shelfIndex}
                    className="relative h-[22%] w-full border-b border-gray-300/10 flex items-center justify-around"
                  >
                    {/* Prateleira */}
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>

                    {/* Cristais na prateleira */}
                    {shelf.map((crystal) => (
                      <motion.div
                        key={crystal.id}
                        className="relative cursor-pointer group"
                        whileHover={{ scale: 1.1, y: -5 }}
                        onClick={() => handleCrystalClick(crystal.id)}
                      >
                        <div
                          className="w-16 h-16 md:w-20 md:h-20 rounded-md relative overflow-hidden"
                          style={{
                            backgroundColor: crystal.color,
                            boxShadow: `0 0 15px ${crystal.color}40`,
                          }}
                        >
                          <Image
                            src={crystal.image || "/placeholder.svg"}
                            alt={crystal.name}
                            fill
                            className="object-cover mix-blend-overlay"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50"></div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap transition-opacity">
                          {crystal.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Sobreposição de reflexo */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          </div>
        ))}

        {/* Base do gabinete */}
        <div className="absolute -bottom-4 inset-x-0 h-4 bg-gradient-to-b from-gray-400/30 to-gray-600/30 rounded-b-lg"></div>

        {/* Efeito de brilho */}
        <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-xl"></div>
      </motion.div>

      {/* Botão para girar o gabinete */}
      <Button
        onClick={rotateCabinet}
        disabled={isRotating}
        className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Girar Gabinete
      </Button>

      {/* Botão para iniciar jornada */}
      <Link href="/caixa-virtual">
        <Button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          Iniciar Jornada
        </Button>
      </Link>

      {/* Modal de informações do cristal */}
      {showInfo && selectedCrystal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeInfo}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full"
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
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-white">{crystal.name}</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={closeInfo} className="text-gray-400 hover:text-white">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Palavras-Chave</h4>
                    <p className="text-white">{crystal.keywords}</p>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Descrição</h4>
                    <p className="text-white">{crystal.description}</p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={closeInfo}
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

      {/* Estilo para animação */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(0) translateX(10px);
          }
          75% {
            transform: translateY(10px) translateX(5px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
