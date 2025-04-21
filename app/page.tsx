"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Sparkles, Upload, Star, Box, Wand2, Loader2, Crown, ScrollText } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ParticleBackground } from "@/components/ui/particle-background"
import { GlowText } from "@/components/ui/glow-text"
import { HolographicCard } from "@/components/ui/holographic-card"
import { motion, AnimatePresence } from "framer-motion"
import ReadingResult from "@/components/reading-result"
import Navbar from "@/components/navbar"
import { useAppContext } from "@/contexts/app-context"
import ReadingHistory from "@/components/reading-history"
import SubscriptionPlans from "@/components/subscription-plans"
import VirtualStoneBox from "@/components/virtual-stone-box"

export default function Home() {
  const { addReading, subscriptionTier } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [name, setName] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [question, setQuestion] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [readingResult, setReadingResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showVirtualBox, setShowVirtualBox] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  // Manipula o upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedImage(file)

    // Cria uma URL para preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Limpa a imagem selecionada
  const clearSelectedImage = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Substitua a função handleSubmit atual pela versão melhorada abaixo:

  // Processa o formulário e envia para a API
  const handleSubmit = async () => {
    if (!name || !birthdate || !question) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    setIsLoading(true)

    try {
      // Chama o endpoint do ChatGPT para obter a leitura
      const chatResponse = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          birthDate: birthdate,
          question,
          stoneTypes: [], // Adiciona um array vazio para evitar erros
        }),
      })

      // Primeiro verifica se a resposta foi bem-sucedida
      if (!chatResponse.ok) {
        console.error(`Erro na resposta da API: ${chatResponse.status} ${chatResponse.statusText}`)
        throw new Error(`Falha ao gerar a leitura: ${chatResponse.status}`)
      }

      // Tenta obter o texto da resposta
      const responseText = await chatResponse.text()
      let chatData

      try {
        chatData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Erro ao analisar resposta JSON:", parseError)
        console.error("Texto da resposta:", responseText)

        // Usa a leitura padrão em caso de erro de parsing
        chatData = {
          reply: `# Leitura Mística das Pedras

## Passado
As pedras revelam um caminho de aprendizado e crescimento. Você passou por desafios que fortaleceram sua essência espiritual.

## Presente
Neste momento, você está em um período de transformação. As pedras indicam que há energias positivas ao seu redor.

## Futuro
O futuro se mostra promissor, com novas oportunidades surgindo em seu caminho. Mantenha o equilíbrio entre mente, corpo e espírito.`,
        }
      }

      if (!chatData || !chatData.reply) {
        throw new Error("Resposta do servidor não contém dados de leitura")
      }

      const reading = chatData.reply

      // Gera os parâmetros para a mandala baseados na leitura
      try {
        const mandalaResponse = await fetch("/api/generate-mandala", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reading }),
        })

        if (!mandalaResponse.ok) {
          throw new Error(
            `Falha ao gerar parâmetros da mandala: ${mandalaResponse.status} ${mandalaResponse.statusText}`,
          )
        }

        // Primeiro obtém o texto da resposta para verificar se é um JSON válido
        const mandalaResponseText = await mandalaResponse.text()
        let mandalaData

        try {
          mandalaData = JSON.parse(mandalaResponseText)
        } catch (parseError) {
          console.error("Erro ao analisar resposta JSON da mandala:", parseError)
          console.error("Texto da resposta da mandala:", mandalaResponseText)

          // Usa parâmetros padrão em caso de erro
          mandalaData = {
            params: {
              colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
              layers: 5,
              shape: "circle",
              complexity: 7,
              symbols: ["estrela", "espiral", "lua"],
            },
          }
        }

        const result = {
          reading,
          mandalaParams: mandalaData.params || {
            colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
            layers: 5,
            shape: "circle",
            complexity: 7,
            symbols: ["estrela", "espiral", "lua"],
          },
        }

        // Define o resultado da leitura
        setReadingResult(result)

        // Adiciona a leitura ao histórico
        addReading({
          question,
          reading,
          mandalaParams: mandalaData.params || {
            colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
            layers: 5,
            shape: "circle",
            complexity: 7,
            symbols: ["estrela", "espiral", "lua"],
          },
        })
      } catch (mandalaError) {
        console.error("Erro ao gerar mandala:", mandalaError)

        // Mesmo com erro na mandala, ainda mostra a leitura com parâmetros padrão
        const result = {
          reading,
          mandalaParams: {
            colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
            layers: 5,
            shape: "circle",
            complexity: 7,
            symbols: ["estrela", "espiral", "lua"],
          },
        }

        setReadingResult(result)

        // Adiciona a leitura ao histórico mesmo sem mandala personalizada
        addReading({
          question,
          reading,
          mandalaParams: {
            colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
            layers: 5,
            shape: "circle",
            complexity: 7,
            symbols: ["estrela", "espiral", "lua"],
          },
        })
      }
    } catch (error) {
      console.error("Erro ao processar a leitura:", error)

      // Mostra uma mensagem de erro mais amigável
      alert("Ocorreu um erro ao processar sua leitura. Estamos gerando uma leitura alternativa para você.")

      // Cria uma leitura padrão em caso de erro
      const defaultReading = `# Leitura Mística das Pedras

## Passado
As pedras revelam um caminho de aprendizado e crescimento. Você passou por desafios que fortaleceram sua essência espiritual.

## Presente
Neste momento, você está em um período de transformação. As pedras indicam que há energias positivas ao seu redor.

## Futuro
O futuro se mostra promissor, com novas oportunidades surgindo em seu caminho. Mantenha o equilíbrio entre mente, corpo e espírito.`

      const defaultMandalaParams = {
        colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
        layers: 5,
        shape: "circle",
        complexity: 7,
        symbols: ["estrela", "espiral", "lua"],
      }

      // Define o resultado com a leitura padrão
      setReadingResult({
        reading: defaultReading,
        mandalaParams: defaultMandalaParams,
      })

      // Adiciona a leitura padrão ao histórico
      addReading({
        question,
        reading: defaultReading,
        mandalaParams: defaultMandalaParams,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fecha o resultado da leitura
  const closeReading = () => {
    setReadingResult(null)
  }

  // Adicione esta função após as outras funções de manipulação de estado
  const scanStones = async () => {
    if (!name || !birthdate || !question) {
      alert("Por favor, preencha seu nome, data de nascimento e pergunta antes de continuar.")
      return
    }

    setIsLoading(true)

    try {
      // Obtém os tipos de pedras da caixa virtual
      const stoneElements = document.querySelectorAll(".virtual-stone-box .stone")
      const stoneTypes = Array.from(stoneElements).map((stone) => stone.getAttribute("data-type") || "unknown")

      // Chama o endpoint do ChatGPT para obter a leitura
      const chatResponse = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          birthDate: birthdate,
          question,
          stoneTypes: stoneTypes.length > 0 ? stoneTypes : [],
        }),
      })

      if (!chatResponse.ok) {
        throw new Error(`Falha ao gerar a leitura: ${chatResponse.status} ${chatResponse.statusText}`)
      }

      // Primeiro obtém o texto da resposta para verificar se é um JSON válido
      const responseText = await chatResponse.text()
      let chatData

      try {
        chatData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Erro ao analisar resposta JSON:", parseError)
        console.error("Texto da resposta:", responseText)
        throw new Error("Resposta inválida do servidor")
      }

      if (!chatData || !chatData.reply) {
        throw new Error("Resposta do servidor não contém dados de leitura")
      }

      const reading = chatData.reply

      // Gera os parâmetros para a mandala baseados na leitura
      const mandalaResponse = await fetch("/api/generate-mandala", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reading }),
      })

      if (!mandalaResponse.ok) {
        throw new Error(`Falha ao gerar parâmetros da mandala: ${mandalaResponse.status} ${mandalaResponse.statusText}`)
      }

      // Primeiro obtém o texto da resposta para verificar se é um JSON válido
      const mandalaResponseText = await mandalaResponse.text()
      let mandalaData

      try {
        mandalaData = JSON.parse(mandalaResponseText)
      } catch (parseError) {
        console.error("Erro ao analisar resposta JSON da mandala:", parseError)
        console.error("Texto da resposta da mandala:", mandalaResponseText)
        throw new Error("Resposta inválida do servidor para mandala")
      }

      if (!mandalaData || !mandalaData.params) {
        throw new Error("Resposta do servidor não contém parâmetros da mandala")
      }

      const result = {
        reading,
        mandalaParams: mandalaData.params,
      }

      // Define o resultado da leitura
      setReadingResult(result)

      // Adiciona a leitura ao histórico
      addReading({
        question,
        reading,
        mandalaParams: mandalaData.params,
      })
    } catch (error) {
      console.error("Erro ao processar a leitura:", error)
      alert(`Ocorreu um erro ao processar sua leitura: ${error.message}. Por favor, tente novamente.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-8 pt-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff] overflow-x-hidden">
      <Navbar />
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <h1 className="text-6xl font-bold text-[#e6d8ff] text-center my-8">
          <GlowText glowColor="#c774f0">🔮 A CAIXA</GlowText>
        </h1>
        <div className="absolute -top-10 -left-10 -right-10 -bottom-10 bg-[#8e2de2] rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      </motion.div>

      {/* Opções principais com fundos animados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
        <motion.div whileHover={{ scale: 1.03 }} className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8e2de2] to-[#6a1fc7] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setShowVirtualBox(false)
              setShowHistory(false)
              setShowPlans(false)
              if (!showForm) {
                setTimeout(() => {
                  const form = document.getElementById("formulario")
                  form?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }
            }}
            className="relative w-full h-full bg-transparent hover:bg-black/10 rounded-xl p-8 flex flex-col items-center justify-center border border-white/20 transition-all"
          >
            <Wand2 className="h-12 w-12 mb-4 text-white" />
            <h3 className="text-xl font-bold mb-2">Leitura Mística</h3>
            <p className="text-center text-white/80">Consulte o oráculo com suas pedras</p>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6a1fc7] to-[#36005d] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <Button
            onClick={() => {
              setShowVirtualBox(!showVirtualBox)
              setShowForm(false)
              setShowHistory(false)
              setShowPlans(false)
              if (!showVirtualBox) {
                setTimeout(() => {
                  const box = document.getElementById("virtual-box")
                  box?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }
            }}
            className="relative w-full h-full bg-transparent hover:bg-black/10 rounded-xl p-8 flex flex-col items-center justify-center border border-white/20 transition-all"
          >
            <Box className="h-12 w-12 mb-4 text-white" />
            <h3 className="text-xl font-bold mb-2">Caixa Virtual</h3>
            <p className="text-center text-white/80">Experimente com pedras virtuais</p>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#36005d] to-[#1d002b] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <Button
            onClick={() => {
              setShowHistory(!showHistory)
              setShowForm(false)
              setShowVirtualBox(false)
              setShowPlans(false)
              if (!showHistory) {
                setTimeout(() => {
                  const history = document.getElementById("historico")
                  history?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }
            }}
            className="relative w-full h-full bg-transparent hover:bg-black/10 rounded-xl p-8 flex flex-col items-center justify-center border border-white/20 transition-all"
          >
            <ScrollText className="h-12 w-12 mb-4 text-white" />
            <h3 className="text-xl font-bold mb-2">Histórico</h3>
            <p className="text-center text-white/80">Reveja suas leituras anteriores</p>
          </Button>
        </motion.div>
      </div>

      {/* Campos de nome e data de nascimento */}
      <AnimatePresence>
        {(showForm || showVirtualBox) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mb-6"
          >
            <HolographicCard>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-[#ff9be2]" /> Seus Dados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-[#e6d8ff]">
                    Seu Nome:
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ex: Gil Custódio"
                    className="bg-white/10 border-white/20 text-white focus:border-[#8e2de2] focus:ring-[#8e2de2]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="birthdate" className="text-[#e6d8ff]">
                    Data de Nascimento:
                  </Label>
                  <Input
                    id="birthdate"
                    type="date"
                    className="bg-white/10 border-white/20 text-white focus:border-[#8e2de2] focus:ring-[#8e2de2]"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>
              </div>
            </HolographicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulário de consulta */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <HolographicCard id="formulario" className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-[#ff9be2]" /> Faça sua pergunta à A CAIXA
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question" className="text-[#e6d8ff]">
                    Sua Pergunta Mística:
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="Ex: Qual o meu propósito neste momento?"
                    rows={3}
                    className="bg-white/10 border-white/20 text-white focus:border-[#8e2de2] focus:ring-[#8e2de2]"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="image" className="text-[#e6d8ff]">
                    Envie a foto da disposição das pedras:
                  </Label>
                  <div className="mt-2">
                    {previewUrl ? (
                      <div className="relative w-full h-48 mb-2">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview da imagem"
                          fill
                          className="object-contain rounded-lg"
                        />
                        <button
                          onClick={clearSelectedImage}
                          className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-[#ff9be2]" />
                            <p className="mb-2 text-sm text-white">
                              <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG ou JPEG (Máx. 10MB)</p>
                          </div>
                          <Input
                            id="image-upload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowVirtualBox(true)}
                    className="bg-white/5 border-white/20 hover:bg-white/10"
                  >
                    <Box className="w-4 h-4 mr-2" /> Usar Caixa Virtual
                  </Button>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="bg-[#8e2de2] hover:bg-[#a100f5] text-white px-6 py-3 rounded-full shadow-purple transition-all hover:shadow-purple-intense"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" /> Gerar Leitura
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </HolographicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Caixa Virtual */}
      <AnimatePresence>
        {showVirtualBox && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <HolographicCard id="virtual-box" className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Box className="h-5 w-5 text-[#ff9be2]" /> Caixa Virtual de Pedras Místicas
                </h2>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (!name || !birthdate || !question) {
                        alert("Por favor, preencha seu nome, data de nascimento e pergunta antes de continuar.")
                        return
                      }
                      // Função para escanear as pedras virtuais
                      scanStones()
                    }}
                    className="bg-[#8e2de2] hover:bg-[#a100f5] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" /> Consultar Oráculo
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="question" className="text-[#e6d8ff] mb-2 block">
                  Sua Pergunta Mística:
                </Label>
                <Textarea
                  id="question"
                  placeholder="Ex: Qual o meu propósito neste momento?"
                  rows={2}
                  className="bg-white/10 border-white/20 text-white focus:border-[#8e2de2] focus:ring-[#8e2de2] mb-4"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <VirtualStoneBox />
            </HolographicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Histórico de Leituras */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            id="historico"
            className="w-full"
          >
            <ReadingHistory />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de planos de assinatura */}
      <Button
        onClick={() => {
          setShowPlans(!showPlans)
          setShowForm(false)
          setShowVirtualBox(false)
          setShowHistory(false)
        }}
        className="mb-6 bg-[#c774f0] hover:bg-[#d985ff] text-white"
      >
        <Crown className="w-4 h-4 mr-2" /> {showPlans ? "Ocultar Planos" : "Ver Planos de Assinatura"}
      </Button>

      {/* Planos de Assinatura */}
      <AnimatePresence>
        {showPlans && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl"
          >
            <SubscriptionPlans />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seções informativas */}
      <HolographicCard className="mb-6 max-w-3xl w-full" delay={100}>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#ff9be2]" /> Como funciona
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li className="text-lg">Agite as pedras e tire uma foto da disposição final</li>
          <li className="text-lg">Informe seu nome, data de nascimento e uma pergunta</li>
          <li className="text-lg">A IA interpreta a imagem com visão computacional</li>
          <li className="text-lg">O ChatGPT gera uma leitura simbólica e espiritual</li>
          <li className="text-lg">Você recebe uma mensagem + uma mandala + áudio</li>
        </ul>
      </HolographicCard>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-8 text-center text-gray-400 text-sm"
      >
        Projeto criado por <strong>Gil BV</strong> – Inventor e Criador da experiência mística digital.
        <br />
        Desenvolvido com amor, tecnologia e espiritualidade.
      </motion.footer>

      {/* Modal de resultado da leitura */}
      <AnimatePresence>
        {readingResult && (
          <ReadingResult reading={readingResult} mandalaParams={readingResult.mandalaParams} onClose={closeReading} />
        )}
      </AnimatePresence>
    </main>
  )
}
