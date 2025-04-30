"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HolographicCard } from "@/components/ui/holographic-card"
import { GlowText } from "@/components/ui/glow-text"
import Navbar from "@/components/navbar"
import { Sparkles, Wand2, Shuffle, BookOpen, Send, Loader2, Calendar } from "lucide-react"
import { useAppContext } from "@/contexts/app-context"

// Definição das cartas de tarô
const tarotCards = [
  { id: 1, name: "O Mago", image: "/images/tarot/magician.jpg" },
  { id: 2, name: "A Sacerdotisa", image: "/images/tarot/high-priestess.jpg" },
  { id: 3, name: "A Imperatriz", image: "/images/tarot/empress.jpg" },
  { id: 4, name: "O Imperador", image: "/images/tarot/emperor.jpg" },
  { id: 5, name: "O Hierofante", image: "/images/tarot/hierophant.jpg" },
  { id: 6, name: "Os Enamorados", image: "/images/tarot/lovers.jpg" },
  { id: 7, name: "O Carro", image: "/images/tarot/chariot.jpg" },
  { id: 8, name: "A Força", image: "/images/tarot/strength.jpg" },
  { id: 9, name: "O Eremita", image: "/images/tarot/hermit.jpg" },
  { id: 10, name: "A Roda da Fortuna", image: "/images/tarot/wheel-of-fortune.jpg" },
  { id: 11, name: "A Justiça", image: "/images/tarot/justice.jpg" },
  { id: 12, name: "O Enforcado", image: "/images/tarot/hanged-man.jpg" },
  { id: 13, name: "A Morte", image: "/images/tarot/death.jpg" },
  { id: 14, name: "A Temperança", image: "/images/tarot/temperance.jpg" },
  { id: 15, name: "O Diabo", image: "/images/tarot/devil.jpg" },
  { id: 16, name: "A Torre", image: "/images/tarot/tower.jpg" },
  { id: 17, name: "A Estrela", image: "/images/tarot/star.jpg" },
  { id: 18, name: "A Lua", image: "/images/tarot/moon.jpg" },
  { id: 19, name: "O Sol", image: "/images/tarot/sun.jpg" },
  { id: 20, name: "O Julgamento", image: "/images/tarot/judgement.jpg" },
  { id: 21, name: "O Mundo", image: "/images/tarot/world.jpg" },
  { id: 22, name: "O Louco", image: "/images/tarot/fool.jpg" },
]

// Imagens para as cartas de tarô
for (let i = 1; i <= 22; i++) {
  tarotCards[i - 1].image =
    `/placeholder.svg?height=400&width=240&query=tarot card ${tarotCards[i - 1].name}, vintage style, ornate gold details, mystical`
}

