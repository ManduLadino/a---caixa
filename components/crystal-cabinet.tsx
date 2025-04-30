"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { GlowText } from "@/components/ui/glow-text"

// Definição das pedras com suas propriedades
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
    image: "/placeholder.svg?height=100&width=100&query=blue+kyanite+crystal",
  },
  {
    id: 12,
    name: "Cianita Negra",
    keywords: "Limpeza Energética, Proteção, Aterramento, Alinhamento",
    description: "Conhecida como 'Vassoura de Bruxa', é uma ferramenta poderosa para limpeza energética profunda.",
    color: "#2F4F4F",
    image: "/placeholder.svg?height=100&width=100&query=black+kyanite+crystal",
  },
  {
    id: 13,
    name: "Citrino",
    keywords: "Prosperidade, Alegria, Sucesso, Energia Solar",
    description: "Conhecido como a pedra da abundância e prosperidade, ensina a manifestar e atrair riqueza.",
    color: "#FFD700",
    image: "/placeholder.svg?height=100&width=100&query=citrine+crystal",
  },
  {
    id: 14,
    name: "Cornalina",
    keywords: "Vitalidade, Coragem, Criatividade, Motivação",
    description: "Repleta de energia vital, promove coragem, criatividade e motivação.",
    color: "#B22222",
    image: "/placeholder.svg?height=100&width=100&query=carnelian+crystal",
  },
  {
    id: 15,
    name: "Crisoprásio",
    keywords: "Verdade, Esperança, Compaixão, Criatividade",
    description:
      "Promove o amor pela verdade, a esperança e o autoconhecimento, induzindo a estados meditativos profundos.",
    color: "#00A86B",
    image: "/placeholder.svg?height=100&width=100&query=chrysoprase+crystal",
  },
  {
    id: 16,
    name: "Cristal de Rocha",
    keywords: "Amplificação, Clareza, Cura Universal, Energia",
    description:
      "Considerado o 'mestre curador', é altamente energético e versátil, amplificando a energia e a intenção.",
    color: "#F5F5F5",
    image: "/placeholder.svg?height=100&width=100&query=clear+quartz+crystal",
  },
  {
    id: 17,
    name: "Esmeralda",
    keywords: "Amor Bem-Sucedido, Inspiração, Abundância, Equilíbrio",
    description:
      "Conhecida como a 'pedra do amor bem-sucedido', promove a felicidade doméstica e o amor incondicional.",
    color: "#50C878",
    image: "/placeholder.svg?height=100&width=100&query=emerald+crystal",
  },
  {
    id: 18,
    name: "Fluorita",
    keywords: "Proteção Psíquica, Clareza Mental, Organização, Aprendizado",
    description: "Uma pedra de grande proteção, especialmente contra influências externas e manipulação psíquica.",
    color: "#9966CC",
    image: "/placeholder.svg?height=100&width=100&query=fluorite+crystal",
  },
  {
    id: 19,
    name: "Granada",
    keywords: "Paixão, Vitalidade, Coragem, Regeneração",
    description: "Irradia paixão, vitalidade e energia. Fortalece a determinação, a coragem e a esperança.",
    color: "#7B1113",
    image: "/placeholder.svg?height=100&width=100&query=garnet+crystal",
  },
  {
    id: 20,
    name: "Hematita",
    keywords: "Aterramento, Proteção, Força de Vontade, Foco",
    description: "Perfeita para aterramento e proteção, harmoniza corpo, mente e espírito.",
    color: "#2C3539",
    image: "/placeholder.svg?height=100&width=100&query=hematite+crystal",
  },
  {
    id: 21,
    name: "Howlita Branca",
    keywords: "Calma, Paciência, Sono Tranquilo, Conhecimento",
    description: "Uma pedra extremamente calmante, excelente para combater a insônia e acalmar a mente hiperativa.",
    color: "#F5F5F5",
    image: "/placeholder.svg?height=100&width=100&query=white+howlite+crystal",
  },
  {
    id: 22,
    name: "Jade",
    keywords: "Serenidade, Sorte, Harmonia, Sabedoria",
    description: "Símbolo de serenidade, pureza e sabedoria. É uma pedra protetora que traz harmonia.",
    color: "#00A86B",
    image: "/placeholder.svg?height=100&width=100&query=jade+crystal",
  },
  {
    id: 23,
    name: "Jaspe Vermelho",
    keywords: "Estabilidade, Força, Proteção, Vitalidade",
    description:
      "Uma pedra de estabilidade, força e vitalidade. Oferece um aterramento suave e auxilia em momentos difíceis.",
    color: "#B22222",
    image: "/placeholder.svg?height=100&width=100&query=red+jasper+crystal",
  },
  {
    id: 24,
    name: "Labradorita",
    keywords: "Proteção Mística, Intuição, Transformação, Consciência",
    description:
      "Uma pedra mística e protetora, portadora de luz. Eleva a consciência e conecta com as energias universais.",
    color: "#6C7A89",
    image: "/placeholder.svg?height=100&width=100&query=labradorite+crystal",
  },
  {
    id: 25,
    name: "Lápis-Lazúli",
    keywords: "Sabedoria, Verdade, Intuição, Paz Interior",
    description:
      "Abre o terceiro olho e equilibra o chakra da garganta. É uma pedra protetora que facilita o contato espiritual.",
    color: "#26619C",
    image: "/placeholder.svg?height=100&width=100&query=lapis+lazuli+crystal",
  },
  {
    id: 26,
    name: "Malaquita",
    keywords: "Transformação, Cura Emocional, Proteção, Manifestação",
    description:
      "Uma poderosa pedra de transformação e cura profunda. Amplifica energias e aterra energias espirituais.",
    color: "#004D40",
    image: "/placeholder.svg?height=100&width=100&query=malachite+crystal",
  },
  {
    id: 27,
    name: "Obsidiana Floco de Neve",
    keywords: "Equilíbrio, Purificação, Centramento, Reconhecimento de Padrões",
    description:
      "Proporciona equilíbrio entre corpo, mente e espírito. Ajuda a reconhecer e liberar padrões de pensamento equivocados.",
    color: "#2F4F4F",
    image: "/placeholder.svg?height=100&width=100&query=snowflake+obsidian+crystal",
  },
  {
    id: 28,
    name: "Olho de Tigre",
    keywords: "Proteção, Clareza Mental, Coragem, Equilíbrio",
    description: "Uma pedra protetora tradicionalmente usada como talismã contra maldições e mau-olhado.",
    color: "#B8860B",
    image: "/placeholder.svg?height=100&width=100&query=tigers+eye+crystal",
  },
  {
    id: 29,
    name: "Ônix",
    keywords: "Força, Proteção, Autocontrole, Estabilidade",
    description: "Confere força e apoio em circunstâncias difíceis ou confusas e durante períodos de grande stress.",
    color: "#0A0A0A",
    image: "/placeholder.svg?height=100&width=100&query=onyx+crystal",
  },
  {
    id: 30,
    name: "Pedra da Lua",
    keywords: "Novos Começos, Intuição, Emoções, Energia Feminina",
    description: "Conhecida como a 'pedra de novos começos', tem forte ligação com a Lua e a intuição.",
    color: "#F5F5F5",
    image: "/placeholder.svg?height=100&width=100&query=moonstone+crystal",
  },
  {
    id: 31,
    name: "Pedra do Sol",
    keywords: "Alegria de Viver, Vitalidade, Otimismo, Boa Sorte",
    description:
      "Uma pedra vibrante e inspiradora que instila a alegria de viver e a boa natureza, intensificando a intuição.",
    color: "#E67E22",
    image: "/placeholder.svg?height=100&width=100&query=sunstone+crystal",
  },
  {
    id: 32,
    name: "Pirita",
    keywords: "Prosperidade, Proteção, Sucesso, Abundância",
    description: "Um excelente escudo energético que bloqueia energias negativas e poluentes em todos os níveis.",
    color: "#CFB53B",
    image: "/placeholder.svg?height=100&width=100&query=pyrite+crystal",
  },
  {
    id: 33,
    name: "Quartzo Fumê",
    keywords: "Aterramento, Proteção, Dissipação de Negatividade, Calma",
    description:
      "Uma das pedras mais eficientes para aterrar e ancorar energias, ao mesmo tempo que eleva as vibrações.",
    color: "#2F4F4F",
    image: "/placeholder.svg?height=100&width=100&query=smoky+quartz+crystal",
  },
  {
    id: 34,
    name: "Quartzo Rosa",
    keywords: "Amor Incondicional, Cura Emocional, Paz, Compaixão",
    description: "A pedra do amor incondicional e da paz infinita. É o cristal mais importante para o coração.",
    color: "#F4C2C2",
    image: "/placeholder.svg?height=100&width=100&query=rose+quartz+crystal",
  },
  {
    id: 35,
    name: "Quartzo Verde",
    keywords: "Saúde, Cura, Vitalidade, Equilíbrio Emocional",
    description: "Considerada uma pedra de cura, vitalidade e energização. Transmite a energia curativa do Raio Verde.",
    color: "#00A86B",
    image: "/placeholder.svg?height=100&width=100&query=green+aventurine+crystal",
  },
  {
    id: 36,
    name: "Rodocrosita",
    keywords: "Amor Altruísta, Compaixão, Cura Emocional, Autoestima",
    description:
      "Representa o amor altruísta e a compaixão. Expande a consciência e integra as energias espirituais e materiais.",
    color: "#E77471",
    image: "/placeholder.svg?height=100&width=100&query=rhodochrosite+crystal",
  },
  {
    id: 37,
    name: "Rodonita",
    keywords: "Equilíbrio Emocional, Cura de Traumas, Amor Fraterno, Perdão",
    description: "Um equilibrador emocional que inspira o amor e estimula a fraternidade entre os seres humanos.",
    color: "#E77471",
    image: "/placeholder.svg?height=100&width=100&query=rhodonite+crystal",
  },
  {
    id: 38,
    name: "Selenita Branca",
    keywords: "Purificação, Paz Profunda, Conexão Espiritual, Limpeza Energética",
    description: "Possui uma vibração muito fina e é considerada uma das pedras de purificação mais poderosas.",
    color: "#F5F5F5",
    image: "/placeholder.svg?height=100&width=100&query=white+selenite+crystal",
  },
  {
    id: 39,
    name: "Sodalita",
    keywords: "Lógica, Intuição, Comunicação, Clareza Mental",
    description: "Une lógica e intuição, abrindo a percepção espiritual e estimulando o terceiro olho.",
    color: "#4682B4",
    image: "/placeholder.svg?height=100&width=100&query=sodalite+crystal",
  },
  {
    id: 40,
    name: "Turmalina Negra",
    keywords: "Proteção Suprema, Aterramento, Limpeza Energética, Neutralização",
    description: "Considerada a pedra de proteção mais completa contra energias negativas e ataques psíquicos.",
    color: "#2C3539",
    image: "/placeholder.svg?height=100&width=100&query=black+tourmaline+crystal",
  },
  {
    id: 41,
    name: "Turquesa",
    keywords: "Proteção, Boa Sorte, Comunicação, Bem-Estar",
    description: "Uma pedra de proteção muito eficiente, usada como amuleto desde tempos remotos.",
    color: "#40E0D0",
    image: "/placeholder.svg?height=100&width=100&query=turquoise+crystal",
  },
  {
    id: 42,
    name: "Unakita",
    keywords: "Visão Interior, Equilíbrio, Renascimento, Cura de Vidas Passadas",
    description: "Uma pedra de visão e equilíbrio. Ancora energias quando necessário e pode ser útil após meditação.",
    color: "#8B4513",
    image: "/placeholder.svg?height=100&width=100&query=unakite+crystal",
  },
  {
    id: 43,
    name: "Zoisita com Rubi",
    keywords: "Vitalidade, Cura, Individualidade, Conexão com a Natureza",
    description:
      "Promove a vitalidade e a cura, fortalecendo o sistema imunológico e estimulando a regeneração celular.",
    color: "#006400",
    image: "/placeholder.svg?height=100&width=100&query=ruby+zoisite+crystal",
  },
  {
    id: 44,
    name: "Ágata Roxa",
    keywords: "Estabilidade, Coragem, Espiritualidade, Justiça",
    description:
      "Traz estabilidade, coragem, segurança e sorte. Em algumas tradições, é considerada um antídoto para venenos.",
    color: "#800080",
    image: "/placeholder.svg?height=100&width=100&query=purple+agate+crystal",
  },
]

