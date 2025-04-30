"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { GlowText } from "@/components/ui/glow-text"
import { X, Sparkles, Download } from "lucide-react"

// Definição das pedras com propriedades positivas
const pedrasMisticas = [
  {
    id: 1,
    nome: "Quartzo Rosa",
    cor: "#F4C2C2",
    imagem: "/images/pedras/quartzo-rosa.png",
    descricao: "A pedra do amor universal e da paz infinita.",
    propriedades: "Promove amor incondicional, cura emocional, paz interior e compaixão.",
    origem: "Brasil, Madagascar e Índia",
    usos: "Meditação para abrir o chakra do coração, ambientes que precisam de harmonia e amor.",
  },
  {
    id: 2,
    nome: "Ametista",
    cor: "#9966CC",
    imagem: "/images/pedras/ametista.png",
    descricao: "Pedra da tranquilidade e sabedoria espiritual.",
    propriedades: "Traz calma, clareza mental, proteção e elevação espiritual.",
    origem: "Brasil, Uruguai e Zâmbia",
    usos: "Meditação, melhoria do sono, purificação energética de ambientes.",
  },
  {
    id: 3,
    nome: "Citrino",
    cor: "#E4D00A",
    imagem: "/images/pedras/citrino.png",
    descricao: "A pedra da abundância e prosperidade.",
    propriedades: "Atrai prosperidade, alegria, criatividade e energia solar positiva.",
    origem: "Brasil, Bolívia e Espanha",
    usos: "Ambientes de trabalho, meditação para manifestação de abundância.",
  },
  {
    id: 4,
    nome: "Água Marinha",
    cor: "#B0E0E6",
    imagem: "/images/pedras/agua-marinha.png",
    descricao: "Pedra da coragem e comunicação clara.",
    propriedades: "Promove calma, clareza na comunicação, coragem e paz interior.",
    origem: "Brasil, Moçambique e Nigéria",
    usos: "Meditação para comunicação, ambientes que precisam de tranquilidade.",
  },
  {
    id: 5,
    nome: "Jade",
    cor: "#00A86B",
    imagem: "/images/pedras/jade.png",
    descricao: "Símbolo de serenidade e sabedoria.",
    propriedades: "Traz harmonia, equilíbrio, sorte e proteção positiva.",
    origem: "China, Nova Zelândia e Guatemala",
    usos: "Decoração de ambientes, meditação para equilíbrio e sabedoria.",
  },
  {
    id: 6,
    nome: "Olho de Tigre",
    cor: "#B8860B",
    imagem: "/images/pedras/olho-de-tigre.png",
    descricao: "Pedra da proteção e clareza mental.",
    propriedades: "Oferece proteção, foco, determinação e confiança.",
    origem: "África do Sul, Austrália e Índia",
    usos: "Ambientes de trabalho, meditação para foco e clareza.",
  },
  {
    id: 7,
    nome: "Turquesa",
    cor: "#40E0D0",
    imagem: "/images/pedras/turquesa.png",
    descricao: "Pedra da cura e comunicação espiritual.",
    propriedades: "Promove cura, proteção, expressão autêntica e bem-estar.",
    origem: "Estados Unidos, Irã e China",
    usos: "Joias de proteção, ambientes de cura, meditação para expressão.",
  },
  {
    id: 8,
    nome: "Amazonita",
    cor: "#7FFFD4",
    imagem: "/images/pedras/amazonita.png",
    descricao: "Pedra da harmonia e comunicação do coração.",
    propriedades: "Traz harmonia, verdade do coração, esperança e coragem.",
    origem: "Brasil, Rússia e Estados Unidos",
    usos: "Meditação para comunicação do coração, ambientes de trabalho em equipe.",
  },
  {
    id: 9,
    nome: "Sodalita",
    cor: "#4682B4",
    imagem: "/images/pedras/sodalita.png",
    descricao: "Pedra da intuição e conhecimento.",
    propriedades: "Estimula pensamento lógico, intuição, autoconhecimento e verdade.",
    origem: "Brasil, Canadá e Namíbia",
    usos: "Estudos, meditação para clareza mental, ambientes de aprendizado.",
  },
  {
    id: 10,
    nome: "Calcita Laranja",
    cor: "#FFA500",
    imagem: "/images/pedras/calcita-laranja.png",
    descricao: "Pedra da energia e criatividade.",
    propriedades: "Estimula criatividade, energia positiva, alegria e motivação.",
    origem: "México, Brasil e Peru",
    usos: "Espaços criativos, meditação para inspiração, ambientes de convívio.",
  },
  {
    id: 11,
    nome: "Aventurina",
    cor: "#3CB371",
    imagem: "/images/pedras/aventurina.png",
    descricao: "Pedra da oportunidade e prosperidade.",
    propriedades: "Atrai sorte, oportunidades, abundância e bem-estar.",
    origem: "Índia, Brasil e Rússia",
    usos: "Ambientes de trabalho, meditação para prosperidade.",
  },
  {
    id: 12,
    nome: "Fluorita",
    cor: "#9966CC",
    imagem: "/images/pedras/fluorita.png",
    descricao: "Pedra da clareza mental e foco.",
    propriedades: "Promove concentração, organização mental, equilíbrio e intuição.",
    origem: "China, México e Inglaterra",
    usos: "Espaços de estudo, meditação para clareza, ambientes de trabalho.",
  },
  {
    id: 13,
    nome: "Cristal de Quartzo",
    cor: "#F5F5F5",
    imagem: "/images/pedras/cristal-quartzo.png",
    descricao: "O mestre dos cristais, amplificador de energia.",
    propriedades: "Amplifica intenções positivas, clareza, purificação e harmonia.",
    origem: "Brasil, Estados Unidos e Madagascar",
    usos: "Meditação, purificação de ambientes, amplificação de outras pedras.",
  },
  {
    id: 14,
    nome: "Cornalina",
    cor: "#B22222",
    imagem: "/images/pedras/cornalina.png",
    descricao: "Pedra da vitalidade e coragem.",
    propriedades: "Estimula energia vital, motivação, coragem e criatividade.",
    origem: "Brasil, Índia e Uruguai",
    usos: "Meditação para vitalidade, ambientes que precisam de energia.",
  },
  {
    id: 15,
    nome: "Lápis-Lazúli",
    cor: "#26619C",
    imagem: "/images/pedras/lapis-lazuli.png",
    descricao: "Pedra da sabedoria e expressão autêntica.",
    propriedades: "Promove verdade, autoconhecimento, expressão autêntica e sabedoria.",
    origem: "Afeganistão, Chile e Rússia",
    usos: "Meditação para comunicação, ambientes de estudo e aprendizado.",
  },
  {
    id: 16,
    nome: "Pedra da Lua",
    cor: "#F5F5F5",
    imagem: "/images/pedras/pedra-lua.png",
    descricao: "Pedra da intuição e novos começos.",
    propriedades: "Estimula intuição, ciclos positivos, criatividade e equilíbrio emocional.",
    origem: "Sri Lanka, Índia e Madagascar",
    usos: "Meditação para intuição, rituais de lua cheia, ambientes de descanso.",
  },
  {
    id: 17,
    nome: "Topázio",
    cor: "#0D98BA",
    imagem: "/images/pedras/topazio.png",
    descricao: "Pedra da manifestação e abundância.",
    propriedades: "Atrai sucesso, abundância, clareza de propósito e força interior.",
    origem: "Brasil, Rússia e Nigéria",
    usos: "Meditação para manifestação, ambientes de trabalho e estudo.",
  },
  {
    id: 18,
    nome: "Granada",
    cor: "#7B1113",
    imagem: "/images/pedras/granada.png",
    descricao: "Pedra da vitalidade e paixão positiva.",
    propriedades: "Estimula energia vital, paixão criativa, coragem e determinação.",
    origem: "Índia, África do Sul e Estados Unidos",
    usos: "Meditação para vitalidade, ambientes que precisam de energia renovada.",
  },
  {
    id: 19,
    nome: "Crisocola",
    cor: "#4682B4",
    imagem: "/images/pedras/crisocola.png",
    descricao: "Pedra da comunicação e expressão pacífica.",
    propriedades: "Promove comunicação clara, tranquilidade, expressão e sabedoria.",
    origem: "Chile, Peru e Estados Unidos",
    usos: "Meditação para comunicação, ambientes de diálogo e ensino.",
  },
  {
    id: 20,
    nome: "Ágata Azul",
    cor: "#4682B4",
    imagem: "/images/pedras/agata-azul.png",
    descricao: "Pedra da paz e comunicação.",
    propriedades: "Traz calma, comunicação clara, paz interior e harmonia.",
    origem: "Brasil, Uruguai e México",
    usos: "Meditação para tranquilidade, ambientes que precisam de paz.",
  },
  {
    id: 21,
    nome: "Ágata Musgo",
    cor: "#D0F0C0",
    imagem: "/images/pedras/agata-musgo.png",
    descricao: "Pedra da abundância e conexão com a natureza.",
    propriedades: "Promove crescimento, abundância, conexão com a natureza e equilíbrio.",
    origem: "Brasil, Índia e Rússia",
    usos: "Jardins, meditação para conexão com a natureza, ambientes de trabalho.",
  },
  {
    id: 22,
    nome: "Howlita",
    cor: "#F5F5F5",
    imagem: "/images/pedras/howlita.png",
    descricao: "Pedra da calma e paciência.",
    propriedades: "Traz tranquilidade, paciência, sono reparador e equilíbrio emocional.",
    origem: "Canadá, Estados Unidos e África do Sul",
    usos: "Quartos, meditação para acalmar a mente, ambientes de relaxamento.",
  },
  {
    id: 23,
    nome: "Jaspe Vermelho",
    cor: "#B22222",
    imagem: "/images/pedras/jaspe-vermelho.png",
    descricao: "Pedra da força e estabilidade.",
    propriedades: "Oferece força, estabilidade, energia vital e determinação.",
    origem: "Índia, Rússia e Austrália",
    usos: "Meditação para força interior, ambientes que precisam de estabilidade.",
  },
  {
    id: 24,
    nome: "Labradorita",
    cor: "#6C7A89",
    imagem: "/images/pedras/labradorita.png",
    descricao: "Pedra da transformação e magia positiva.",
    propriedades: "Estimula transformação positiva, intuição, criatividade e proteção.",
    origem: "Canadá, Madagascar e Finlândia",
    usos: "Meditação para transformação, ambientes criativos, rituais de mudança.",
  },
]