export default function OraculoPage() {
  const { addReading } = useAppContext()
  const [name, setName] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [showCards, setShowCards] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [showReading, setShowReading] = useState(false)
  const [readingResult, setReadingResult] = useState("")
  const [shuffledCards, setShuffledCards] = useState<typeof tarotCards>([])
  const [revealedCards, setRevealedCards] = useState<number[]>([])

  // Embaralhar as cartas quando a página carrega
  useEffect(() => {
    shuffleCards()
  }, [])

  // Função para embaralhar as cartas
  const shuffleCards = () => {
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5)
    setShuffledCards(shuffled)
    setSelectedCards([])
    setRevealedCards([])
  }

  // Função para selecionar uma carta
  const selectCard = (index: number) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((i) => i !== index))
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, index])
    }
  }

  // Função para revelar as cartas uma a uma
  const revealCard = (index: number) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards([...revealedCards, index])
    }
  }

  // Função para iniciar a leitura
  const startReading = () => {
    if (!name || !birthdate || !question) {
      alert("Por favor, preencha todos os campos antes de continuar.")
      return
    }

    setShowForm(false)
    setShowCards(true)
  }

  // Função para gerar a leitura com base nas cartas selecionadas
  const generateReading = async () => {
    if (selectedCards.length !== 3) {
      alert("Por favor, selecione exatamente 3 cartas para sua leitura.")
      return
    }

    setIsLoading(true)

    try {
      // Obter os nomes das cartas selecionadas
      const selectedCardNames = selectedCards.map((index) => shuffledCards[index].name)

      // Criar o prompt para a API
      const prompt = `
        Nome: ${name}
        Data de Nascimento: ${birthdate}
        Pergunta: ${question}
        Cartas selecionadas: ${selectedCardNames.join(", ")}
        
        Gere uma leitura de tarô detalhada baseada nas três cartas selecionadas. A leitura deve ser dividida em três partes:
        1. Passado/Influências: Interpretação da primeira carta (${selectedCardNames[0]})
        2. Presente/Situação Atual: Interpretação da segunda carta (${selectedCardNames[1]})
        3. Futuro/Resultado Potencial: Interpretação da terceira carta (${selectedCardNames[2]})
        
        Conclua com uma síntese que integre o significado das três cartas e ofereça orientação específica relacionada à pergunta do consulente.
      `

      // Simular uma chamada de API (substitua por sua chamada real)
      // Aguardar 2 segundos para simular o processamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Gerar uma leitura fictícia (substitua por sua lógica real)
      const reading = `
# Leitura de Tarô para ${name}

## Passado/Influências: ${shuffledCards[selectedCards[0]].name}
${generateCardReading(shuffledCards[selectedCards[0]].name, "passado")}

## Presente/Situação Atual: ${shuffledCards[selectedCards[1]].name}
${generateCardReading(shuffledCards[selectedCards[1]].name, "presente")}

## Futuro/Resultado Potencial: ${shuffledCards[selectedCards[2]].name}
${generateCardReading(shuffledCards[selectedCards[2]].name, "futuro")}

## Síntese e Orientação
A combinação de ${shuffledCards[selectedCards[0]].name}, ${shuffledCards[selectedCards[1]].name} e ${shuffledCards[selectedCards[2]].name} sugere um caminho de transformação e crescimento pessoal. Você está passando por um período de transição importante, onde antigas estruturas estão dando lugar a novas possibilidades.

Em relação à sua pergunta sobre "${question}", as cartas indicam que você deve confiar em sua intuição e sabedoria interior. O momento atual pede coragem para abraçar mudanças necessárias, mesmo que pareçam desafiadoras. Lembre-se que toda transformação traz consigo a semente de novas oportunidades.

Nos próximos meses, esteja atento aos sinais e sincronicidades que aparecerem em seu caminho. Eles servirão como guias para suas próximas decisões. Cultive a paciência e a perseverança, pois os resultados que você busca estão se formando, mesmo que ainda não sejam completamente visíveis.
      `

      setReadingResult(reading)
      setShowCards(false)
      setShowReading(true)

      // Adicionar a leitura ao histórico
      addReading({
        question,
        reading,
        cards: selectedCards.map((index) => ({
          name: shuffledCards[index].name,
          image: shuffledCards[index].image,
        })),
      })
    } catch (error) {
      console.error("Erro ao gerar leitura:", error)
      alert("Ocorreu um erro ao gerar sua leitura. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função auxiliar para gerar texto de leitura para cada carta
  const generateCardReading = (cardName: string, position: string) => {
    // Leituras fictícias para cada posição
    const readings = {
      passado: {
        "O Mago":
          "No passado, você demonstrou grande habilidade em utilizar seus recursos e talentos para manifestar seus desejos. Houve um momento em que você assumiu controle de sua vida e direcionou sua energia de forma consciente para seus objetivos.",
        "A Sacerdotisa":
          "Suas experiências passadas foram marcadas por uma forte conexão com sua intuição e sabedoria interior. Você cultivou um conhecimento profundo que agora serve como base para suas decisões atuais.",
        "A Imperatriz":
          "Seu passado foi marcado por um período de abundância e crescimento. Você nutriu projetos e relacionamentos com dedicação, permitindo que florescessem naturalmente.",
        "O Imperador":
          "No passado, você estabeleceu estruturas e fundações sólidas em sua vida. Houve um período em que a ordem, a disciplina e a estabilidade foram prioridades para você.",
        "O Hierofante":
          "Suas experiências passadas foram influenciadas por tradições, ensinamentos espirituais ou institucionais. Você buscou conhecimento através de caminhos convencionais e respeitou hierarquias estabelecidas.",
      },
      presente: {
        "O Mago":
          "No momento presente, você está em uma posição de poder e capacidade criativa. Todos os elementos necessários para seu sucesso estão ao seu alcance - use-os com sabedoria e intenção clara.",
        "A Sacerdotisa":
          "Atualmente, você está em um período de introspecção e desenvolvimento interior. Há mistérios se revelando e sua intuição está especialmente aguçada - confie nos sussurros de sua voz interior.",
        "A Imperatriz":
          "O momento presente é marcado por fertilidade e abundância em sua vida. Você está em um ciclo de crescimento, onde seus projetos e relacionamentos estão florescendo naturalmente.",
        "O Imperador":
          "Na situação atual, você está estabelecendo ordem e estrutura em sua vida. É um momento de assumir autoridade e responsabilidade, criando sistemas estáveis para seu futuro.",
        "O Hierofante":
          "Você está buscando orientação espiritual ou institucional no momento presente. Há um chamado para conectar-se com tradições ou conhecimentos estabelecidos que podem oferecer direção.",
      },
      futuro: {
        "O Mago":
          "No futuro, você terá a oportunidade de manifestar seus desejos através de ação consciente e focada. Prepare-se para um período onde sua capacidade de transformar intenção em realidade estará amplificada.",
        "A Sacerdotisa":
          "O caminho à sua frente revela um período de revelações intuitivas e conhecimento profundo. Segredos serão revelados e sua conexão com o subconsciente se fortalecerá.",
        "A Imperatriz":
          "Seu futuro promete um período de abundância e crescimento natural. Projetos que você nutriu começarão a dar frutos, e relacionamentos florescerão com vitalidade renovada.",
        "O Imperador":
          "No futuro, você estabelecerá estruturas duradouras em sua vida. Haverá uma oportunidade de assumir uma posição de autoridade e criar estabilidade a longo prazo.",
        "O Hierofante":
          "O caminho à frente sugere um período de aprendizado através de tradições estabelecidas. Você poderá encontrar orientação valiosa através de instituições ou mentores respeitados.",
      },
    }

    // Retornar a leitura correspondente ou uma genérica se não existir
    return (
      readings[position][cardName as keyof (typeof readings)[typeof position]] ||
      `A carta ${cardName} nesta posição sugere um período significativo de transformação e crescimento. As energias desta carta influenciam profundamente este aspecto de sua jornada, trazendo lições importantes para sua evolução pessoal.`
    )
  }

  // Função para reiniciar a leitura
  const restartReading = () => {
    setShowReading(false)
    setShowForm(true)
    setQuestion("")
    shuffleCards()
  }

  return (
    <main className="min-h-screen pt-20 pb-10 wood-texture">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1 className="font-cinzel text-5xl font-bold mb-4">
            <GlowText glowColor="#d4af37">Cartomente</GlowText>
          </h1>
          <p className="text-cartomente-cream text-xl max-w-3xl mx-auto">
            Descubra os mistérios do seu destino através das cartas místicas e da sabedoria ancestral
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <HolographicCard className="max-w-2xl mx-auto mb-8">
                <h2 className="font-cinzel text-2xl font-bold mb-6 text-cartomente-gold flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" /> Consulta ao Oráculo
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-cartomente-cream">
                      Seu Nome
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="bg-cartomente-brown-darker/30 border-cartomente-gold/30 text-cartomente-cream"
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthdate" className="text-cartomente-cream">
                      Data de Nascimento
                    </Label>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-cartomente-gold" />
                      <Input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="bg-cartomente-brown-darker/30 border-cartomente-gold/30 text-cartomente-cream"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="question" className="text-cartomente-cream">
                      Sua Pergunta ao Oráculo
                    </Label>
                    <Textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="O que você deseja saber? Seja específico em sua pergunta..."
                      rows={4}
                      className="bg-cartomente-brown-darker/30 border-cartomente-gold/30 text-cartomente-cream"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={startReading}
                      className="w-full bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream"
                    >
                      <Wand2 className="mr-2 h-4 w-4" /> Iniciar Consulta
                    </Button>
                  </div>
                </div>
              </HolographicCard>

              <div className="text-center text-cartomente-cream/80 text-sm max-w-2xl mx-auto">
                <p>
                  O oráculo Cartomente combina a sabedoria ancestral do tarô com inteligência artificial para oferecer
                  insights profundos sobre seu caminho.
                </p>
              </div>
            </motion.div>
          )}

          {showCards && (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="font-cinzel text-2xl font-bold text-cartomente-gold mb-2">Selecione Três Cartas</h2>
                <p className="text-cartomente-cream mb-4">
                  Escolha com intuição as três cartas que guiarão sua leitura
                </p>

                <Button onClick={shuffleCards} variant="outline" className="mb-4">
                  <Shuffle className="mr-2 h-4 w-4" /> Embaralhar Cartas
                </Button>

                <div className="flex justify-center mb-2">
                  <div className="bg-cartomente-brown-darker/50 px-3 py-1 rounded-full text-cartomente-cream text-sm">
                    {selectedCards.length} de 3 cartas selecionadas
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {shuffledCards.slice(0, 15).map((card, index) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ y: -5, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer relative ${selectedCards.includes(index) ? "ring-2 ring-cartomente-gold" : ""}`}
                    onClick={() => selectCard(index)}
                  >
                    <div className="tarot-card card-back overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-cartomente-gold text-xl font-cinzel opacity-80">
                          {selectedCards.indexOf(index) > -1 ? selectedCards.indexOf(index) + 1 : ""}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCards(false)
                    setShowForm(true)
                  }}
                >
                  Voltar
                </Button>

                <Button
                  onClick={generateReading}
                  disabled={selectedCards.length !== 3 || isLoading}
                  className="bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Consultando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Consultar Oráculo
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {showReading && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-4xl mx-auto">
                <HolographicCard className="mb-8">
                  <h2 className="font-cinzel text-3xl font-bold mb-6 text-cartomente-gold text-center">
                    Sua Leitura de Tarô
                  </h2>

                  <div className="flex flex-wrap justify-center gap-6 mb-8">
                    {selectedCards.map((cardIndex, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, rotateY: 180 }}
                        animate={{
                          opacity: 1,
                          rotateY: revealedCards.includes(i) ? 0 : 180,
                          transition: { delay: i * 0.5 },
                        }}
                        className="relative"
                        onClick={() => revealCard(i)}
                      >
                        <div className="tarot-card w-32 sm:w-40 perspective-1000">
                          <div
                            className="w-full h-full transition-all duration-500"
                            style={{
                              transformStyle: "preserve-3d",
                              transform: revealedCards.includes(i) ? "rotateY(0deg)" : "rotateY(180deg)",
                            }}
                          >
                            <div
                              className="absolute w-full h-full backface-hidden"
                              style={{
                                backgroundImage: `url(${shuffledCards[cardIndex].image})`,
                                backgroundSize: "cover",
                                backfaceVisibility: "hidden",
                              }}
                            />
                            <div
                              className="absolute w-full h-full card-back backface-hidden"
                              style={{
                                transform: "rotateY(180deg)",
                                backfaceVisibility: "hidden",
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-cartomente-gold font-cinzel text-sm">
                            {revealedCards.includes(i) ? shuffledCards[cardIndex].name : "Clique para revelar"}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-line text-cartomente-cream">{readingResult}</div>
                  </div>
                </HolographicCard>

                <div className="flex justify-center">
                  <Button
                    onClick={restartReading}
                    className="bg-cartomente-brown hover:bg-cartomente-brown-dark text-cartomente-cream"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Nova Consulta
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
