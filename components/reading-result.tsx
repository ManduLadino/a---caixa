"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { HolographicCard } from "@/components/ui/holographic-card"
import { MandalaGenerator } from "@/components/mandala-generator"
import { Play, Pause, Download, Share2 } from "lucide-react"
import { motion } from "framer-motion"

interface ReadingResultProps {
  reading: string
  mandalaParams: any
  onClose: () => void
}

export default function ReadingResult({ reading, mandalaParams, onClose }: ReadingResultProps) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [sections, setSections] = useState<string[]>([])
  const [currentSection, setCurrentSection] = useState(0)
  const [audioReady, setAudioReady] = useState(false)

  // Divide a leitura em seções
  useEffect(() => {
    // Divide o texto em seções baseadas em linhas vazias ou títulos
    const parts = reading
      .split(/\n\s*\n|\n#+\s+/)
      .filter((section) => section.trim().length > 0)
      .map((section) => section.trim())

    setSections(parts)
  }, [reading])

  // Gera o áudio da leitura
  useEffect(() => {
    const generateAudio = async () => {
      try {
        // Verifica se a Web Speech API está disponível
        if ("speechSynthesis" in window) {
          console.log("Web Speech API disponível, gerando áudio...")

          // Certifique-se de que as vozes estão carregadas
          if (window.speechSynthesis.getVoices().length === 0) {
            // Se as vozes ainda não estiverem carregadas, aguarde o evento voiceschanged
            await new Promise<void>((resolve) => {
              window.speechSynthesis.onvoiceschanged = () => resolve()
              // Timeout para evitar espera infinita
              setTimeout(() => resolve(), 1000)
            })
          }

          const utterance = new SpeechSynthesisUtterance(reading)

          // Tenta encontrar uma voz feminina em português
          const voices = window.speechSynthesis.getVoices()
          console.log(
            "Vozes disponíveis:",
            voices.map((v) => v.name),
          )

          const femaleVoice = voices.find(
            (voice) =>
              voice.name.includes("female") ||
              voice.name.includes("Feminina") ||
              voice.name.includes("Luciana") ||
              (voice.lang.includes("pt") && voice.name.includes("Google")),
          )

          if (femaleVoice) {
            console.log("Voz feminina encontrada:", femaleVoice.name)
            utterance.voice = femaleVoice
          } else {
            console.log("Nenhuma voz feminina encontrada, usando voz padrão")
          }

          utterance.lang = "pt-BR"
          utterance.rate = 0.9 // Velocidade um pouco mais lenta
          utterance.pitch = 1.1 // Tom um pouco mais alto (feminino)

          // Armazena a utterance para uso posterior
          window.speechSynthesis.cancel() // Limpa qualquer fala anterior
          window.speechSynthesisUtterance = utterance

          setAudioReady(true)
          setAudioSrc("speech-synthesis")
          console.log("Áudio pronto para reprodução")
        } else {
          console.log("Web Speech API não suportada neste navegador")
          // Cria um áudio alternativo simples
          const audioContext = new AudioContext()
          const oscillator = audioContext.createOscillator()
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // nota A4

          const gainNode = audioContext.createGain()
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          // Cria um buffer de áudio de 1 segundo
          const buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate)
          const data = buffer.getChannelData(0)

          // Preenche o buffer com uma onda senoidal
          for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.sin((2 * Math.PI * 440 * i) / audioContext.sampleRate)
          }

          // Cria um blob de áudio
          const source = audioContext.createBufferSource()
          source.buffer = buffer

          // Cria um URL para o áudio
          const blob = new Blob([buffer], { type: "audio/wav" })
          const url = URL.createObjectURL(blob)

          setAudioSrc(url)
          setAudioReady(true)
        }
      } catch (error) {
        console.error("Erro ao gerar áudio:", error)
        // Mesmo com erro, permitimos que o usuário tente reproduzir
        setAudioReady(true)
      }
    }

    generateAudio()
  }, [reading])

  // Controles de áudio
  const toggleAudio = () => {
    console.log("Toggle áudio chamado, fonte:", audioSrc, "isPlaying:", isPlaying)

    if (audioSrc === "speech-synthesis") {
      if (isPlaying) {
        console.log("Pausando síntese de fala")
        window.speechSynthesis.pause()
        setIsPlaying(false)
      } else {
        console.log("Iniciando síntese de fala")
        if (window.speechSynthesisUtterance) {
          try {
            window.speechSynthesis.speak(window.speechSynthesisUtterance)
            setIsPlaying(true)
          } catch (error) {
            console.error("Erro ao iniciar síntese de fala:", error)
          }
        }
      }
    } else if (audioRef.current && audioSrc) {
      if (isPlaying) {
        console.log("Pausando áudio")
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        console.log("Iniciando áudio")
        audioRef.current
          .play()
          .then(() => {
            console.log("Áudio iniciado com sucesso")
            setIsPlaying(true)
          })
          .catch((error) => {
            console.error("Erro ao iniciar áudio:", error)
            // Tenta novamente com interação do usuário
            alert("Clique OK para permitir a reprodução de áudio")
            audioRef.current
              ?.play()
              .then(() => setIsPlaying(true))
              .catch((e) => console.error("Falha na segunda tentativa:", e))
          })
      }
    } else {
      console.log("Nenhuma fonte de áudio disponível")
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

  // Compartilhar leitura
  const shareReading = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Minha Leitura Mística - A CAIXA",
          text: "Confira minha leitura mística gerada por A CAIXA, o oráculo digital com IA!",
          url: window.location.href,
        })
        .catch((error) => console.log("Erro ao compartilhar:", error))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl"
      >
        <HolographicCard className="relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            ✕
          </button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#e6d8ff] mb-2">Sua Leitura Mística</h2>
            <p className="text-[#ff9be2]">As pedras revelaram seu destino...</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Mandala */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-64 h-64 mb-4">
                <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ animationDuration: "120s" }}>
                  <MandalaGenerator
                    params={mandalaParams}
                    size={256}
                    className="rounded-full"
                    animate={true}
                    highQuality={true}
                  />
                </div>
              </div>

              {/* Controles de áudio */}
              <div className="flex flex-col items-center mt-4">
                {audioSrc && audioSrc !== "speech-synthesis" && (
                  <audio
                    ref={audioRef}
                    src={audioSrc}
                    onEnded={() => setIsPlaying(false)}
                    onError={(e) => console.error("Erro no elemento de áudio:", e)}
                  />
                )}
                <Button
                  onClick={toggleAudio}
                  disabled={!audioReady}
                  className={`rounded-full w-12 h-12 flex items-center justify-center mb-2 ${
                    audioReady ? "bg-[#8e2de2] hover:bg-[#a100f5] text-white" : "bg-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                <p className="text-sm text-white/70">{audioReady ? "Ouvir leitura" : "Preparando áudio..."}</p>
              </div>
            </div>

            {/* Texto da leitura */}
            <div className="flex-grow">
              <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10 h-[400px] overflow-y-auto">
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
                  className="bg-white/5 border border-white/20 hover:bg-white/10 disabled:opacity-50"
                >
                  Anterior
                </Button>
                <span className="text-white/70">
                  {currentSection + 1} de {sections.length}
                </span>
                <Button
                  onClick={nextSection}
                  disabled={currentSection === sections.length - 1}
                  variant="outline"
                  className="bg-white/5 border border-white/20 hover:bg-white/10 disabled:opacity-50"
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={shareReading}
              className="bg-[#6a1fc7] hover:bg-[#8e2de2] text-white px-6 py-2 rounded-full"
            >
              <Share2 className="w-4 h-4 mr-2" /> Compartilhar
            </Button>
            <Button
              onClick={() => {
                // Implementação básica de exportação para PDF
                const content = document.createElement("div")
                content.innerHTML = `
                  <h1 style="text-align: center; color: #8e2de2;">Leitura Mística - A CAIXA</h1>
                  <div style="white-space: pre-line; margin: 20px 0;">${reading}</div>
                  <p style="text-align: center; font-style: italic; color: #666;">Gerado por A CAIXA - Oráculo Digital com IA</p>
                `

                const printWindow = window.open("", "_blank")
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Leitura Mística - A CAIXA</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 20px; }
                          h1 { color: #8e2de2; }
                        </style>
                      </head>
                      <body>
                        ${content.innerHTML}
                        <script>
                          setTimeout(() => { window.print(); }, 500);
                        </script>
                      </body>
                    </html>
                  `)
                  printWindow.document.close()
                } else {
                  alert("Seu navegador bloqueou a janela pop-up. Por favor, permita pop-ups para este site.")
                }
              }}
              className="bg-[#8e2de2] hover:bg-[#a100f5] text-white px-6 py-2 rounded-full"
            >
              <Download className="w-4 h-4 mr-2" /> Salvar como PDF
            </Button>
          </div>
        </HolographicCard>
      </motion.div>
    </div>
  )
}
