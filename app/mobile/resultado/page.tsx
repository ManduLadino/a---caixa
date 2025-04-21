"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/components/ui/particle-background"
import MobileNavbar from "@/components/mobile-navbar"
import { useAppContext } from "@/contexts/app-context"
import MandalaGenerator from "@/components/mandala-generator"
import { motion } from "framer-motion"
import { Play, Pause, Download, Share2, ArrowLeft, Star } from "lucide-react"

export default function ResultadoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { readings } = useAppContext()
  const [reading, setReading] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("leitura")
  const [sections, setSections] = useState<string[]>([])
  const [currentSection, setCurrentSection] = useState(0)

  // Obtém o ID da leitura da URL
  const readingId = searchParams.get("id")

  // Carrega a leitura do histórico
  useEffect(() => {
    if (readingId) {
      // Encontra a leitura mais recente (que acabou de ser criada)
      const foundReading = readings[readings.length - 1]
      if (foundReading) {
        setReading(foundReading)

        // Divide o texto em seções
        const parts = foundReading.reading
          .split(/\n\s*\n|\n#+\s+/)
          .filter((section: string) => section.trim().length > 0)
          .map((section: string) => section.trim())

        setSections(parts)
      }
    }
  }, [readingId, readings])

  // Controles de áudio
  const toggleAudio = () => {
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.pause()
      } else {
        const utterance = new SpeechSynthesisUtterance(reading?.reading)
        utterance.lang = "pt-BR"
        utterance.rate = 0.9
        utterance.pitch = 1.1
        window.speechSynthesis.speak(utterance)
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Compartilhar leitura
  const shareReading = () => {
    if (navigator.share && reading) {
      navigator
        .share({
          title: "Minha Leitura Mística - A CAIXA",
          text: `Minha pergunta: ${reading.question}\n\nResposta do oráculo: ${reading.reading.substring(0, 100)}...`,
          url: window.location.href,
        })
        .catch((error) => console.log("Erro ao compartilhar:", error))
    }
  }

  // Avança para a próxima seção
  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  // Volta para a seção anterior
  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  if (!reading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 pt-16 pb-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff]">
        <MobileNavbar />
        <ParticleBackground />
        <div className="text-center">
          <p>Carregando sua leitura...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-16 pb-20 bg-gradient-radial from-[#1d002b] to-[#36005d] bg-fixed bg-cover text-[#e6e0ff]">
      <MobileNavbar />
      <ParticleBackground />

      <div className="w-full max-w-md mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/mobile")}
          className="text-[#e6d8ff] hover:bg-white/10 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>

        <h1 className="text-2xl font-bold text-center mb-2">Sua Leitura Mística</h1>
        <p className="text-center text-[#ff9be2] mb-4">As pedras revelaram seu destino...</p>
      </div>

      {/* Mandala */}
      <div className="w-full max-w-md flex justify-center mb-6">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ animationDuration: "120s" }}>
            <MandalaGenerator params={reading.mandalaParams} size={256} className="rounded-full" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-md mb-4">
        <div className="flex border-b border-white/20">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "leitura" ? "border-b-2 border-[#ff9be2] text-[#ff9be2]" : "text-white/70"
            }`}
            onClick={() => setActiveTab("leitura")}
          >
            Leitura
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "audio" ? "border-b-2 border-[#ff9be2] text-[#ff9be2]" : "text-white/70"
            }`}
            onClick={() => setActiveTab("audio")}
          >
            Áudio
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "compartilhar" ? "border-b-2 border-[#ff9be2] text-[#ff9be2]" : "text-white/70"
            }`}
            onClick={() => setActiveTab("compartilhar")}
          >
            Compartilhar
          </button>
        </div>
      </div>

      {/* Conteúdo da tab ativa */}
      <div className="w-full max-w-md">
        {activeTab === "leitura" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
          >
            <div className="h-[300px] overflow-y-auto">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="prose prose-invert max-w-none">
                  {sections[currentSection] && (
                    <div dangerouslySetInnerHTML={{ __html: sections[currentSection].replace(/\n/g, "<br />") }} />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Navegação entre seções */}
            <div className="flex justify-between mt-4">
              <Button
                onClick={prevSection}
                disabled={currentSection === 0}
                variant="outline"
                className="bg-white/5 border-white/20 hover:bg-white/10 disabled:opacity-50"
              >
                Anterior
              </Button>
              <span className="text-white/70 flex items-center">
                {currentSection + 1} / {sections.length}
              </span>
              <Button
                onClick={nextSection}
                disabled={currentSection === sections.length - 1}
                variant="outline"
                className="bg-white/5 border-white/20 hover:bg-white/10 disabled:opacity-50"
              >
                Próximo
              </Button>
            </div>
          </motion.div>
        )}

        {activeTab === "audio" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col items-center"
          >
            <div className="w-32 h-32 rounded-full bg-[#8e2de2]/20 flex items-center justify-center mb-6">
              {isPlaying ? (
                <Pause className="w-12 h-12 text-[#ff9be2]" />
              ) : (
                <Play className="w-12 h-12 text-[#ff9be2]" />
              )}
            </div>

            <p className="text-center mb-6">Ouça sua leitura mística narrada com uma voz suave e envolvente.</p>

            <Button onClick={toggleAudio} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white px-6 py-2 rounded-full">
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" /> Pausar Narração
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" /> Iniciar Narração
                </>
              )}
            </Button>
          </motion.div>
        )}

        {activeTab === "compartilhar" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 mb-6">
                <MandalaGenerator params={reading.mandalaParams} size={128} className="rounded-full" />
              </div>

              <h3 className="text-lg font-bold mb-2">Compartilhe sua leitura</h3>
              <p className="text-center mb-6">Compartilhe sua experiência mística com amigos e familiares.</p>

              <div className="flex flex-col gap-3 w-full">
                <Button onClick={shareReading} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white">
                  <Share2 className="w-4 h-4 mr-2" /> Compartilhar Leitura
                </Button>

                <Button
                  variant="outline"
                  className="bg-white/5 border-white/20 hover:bg-white/10"
                  onClick={() => {
                    // Lógica para download da leitura como PDF seria implementada aqui
                    alert("Funcionalidade de download será implementada em breve!")
                  }}
                >
                  <Download className="w-4 h-4 mr-2" /> Salvar como PDF
                </Button>

                <Button
                  variant="outline"
                  className="bg-white/5 border-white/20 hover:bg-white/10"
                  onClick={() => router.push("/mobile")}
                >
                  <Star className="w-4 h-4 mr-2" /> Nova Leitura
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
