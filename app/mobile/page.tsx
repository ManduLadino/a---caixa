"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ParticleBackground } from "@/components/ui/particle-background"
import { GlowText } from "@/components/ui/glow-text"
import { motion, AnimatePresence } from "framer-motion"
import MobileNavbar from "@/components/mobile-navbar"
import { useAppContext } from "@/contexts/app-context"
import { useRouter } from "next/navigation"
import VirtualStoneBox from "@/components/virtual-stone-box"
import { Sparkles, Star, Wand2, Loader2, Camera, ArrowRight, Box, X } from "lucide-react"

export default function MobilePage() {
  const { addReading } = useAppContext()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [showVirtualBox, setShowVirtualBox] = useState(false)
  const [showForm, setShowForm] = useState(true)

  // Ativa a câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err)
      alert("Não foi possível acessar a câmera. Verifique as permissões.")
    }
  }

  // Captura a imagem da câmera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageDataUrl)

        // Desliga a câmera
        const stream = video.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
        setCameraActive(false)
      }
    }
  }

  // Limpa a imagem capturada
  const clearCapturedImage = () => {
    setCapturedImage(null)
  }

  // Avança para o próximo passo
  const nextStep = () => {
    if (step === 1 && !name) {
      alert("Por favor, informe seu nome.")
      return
    }

    if (step === 2 && !birthdate) {
      alert("Por favor, informe sua data de nascimento.")
      return
    }

    if (step === 3 && !question) {
      alert("Por favor, faça uma pergunta.")
      return
    }

    if (step < 5) {
      setStep(step + 1)
    }
  }

  // Volta para o passo anterior
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

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
        }),
      })

      if (!chatResponse.ok) {
        throw new Error("Falha ao gerar a leitura")
      }

      const chatData = await chatResponse.json()
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
        throw new Error("Falha ao gerar parâmetros da mandala")
      }

      const mandalaData = await mandalaResponse.json()

      // Adiciona a leitura ao histórico
      addReading({
        question,
        reading,
        mandalaParams: mandalaData.params,
      })

      // Redireciona para a página de resultado
      router.push(`/mobile/resultado?id=${Date.now()}`)
    } catch (error) {
      console.error("Erro ao processar a leitura:", error)
      alert("Ocorreu um erro ao processar sua leitura. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-16 pb-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff]">
      <MobileNavbar />
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mb-6 w-full"
      >
        <h1 className="text-4xl font-bold text-center my-4">
          <GlowText glowColor="#c774f0">🔮 A CAIXA</GlowText>
        </h1>
        <div className="absolute -top-10 -left-10 -right-10 -bottom-10 bg-[#8e2de2] rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      </motion.div>

      {/* Indicador de progresso */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i === step
                  ? "bg-[#8e2de2] text-white"
                  : i < step
                    ? "bg-[#c774f0]/50 text-white"
                    : "bg-white/10 text-white/50"
              }`}
            >
              {i}
            </div>
          ))}
        </div>
        <div className="w-full bg-white/10 h-1 rounded-full">
          <div
            className="bg-[#8e2de2] h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      {/* Opções principais com fundos animados */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-md mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8e2de2] to-[#6a1fc7] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <Button
            onClick={() => {
              setStep(1)
              setShowVirtualBox(false)
            }}
            className="relative w-full h-full bg-transparent hover:bg-black/10 rounded-xl p-6 flex flex-col items-center justify-center border border-white/20 transition-all"
          >
            <Camera className="h-10 w-10 mb-3 text-white" />
            <h3 className="text-lg font-bold mb-1">Leitura com Foto</h3>
            <p className="text-center text-white/80 text-sm">Tire uma foto das suas pedras</p>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6a1fc7] to-[#36005d] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <Button
            onClick={() => {
              setShowVirtualBox(!showVirtualBox)
              setStep(1)
            }}
            className="relative w-full h-full bg-transparent hover:bg-black/10 rounded-xl p-6 flex flex-col items-center justify-center border border-white/20 transition-all"
          >
            <Box className="h-10 w-10 mb-3 text-white" />
            <h3 className="text-lg font-bold mb-1">Caixa Virtual</h3>
            <p className="text-center text-white/80 text-sm">Use pedras virtuais para consulta</p>
          </Button>
        </motion.div>
      </div>

      {/* Campos de nome e data de nascimento */}
      <div className="w-full max-w-md mb-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <Star className="h-5 w-5 mr-2 text-[#ff9be2]" /> Seus Dados
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className="text-[#e6d8ff]">
                Seu Nome:
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Maria Silva"
                className="bg-white/10 border-white/20 text-white"
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
                className="bg-white/10 border-white/20 text-white"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVirtualBox && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mb-6"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Box className="h-5 w-5 mr-2 text-[#ff9be2]" /> Caixa Virtual
                </h2>

                <Button
                  onClick={() => setShowVirtualBox(false)}
                  variant="outline"
                  className="bg-white/10 border-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4">
                <Label htmlFor="question-virtual" className="text-[#e6d8ff] mb-2 block">
                  Sua Pergunta:
                </Label>
                <Textarea
                  id="question-virtual"
                  placeholder="Ex: Qual o meu propósito neste momento?"
                  rows={2}
                  className="bg-white/10 border-white/20 text-white focus:border-[#8e2de2] focus:ring-[#8e2de2]"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <VirtualStoneBox />

              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !name || !birthdate || !question}
                  className="bg-[#8e2de2] hover:bg-[#a100f5] text-white"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo do passo atual */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#ff9be2]" /> Quem é você?
              </h2>
              <p className="mb-4">Para iniciar sua jornada mística, precisamos conhecer você.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#e6d8ff]">
                    Seu Nome:
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ex: Maria Silva"
                    className="bg-white/10 border-white/20 text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#ff9be2]" /> Quando você nasceu?
              </h2>
              <p className="mb-4">Sua data de nascimento revela muito sobre sua energia cósmica.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthdate" className="text-[#e6d8ff]">
                    Data de Nascimento:
                  </Label>
                  <Input
                    id="birthdate"
                    type="date"
                    className="bg-white/10 border-white/20 text-white"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#ff9be2]" /> O que deseja saber?
              </h2>
              <p className="mb-4">Faça sua pergunta ao oráculo. Seja específico para obter insights mais profundos.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question" className="text-[#e6d8ff]">
                    Sua Pergunta Mística:
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="Ex: Qual o meu propósito neste momento?"
                    rows={4}
                    className="bg-white/10 border-white/20 text-white"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#ff9be2]" /> Capture as pedras
              </h2>
              <p className="mb-4">Tire uma foto da disposição das pedras místicas para sua leitura.</p>

              {!cameraActive && !capturedImage && (
                <div className="flex flex-col items-center">
                  <div className="w-full h-48 bg-black/20 rounded-lg mb-4 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-white/50" />
                  </div>
                  <Button onClick={startCamera} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white">
                    <Camera className="w-4 h-4 mr-2" /> Abrir Câmera
                  </Button>
                </div>
              )}

              {cameraActive && (
                <div className="flex flex-col items-center">
                  <div className="relative w-full mb-4 rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                  </div>
                  <Button onClick={captureImage} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white">
                    <Camera className="w-4 h-4 mr-2" /> Capturar Imagem
                  </Button>
                </div>
              )}

              {capturedImage && (
                <div className="flex flex-col items-center">
                  <div className="relative w-full h-64 mb-4">
                    <Image
                      src={capturedImage || "/placeholder.svg"}
                      alt="Imagem capturada"
                      fill
                      className="object-contain rounded-lg"
                    />
                    <button
                      onClick={clearCapturedImage}
                      className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-center text-sm text-white/70 mb-2">Imagem capturada com sucesso!</p>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-[#ff9be2]" /> Confirme sua leitura
              </h2>
              <p className="mb-4">Revise suas informações antes de consultar o oráculo.</p>

              <div className="space-y-3 mb-6">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Nome</p>
                  <p>{name}</p>
                </div>

                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Data de Nascimento</p>
                  <p>{birthdate}</p>
                </div>

                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Pergunta</p>
                  <p>{question}</p>
                </div>

                {capturedImage && (
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Imagem Capturada</p>
                    <div className="h-20 relative mt-2">
                      <Image
                        src={capturedImage || "/placeholder.svg"}
                        alt="Imagem capturada"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-[#8e2de2] hover:bg-[#a100f5] text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" /> Consultar o Oráculo
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botões de navegação */}
      <div className="w-full max-w-md mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className={`bg-white/5 border-white/20 ${step === 1 ? "opacity-50" : ""}`}
        >
          Voltar
        </Button>

        {step < 5 && (
          <Button onClick={nextStep} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white">
            Próximo <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </main>
  )
}