// Gerar URLs de placeholder para as imagens das pedras
for (let i = 0; i < pedrasMisticas.length; i++) {
  pedrasMisticas[i].imagem =
    `/placeholder.svg?height=200&width=200&query=crystal ${pedrasMisticas[i].nome}, gemstone, high quality, detailed, on white background`
}

export default function ArmarioMisticoPositivo() {
  const [portasAbertas, setPortasAbertas] = useState(false)
  const [gavetaAberta, setGavetaAberta] = useState(false)
  const [pedraSelecionada, setPedraSelecionada] = useState<number | null>(null)
  const [mostrarInfo, setMostrarInfo] = useState(false)
  const [pedrasNaGaveta, setPedrasNaGaveta] = useState<number[]>([])
  const [mandalaCriada, setMandalaCriada] = useState(false)
  const [imagemMandala, setImagemMandala] = useState<string | null>(null)
  const armarioRef = useRef<HTMLDivElement>(null)
  const [alturaArmario, setAlturaArmario] = useState(0)

  // Atualiza a altura do armário quando o componente é montado
  useEffect(() => {
    if (armarioRef.current) {
      setAlturaArmario(armarioRef.current.offsetHeight)
    }
  }, [])

  // Função para abrir/fechar as portas
  const alternarPortas = () => {
    setPortasAbertas(!portasAbertas)
  }

  // Função para abrir/fechar a gaveta
  const alternarGaveta = () => {
    setGavetaAberta(!gavetaAberta)
  }

  // Função para selecionar uma pedra
  const selecionarPedra = (id: number) => {
    if (gavetaAberta) {
      // Se a gaveta estiver aberta, adiciona ou remove a pedra da gaveta
      if (pedrasNaGaveta.includes(id)) {
        setPedrasNaGaveta(pedrasNaGaveta.filter((pedraId) => pedraId !== id))
      } else if (pedrasNaGaveta.length < 5) {
        setPedrasNaGaveta([...pedrasNaGaveta, id])
      }
    } else {
      // Se a gaveta estiver fechada, mostra informações da pedra
      setPedraSelecionada(id)
      setMostrarInfo(true)
    }
  }

  // Função para fechar o modal de informações
  const fecharInfo = () => {
    setMostrarInfo(false)
    setPedraSelecionada(null)
  }

  // Função para criar a mandala com base nas pedras selecionadas
  const criarMandala = () => {
    if (pedrasNaGaveta.length < 3) {
      alert("Selecione pelo menos 3 pedras para criar sua mandala.")
      return
    }

    // Cores das pedras selecionadas para a mandala
    const coresSelecionadas = pedrasNaGaveta.map((id) => {
      const pedra = pedrasMisticas.find((p) => p.id === id)
      return pedra ? pedra.cor : "#FFFFFF"
    })

    // Gerar URL para a mandala
    const query = encodeURIComponent(
      `beautiful mandala with colors ${coresSelecionadas.join(", ")}, sacred geometry, harmony, balance, positive energy, detailed illustration`,
    )
    const url = `/placeholder.svg?height=500&width=500&query=${query}`

    setImagemMandala(url)
    setMandalaCriada(true)
  }

  // Função para baixar a mandala
  const baixarMandala = () => {
    if (!imagemMandala) return

    const link = document.createElement("a")
    link.href = imagemMandala
    link.download = `mandala-cartomente-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Função para reiniciar o processo
  const reiniciar = () => {
    setPedrasNaGaveta([])
    setMandalaCriada(false)
    setImagemMandala(null)
  }

  // Organiza as pedras em prateleiras (6 pedras por prateleira, 4 prateleiras)
  const prateleiras = Array.from({ length: 4 }, (_, i) => pedrasMisticas.slice(i * 6, (i + 1) * 6))

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[90vh] flex flex-col items-center justify-center">
      {/* Título do armário */}
      <div className="text-center mb-8">
        <h1 className="font-cinzel text-5xl font-bold mb-2">
          <GlowText>Cartomente - A CAIXA</GlowText>
        </h1>
        <p className="text-xl text-cartomente-cream">Armário Místico de Pedras Positivas</p>
      </div>

      {/* Armário principal */}
      <div
        ref={armarioRef}
        className="relative w-full max-w-5xl h-[70vh] bg-cartomente-brown-darker/30 backdrop-blur-sm rounded-lg overflow-hidden border-8"
        style={{
          borderImage: "linear-gradient(45deg, #d4a373, #e9c46a, #d4a373) 1",
          boxShadow: "0 0 30px rgba(212, 163, 115, 0.5)",
        }}
      >
        {/* Iluminação LED ao redor do armário */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cartomente-gold/0 via-cartomente-gold/70 to-cartomente-gold/0 animate-pulse-slow"></div>
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cartomente-gold/0 via-cartomente-gold/70 to-cartomente-gold/0 animate-pulse-slow"></div>
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-cartomente-gold/0 via-cartomente-gold/70 to-cartomente-gold/0 animate-pulse-slow"></div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cartomente-gold/0 via-cartomente-gold/70 to-cartomente-gold/0 animate-pulse-slow"></div>
        </div>

        {/* Portas de vidro do armário */}
        <div className="absolute inset-0 flex">
          {/* Porta esquerda */}
          <motion.div
            className="w-1/2 h-full bg-cartomente-cream/5 backdrop-blur-sm border-r-2"
            style={{
              borderImage: "linear-gradient(to bottom, #d4a373, #e9c46a, #d4a373) 1",
              transformOrigin: "left",
              boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.1)",
            }}
            animate={{
              rotateY: portasAbertas ? -105 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-[#d4a373] via-[#e9c46a] to-[#d4a373] rounded-full" />
          </motion.div>

          {/* Porta direita */}
          <motion.div
            className="w-1/2 h-full bg-cartomente-cream/5 backdrop-blur-sm border-l-2"
            style={{
              borderImage: "linear-gradient(to bottom, #d4a373, #e9c46a, #d4a373) 1",
              transformOrigin: "right",
              boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.1)",
            }}
            animate={{
              rotateY: portasAbertas ? 105 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-[#d4a373] via-[#e9c46a] to-[#d4a373] rounded-full" />
          </motion.div>
        </div>

        {/* Interior do armário com prateleiras */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {prateleiras.map((prateleira, indicePreteleira) => (
            <div key={indicePreteleira} className="flex justify-around items-center h-1/4 relative">
              {/* Prateleira */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-[#d4a373] via-[#e9c46a] to-[#d4a373] bottom-0" />

              {/* Pedras na prateleira */}
              <div className="flex justify-around w-full">
                {prateleira.map((pedra) => (
                  <motion.div
                    key={pedra.id}
                    className="relative cursor-pointer group"
                    whileHover={{ scale: 1.1, y: -5 }}
                    onClick={() => selecionarPedra(pedra.id)}
                  >
                    <div
                      className={`w-16 h-16 rounded-md relative overflow-hidden ${
                        pedrasNaGaveta.includes(pedra.id) ? "ring-2 ring-cartomente-gold" : ""
                      }`}
                      style={{
                        backgroundColor: pedra.cor,
                        boxShadow: `0 0 10px ${pedra.cor}80`,
                      }}
                    >
                      <Image
                        src={pedra.imagem || "/placeholder.svg"}
                        alt={pedra.nome}
                        fill
                        className="object-cover mix-blend-overlay"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-cartomente-cream bg-cartomente-brown-dark/70 px-2 py-1 rounded whitespace-nowrap transition-opacity">
                      {pedra.nome}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Gaveta inferior (A CAIXA) */}
        <motion.div
          className="absolute bottom-0 inset-x-0 h-1/5 bg-gradient-to-b from-cartomente-brown/20 to-cartomente-brown/40 backdrop-blur-sm border-t-4 flex items-center justify-center"
          style={{
            borderImage: "linear-gradient(to right, #d4a373, #e9c46a, #d4a373) 1",
            boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.1)",
          }}
          animate={{
            y: gavetaAberta ? alturaArmario * 0.2 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-[#d4a373] via-[#e9c46a] to-[#d4a373] rounded-full" />
          <h2 className="text-2xl font-bold font-cinzel text-cartomente-cream">
            <GlowText>A CAIXA</GlowText>
          </h2>
        </motion.div>

        {/* Conteúdo da gaveta quando aberta (A CAIXA) */}
        <motion.div
          className="absolute top-full inset-x-0 h-[20vh] bg-gradient-to-b from-cartomente-brown/30 to-cartomente-brown/60 backdrop-blur-md border-4 rounded-b-lg flex items-center justify-center overflow-hidden"
          style={{
            borderImage: "linear-gradient(45deg, #d4a373, #e9c46a, #d4a373) 1",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)",
          }}
          initial={{ y: 0 }}
          animate={{
            y: gavetaAberta ? -alturaArmario * 0.2 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Interior da CAIXA */}
          <div className="relative w-full h-full p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold font-cinzel text-cartomente-cream mb-4 relative z-10">A CAIXA</h3>

            {pedrasNaGaveta.length === 0 ? (
              <p className="text-center text-cartomente-cream/80 max-w-md relative z-10">
                Selecione pedras das prateleiras enquanto a gaveta estiver aberta para colocá-las aqui.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center max-w-md relative z-10">
                {pedrasNaGaveta.map((id) => {
                  const pedra = pedrasMisticas.find((p) => p.id === id)
                  if (!pedra) return null

                  return (
                    <motion.div
                      key={pedra.id}
                      className="relative cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      onClick={() => selecionarPedra(pedra.id)}
                    >
                      <div
                        className="w-12 h-12 rounded-md relative overflow-hidden"
                        style={{
                          backgroundColor: pedra.cor,
                          boxShadow: `0 0 10px ${pedra.cor}80`,
                        }}
                      >
                        <Image
                          src={pedra.imagem || "/placeholder.svg"}
                          alt={pedra.nome}
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

            <div className="mt-4 text-center text-cartomente-cream/80 text-sm relative z-10">
              {pedrasNaGaveta.length > 0 && (
                <>
                  <p>Clique nas pedras para removê-las da CAIXA</p>
                  {pedrasNaGaveta.length >= 3 && (
                    <Button
                      onClick={criarMandala}
                      className="mt-2 bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream"
                    >
                      <Sparkles className="mr-2 h-4 w-4" /> Criar Mandala da Vida
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#e9c46a]/10 via-transparent to-[#e9c46a]/10 animate-pulse-slow" />
          </div>
        </motion.div>
      </div>

      {/* Botões de controle */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={alternarPortas}
          className="bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream"
        >
          {portasAbertas ? "Fechar Armário" : "Abrir Armário"}
        </Button>
        <Button
          onClick={alternarGaveta}
          className="bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream"
        >
          {gavetaAberta ? "Fechar A CAIXA" : "Abrir A CAIXA"}
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-cartomente-cream/80">
        {gavetaAberta ? (
          <p>Clique nas pedras nas prateleiras para adicioná-las à CAIXA</p>
        ) : (
          <p>Abra o armário para ver as pedras. Abra A CAIXA para selecionar pedras.</p>
        )}
      </div>

      {/* Modal de informações da pedra */}
      <AnimatePresence>
        {mostrarInfo && pedraSelecionada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={fecharInfo}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-cartomente-brown-darker to-cartomente-brown-dark border border-cartomente-gold/50 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pedra selecionada */}
              {(() => {
                const pedra = pedrasMisticas.find((p) => p.id === pedraSelecionada)
                if (!pedra) return null

                return (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-md relative overflow-hidden"
                          style={{
                            backgroundColor: pedra.cor,
                            boxShadow: `0 0 15px ${pedra.cor}80`,
                          }}
                        >
                          <Image
                            src={pedra.imagem || "/placeholder.svg"}
                            alt={pedra.nome}
                            fill
                            className="object-cover mix-blend-overlay"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />
                        </div>
                        <h3 className="text-2xl font-bold font-cinzel text-cartomente-gold">{pedra.nome}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={fecharInfo}
                        className="text-cartomente-cream/60 hover:text-cartomente-cream"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm uppercase tracking-wider text-cartomente-cream/60 mb-1">Descrição</h4>
                      <p className="text-cartomente-cream">{pedra.descricao}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm uppercase tracking-wider text-cartomente-cream/60 mb-1">
                        Propriedades Energéticas
                      </h4>
                      <p className="text-cartomente-cream">{pedra.propriedades}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm uppercase tracking-wider text-cartomente-cream/60 mb-1">Origem</h4>
                      <p className="text-cartomente-cream">{pedra.origem}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm uppercase tracking-wider text-cartomente-cream/60 mb-1">Usos</h4>
                      <p className="text-cartomente-cream">{pedra.usos}</p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        className="bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream"
                        onClick={fecharInfo}
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

      {/* Modal da Mandala */}
      <AnimatePresence>
        {mandalaCriada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setMandalaCriada(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-cartomente-brown-darker to-cartomente-brown-dark border border-cartomente-gold/50 rounded-lg p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold font-cinzel text-cartomente-gold">Mandala da Vida</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMandalaCriada(false)}
                  className="text-cartomente-cream/60 hover:text-cartomente-cream"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="relative w-64 h-64 md:w-80 md:h-80 mb-4">
                  {imagemMandala && (
                    <Image
                      src={imagemMandala || "/placeholder.svg"}
                      alt="Mandala da Vida"
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <p className="text-cartomente-cream text-center mb-4">
                  Sua Mandala da Vida foi criada com base nas energias das pedras selecionadas. Esta mandala representa
                  harmonia, equilíbrio e as energias positivas que você busca manifestar.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={baixarMandala}
                  className="bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream"
                >
                  <Download className="mr-2 h-4 w-4" /> Baixar Mandala
                </Button>
                <Button
                  onClick={reiniciar}
                  variant="outline"
                  className="border-cartomente-gold/50 text-cartomente-cream hover:bg-cartomente-brown/50"
                >
                  Criar Nova Mandala
                </Button>
              </div>
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

        .wood-texture {
          background-image: url('/images/wood-texture.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .tarot-card {
          aspect-ratio: 3/5;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .card-back {
          background-image: url('/images/card-back.png');
          background-size: cover;
          background-position: center;
          border: 2px solid #d4a373;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