// Componente para o armário de cristais
export default function CrystalCabinet() {
  const [doorsOpen, setDoorsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedCrystal, setSelectedCrystal] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const cabinetRef = useRef<HTMLDivElement>(null)
  const [cabinetHeight, setCabinetHeight] = useState(0)
  // Vamos modificar o componente para simplificar e focar apenas no armário com prateleiras e gaveta
  // Também vamos adicionar a funcionalidade de mover as pedras para a gaveta

  // Modificar o estado para incluir pedras na gaveta
  const [stonesInDrawer, setStoriesInDrawer] = useState<number[]>([])

  // Atualiza a altura do armário quando o componente é montado
  useEffect(() => {
    if (cabinetRef.current) {
      setCabinetHeight(cabinetRef.current.offsetHeight)
    }
  }, [])

  // Função para abrir/fechar as portas
  const toggleDoors = () => {
    setDoorsOpen(!doorsOpen)
    if (drawerOpen) setDrawerOpen(false)
  }

  // Função para abrir/fechar a gaveta
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
    if (doorsOpen) setDoorsOpen(false)
  }

  // Modificar a função handleCrystalClick para permitir mover pedras para a gaveta
  const handleCrystalClick = (id: number) => {
    if (drawerOpen) {
      // Se a gaveta estiver aberta, adiciona ou remove a pedra da gaveta
      if (stonesInDrawer.includes(id)) {
        setStoriesInDrawer(stonesInDrawer.filter((stoneId) => stoneId !== id))
      } else {
        setStoriesInDrawer([...stonesInDrawer, id])
      }
    } else {
      // Se a gaveta estiver fechada, mostra informações da pedra
      setSelectedCrystal(id)
      setShowInfo(true)
    }
  }

  const closeInfo = () => {
    setShowInfo(false)
    setSelectedCrystal(null)
  }

  // Organiza os cristais em prateleiras (11 cristais por prateleira, 4 prateleiras)
  const shelves = Array.from({ length: 4 }, (_, i) => crystalData.slice(i * 11, (i + 1) * 11))

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[90vh] flex flex-col items-center justify-center">
      {/* Título do armário */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">
          <GlowText glowColor="#c774f0">🔮 A CAIXA</GlowText>
        </h1>
        <p className="text-xl text-gray-300">Armário Místico de Cristais</p>
      </div>

      {/* Armário principal */}
      <div
        ref={cabinetRef}
        className="relative w-full max-w-5xl h-[70vh] bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border-8"
        style={{
          borderImage: "linear-gradient(45deg, #d4af37, #ffd700, #d4af37) 1",
          boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
        }}
      >
        {/* Portas de vidro do armário */}
        <div className="absolute inset-0 flex">
          {/* Porta esquerda */}
          <motion.div
            className="w-1/2 h-full bg-blue-50/10 backdrop-blur-sm border-r-4"
            style={{
              borderImage: "linear-gradient(to bottom, #d4af37, #ffd700, #d4af37) 1",
              transformOrigin: "left",
              boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.3)",
            }}
            animate={{
              rotateY: doorsOpen ? -105 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-[#d4af37] via-[#ffd700] to-[#d4af37] rounded-full" />
          </motion.div>

          {/* Porta direita */}
          <motion.div
            className="w-1/2 h-full bg-blue-50/10 backdrop-blur-sm border-l-4"
            style={{
              borderImage: "linear-gradient(to bottom, #d4af37, #ffd700, #d4af37) 1",
              transformOrigin: "right",
              boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.3)",
            }}
            animate={{
              rotateY: doorsOpen ? 105 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-[#d4af37] via-[#ffd700] to-[#d4af37] rounded-full" />
          </motion.div>
        </div>

        {/* Interior do armário com prateleiras */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {shelves.map((shelf, shelfIndex) => (
            <div key={shelfIndex} className="flex justify-around items-center h-1/4 relative">
              {/* Prateleira */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#d4af37] bottom-0" />

              {/* Cristais na prateleira */}
              <div className="flex justify-around w-full">
                {shelf.map((crystal) => (
                  <motion.div
                    key={crystal.id}
                    className="relative cursor-pointer group"
                    whileHover={{ scale: 1.1, y: -5 }}
                    onClick={() => handleCrystalClick(crystal.id)}
                  >
                    <div
                      className="w-16 h-16 rounded-md relative overflow-hidden"
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
                    <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap transition-opacity">
                      {crystal.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Gaveta inferior (A CAIXA) */}
        <motion.div
          className="absolute bottom-0 inset-x-0 h-1/5 bg-gradient-to-b from-[#d4af37]/20 to-[#d4af37]/40 backdrop-blur-sm border-t-4 flex items-center justify-center"
          style={{
            borderImage: "linear-gradient(to right, #d4af37, #ffd700, #d4af37) 1",
            boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.3)",
          }}
          animate={{
            y: drawerOpen ? cabinetHeight * 0.2 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#d4af37] rounded-full" />
          <h2 className="text-2xl font-bold text-white">
            <GlowText glowColor="#ffd700">A CAIXA</GlowText>
          </h2>
        </motion.div>

        {/* Conteúdo da gaveta quando aberta (A CAIXA) */}
        <motion.div
          className="absolute top-full inset-x-0 h-[20vh] bg-gradient-to-b from-[#d4af37]/30 to-[#d4af37]/60 backdrop-blur-md border-4 rounded-b-lg flex items-center justify-center overflow-hidden"
          style={{
            borderImage: "linear-gradient(45deg, #d4af37, #ffd700, #d4af37) 1",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)",
          }}
          initial={{ y: 0 }}
          animate={{
            y: drawerOpen ? -cabinetHeight * 0.2 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Interior da CAIXA */}
          <div className="relative w-full h-full p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-4 relative z-10">A CAIXA</h3>

            {stonesInDrawer.length === 0 ? (
              <p className="text-center text-white/80 max-w-md relative z-10">
                Selecione pedras das prateleiras enquanto a gaveta estiver aberta para colocá-las aqui.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center max-w-md relative z-10">
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
                        className="w-12 h-12 rounded-md relative overflow-hidden"
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
                    </motion.div>
                  )
                })}
              </div>
            )}

            <div className="mt-4 text-center text-white/80 text-sm relative z-10">
              {stonesInDrawer.length > 0 && <p>Clique nas pedras para removê-las da CAIXA</p>}
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 via-transparent to-[#ffd700]/10 animate-pulse-slow" />
          </div>
        </motion.div>
      </div>

      {/* Botões de controle */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={toggleDoors}
          className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black hover:from-[#ffd700] hover:to-[#d4af37]"
        >
          {doorsOpen ? "Fechar Armário" : "Abrir Armário"}
        </Button>
        <Button
          onClick={toggleDrawer}
          className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black hover:from-[#ffd700] hover:to-[#d4af37]"
        >
          {drawerOpen ? "Fechar A CAIXA" : "Abrir A CAIXA"}
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-white/80">
        {drawerOpen ? (
          <p>Clique nas pedras nas prateleiras para adicioná-las à CAIXA</p>
        ) : (
          <p>Abra o armário para ver as pedras. Abra A CAIXA para selecionar pedras.</p>
        )}
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
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-[#d4af37]/50 rounded-lg p-6 max-w-md w-full"
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
                        <h3 className="text-2xl font-bold text-white">{crystal.name}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeInfo}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Palavras-Chave</h4>
                      <p className="text-white">{crystal.keywords}</p>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Perfil Místico</h4>
                      <p className="text-white">{crystal.description}</p>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black hover:from-[#ffd700] hover:to-[#d4af37]"
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

      {/* Estilo para animação de partículas */}
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
        
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
