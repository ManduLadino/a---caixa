"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles, Wand2, Camera, Volume2, Download, Mic, MicOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { stonePrompts } from "@/lib/stone-prompts"
import { MandalaGenerator } from "@/components/mandala-generator"

// Importe as funções de cache no topo do arquivo, junto com os outros imports
import { generateAudioHash, findTranscriptionInCache, addTranscriptionToCache } from "@/lib/audio-cache"

// Define os 33 tipos de pedras com suas cores e propriedades
const stoneTypes = Object.keys(stonePrompts).map((key) => {
  const stone = stonePrompts[key]

  // Adiciona variações de cores para cada tipo de pedra para mais realismo
  const baseColor = stone.color
  const colorVariations = generateColorVariations(baseColor, 3)

  return {
    id: key,
    color: baseColor,
    colorVariations: colorVariations,
    sizes: [15, 18, 22, 25, 28], // Mais variação de tamanhos
    name: stone.name,
    energy: 85, // Energia padrão
    texture: Math.floor(Math.random() * 5) + 1, // Textura aleatória (1-5)
  }
})

// Função para gerar variações de cores para mais realismo
function generateColorVariations(baseColor: string, count: number): string[] {
  const variations: string[] = [baseColor]

  // Converte a cor hex para RGB
  const r = Number.parseInt(baseColor.slice(1, 3), 16)
  const g = Number.parseInt(baseColor.slice(3, 5), 16)
  const b = Number.parseInt(baseColor.slice(5, 7), 16)

  for (let i = 0; i < count; i++) {
    // Cria variações sutis da cor base
    const variation = `#${Math.max(0, Math.min(255, r + Math.floor(Math.random() * 30) - 15))
      .toString(16)
      .padStart(2, "0")}${Math.max(0, Math.min(255, g + Math.floor(Math.random() * 30) - 15))
      .toString(16)
      .padStart(2, "0")}${Math.max(0, Math.min(255, b + Math.floor(Math.random() * 30) - 15))
      .toString(16)
      .padStart(2, "0")}`

    variations.push(variation)
  }

  return variations
}

// Interface para as pedras
interface Stone {
  id: string
  type: string
  x: number
  y: number
  size: number
  rotation: number
  color: string
  colorVariations: string[]
  selected: boolean
  energy: number
  glowColor: string
  texture: number
  shape: number // Forma irregular (1-5)
  roughness: number // Rugosidade (0-1)
  shine: number // Brilho (0-1)
  opacity: number // Opacidade (0.7-1)
}

// Leitura mística padrão para fallback
const defaultReading = `
# Leitura Mística das Pedras

## Passado
As pedras revelam um caminho de aprendizado e crescimento. Você passou por desafios que fortaleceram sua essência espiritual. As energias das pedras mostram que você carrega sabedoria de experiências passadas.

## Presente
Neste momento, você está em um período de transformação. As pedras indicam que há energias positivas ao seu redor, apoiando suas decisões. É um momento para confiar em sua intuição e seguir em frente com confiança.

## Futuro
O futuro se mostra promissor, com novas oportunidades surgindo em seu caminho. As pedras sugerem que mantendo o equilíbrio entre mente, corpo e espírito, você encontrará harmonia e realização em sua jornada.

Lembre-se que você é o criador do seu próprio destino, e as pedras apenas iluminam o caminho que você escolher seguir.
`

// Parâmetros padrão para a mandala
const defaultMandalaParams = {
  colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
  layers: 5,
  shape: "circle",
  complexity: 7,
  symbols: ["estrela", "espiral", "lua"],
}

export default function VirtualStoneBox() {
  const [stones, setStones] = useState<Stone[]>([])
  const [selectedStoneType, setSelectedStoneType] = useState(stoneTypes[0])
  const [isDragging, setIsDragging] = useState(false)
  const [currentStone, setCurrentStone] = useState<Stone | null>(null)
  const [showExample, setShowExample] = useState(false)
  const [is3DMode, setIs3DMode] = useState(false)
  const [energyMode, setEnergyMode] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [audioQuestion, setAudioQuestion] = useState<string | null>(null)
  const [transcribedText, setTranscribedText] = useState<string>("")
  const boxRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<BlobPart[]>([])
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 })
  const [readingResult, setReadingResult] = useState<string>("")
  const [mandalaParams, setMandalaParams] = useState<any>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const [question, setQuestion] = useState<string>("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [realisticMode, setRealisticMode] = useState(true) // Modo realista ativado por padrão
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [speechRecognitionUsed, setSpeechRecognitionUsed] = useState(false)
  const [isCapturingImage, setIsCapturingImage] = useState(false)
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState(false)
  const [speechRecognitionError, setSpeechRecognitionError] = useState<string | null>(null)

  const [speechRecognitionSetup, setSpeechRecognitionSetup] = useState(false)
  const [transcriptionInProgress, setTranscriptionInProgress] = useState(false)
  // Adicione um novo estado para rastrear quando uma transcrição vem do cache
  const [transcriptionFromCache, setTranscriptionFromCache] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechRecognitionAvailable("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    }
  }, [])

  // Update box size on resize
  useEffect(() => {
    if (!boxRef.current) return

    const updateSize = () => {
      if (boxRef.current) {
        const { width, height } = boxRef.current.getBoundingClientRect()
        setBoxSize({ width, height })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Generate a random stone of the selected type with realistic properties
  const generateStone = (x: number, y: number) => {
    const size = selectedStoneType.sizes[Math.floor(Math.random() * selectedStoneType.sizes.length)]
    const energy = selectedStoneType.energy + (Math.random() * 20 - 10) // Variação de energia
    const glowColors = ["#ff9be2", "#c774f0", "#8e2de2", "#6a1fc7", "#36005d"]
    const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)]

    // Propriedades realistas
    const colorVariations = selectedStoneType.colorVariations || [selectedStoneType.color]
    const shape = Math.floor(Math.random() * 5) + 1 // 1-5 formas irregulares
    const roughness = Math.random() * 0.5 + 0.3 // 0.3-0.8 rugosidade
    const shine = Math.random() * 0.7 // 0-0.7 brilho
    const opacity = Math.random() * 0.3 + 0.7 // 0.7-1.0 opacidade
    const texture = Math.floor(Math.random() * 5) + 1 // 1-5 texturas

    return {
      id: `stone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: selectedStoneType.id,
      x,
      y,
      size,
      rotation: Math.random() * 360,
      color: selectedStoneType.color,
      colorVariations: colorVariations,
      selected: false,
      energy,
      glowColor,
      texture,
      shape,
      roughness,
      shine,
      opacity,
    }
  }

  // Add a stone at the specified position
  const addStone = (x: number, y: number) => {
    const newStone = generateStone(x, y)
    setStones((prevStones) => [...prevStones, newStone])
  }

  // Handle mouse down on the box
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!boxRef.current || isScanning || scanComplete) return

    const rect = boxRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked on an existing stone
    const clickedStone = stones.find((stone) => {
      const dx = stone.x - x
      const dy = stone.y - y
      return Math.sqrt(dx * dx + dy * dy) < stone.size / 2
    })

    if (clickedStone) {
      // Select the stone for dragging
      setCurrentStone(clickedStone)
      setIsDragging(true)
      setStones((prevStones) =>
        prevStones.map((stone) => ({
          ...stone,
          selected: stone.id === clickedStone.id,
        })),
      )
    } else {
      // Add a new stone
      addStone(x, y)
    }
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !currentStone || !boxRef.current || isScanning || scanComplete) return

    const rect = boxRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setStones((prevStones) =>
      prevStones.map((stone) =>
        stone.id === currentStone.id
          ? {
              ...stone,
              x,
              y,
            }
          : stone,
      ),
    )
  }

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false)
    setCurrentStone(null)
  }

  // Clear all stones
  const clearStones = () => {
    setStones([])
    setScanComplete(false)
    setAudioGenerated(false)
    setReadingResult("")
    setMandalaParams(null)
    setVideoUrl(null)
    setAudioQuestion(null)
    setTranscribedText("")
  }

  // Modifique a função randomizeStones para criar padrões mais dinâmicos e realistas
  const randomizeStones = () => {
    if (!boxRef.current) return

    const { width, height } = boxRef.current.getBoundingClientRect()
    const newStones: Stone[] = []

    // Escolhe um padrão aleatório para as pedras
    const pattern = Math.floor(Math.random() * 5)

    // Gera exatamente 33 pedras em diferentes padrões
    for (let i = 0; i < 33; i++) {
      const stoneType = stoneTypes[Math.floor(Math.random() * stoneTypes.length)]
      const size = stoneType.sizes[Math.floor(Math.random() * stoneType.sizes.length)]
      const energy = stoneType.energy + (Math.random() * 20 - 10) // Variação de energia
      const glowColors = ["#ff9be2", "#c774f0", "#8e2de2", "#6a1fc7", "#36005d"]
      const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)]

      // Propriedades realistas
      const colorVariations = stoneType.colorVariations || [stoneType.color]
      const shape = Math.floor(Math.random() * 5) + 1 // 1-5 formas irregulares
      const roughness = Math.random() * 0.5 + 0.3 // 0.3-0.8 rugosidade
      const shine = Math.random() * 0.7 // 0-0.7 brilho
      const opacity = Math.random() * 0.3 + 0.7 // 0.7-1.0 opacidade
      const texture = Math.floor(Math.random() * 5) + 1 // 1-5 texturas

      let x, y

      // Diferentes padrões de distribuição
      switch (pattern) {
        case 0: // Padrão circular
          const angle = (i / 33) * Math.PI * 2
          const radius = Math.min(width, height) * 0.4 * Math.random()
          x = width / 2 + Math.cos(angle) * radius
          y = height / 2 + Math.sin(angle) * radius
          break
        case 1: // Padrão em espiral
          const spiralAngle = (i / 33) * Math.PI * 10
          const spiralRadius = (i / 33) * Math.min(width, height) * 0.4
          x = width / 2 + Math.cos(spiralAngle) * spiralRadius
          y = height / 2 + Math.sin(spiralAngle) * spiralRadius
          break
        case 2: // Padrão em linhas
          const rows = 5
          const cols = 7
          const row = Math.floor(i / cols)
          const col = i % cols
          x = (col + 1) * (width / (cols + 1)) + (Math.random() * 20 - 10)
          y = (row + 1) * (height / (rows + 1)) + (Math.random() * 20 - 10)
          break
        case 3: // Padrão em grupos
          const groupCount = 4
          const groupIndex = Math.floor(i / (33 / groupCount))
          const groupX = (groupIndex % 2) * width * 0.6 + width * 0.2
          const groupY = Math.floor(groupIndex / 2) * height * 0.6 + height * 0.2
          x = groupX + (Math.random() * 80 - 40)
          y = groupY + (Math.random() * 80 - 40)
          break
        default: // Padrão aleatório
          x = Math.random() * (width - size) + size / 2
          y = Math.random() * (height - size) + size / 2
      }

      // Garante que as pedras estão dentro dos limites da caixa
      x = Math.max(size / 2, Math.min(width - size / 2, x))
      y = Math.max(size / 2, Math.min(height - size / 2, y))

      newStones.push({
        id: `stone-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        type: stoneType.id,
        x,
        y,
        size,
        rotation: Math.random() * 360,
        color: stoneType.color,
        colorVariations: colorVariations,
        selected: false,
        energy,
        glowColor,
        texture,
        shape,
        roughness,
        shine,
        opacity,
      })
    }

    setStones(newStones)
    setScanComplete(false)
    setAudioGenerated(false)
    setReadingResult("")
    setMandalaParams(null)
    setVideoUrl(null)
  }

  // Adicione uma animação de sacudir mais dinâmica
  const shakeStones = () => {
    setIsScanning(true)

    // Animação de sacudir
    const shakeDuration = 1500
    const startTime = Date.now()

    const shake = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / shakeDuration, 1)

      if (progress < 1) {
        // Aplica movimento aleatório às pedras durante a animação
        setStones((prevStones) =>
          prevStones.map((stone) => ({
            ...stone,
            x: stone.x + (Math.random() * 10 - 5) * (1 - progress),
            y: stone.y + (Math.random() * 10 - 5) * (1 - progress),
            rotation: stone.rotation + (Math.random() * 20 - 10) * (1 - progress),
          })),
        )

        requestAnimationFrame(shake)
      } else {
        // Quando a animação terminar, randomiza as pedras
        randomizeStones()
        setIsScanning(false)
      }
    }

    requestAnimationFrame(shake)
  }

  // Toggle example image
  const toggleExample = () => {
    setShowExample(!showExample)
  }

  // Toggle 3D mode
  const toggle3DMode = () => {
    setIs3DMode(!is3DMode)
  }

  // Toggle energy mode
  const toggleEnergyMode = () => {
    setEnergyMode(!energyMode)
  }

  // Toggle realistic mode
  const toggleRealisticMode = () => {
    setRealisticMode(!realisticMode)
  }

  // Iniciar gravação de áudio para a pergunta
  const startAudioRecording = useCallback(async () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    let recognitionInstance: any = null

    // Setup speech recognition if available and not already setup
    if (speechRecognitionAvailable && !speechRecognitionSetup) {
      recognitionInstance = new SpeechRecognition()
      recognitionInstance.lang = "pt-BR"
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscribedText(transcript)
        setAudioQuestion(transcript)
        setQuestion(transcript)
        setIsSpeechRecognitionActive(false)
        setSpeechRecognitionError(null)
      }

      recognitionInstance.onstart = () => {
        setIsSpeechRecognitionActive(true)
        setSpeechRecognitionError(null)
      }

      recognitionInstance.onend = () => {
        setIsSpeechRecognitionActive(false)
        setSpeechRecognitionError(null)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("Erro no reconhecimento de voz:", event.error)
        setTranscribedText("Não foi possível reconhecer o áudio. Por favor, digite sua pergunta.")
        setIsSpeechRecognitionActive(false)
        setSpeechRecognitionError("Não foi possível reconhecer o áudio.")
      }

      setRecognition(recognitionInstance)
      setSpeechRecognitionSetup(true)
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(newStream)
      const mediaRecorder = new MediaRecorder(newStream)
      audioRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Modifique a função mediaRecorder.onstop no método startAudioRecording
      // Substitua o trecho que processa o áudio pelo seguinte:

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          const audioUrl = URL.createObjectURL(audioBlob)

          // Reproduz o áudio gravado
          if (audioRef.current) {
            audioRef.current.src = audioUrl
          }

          // Function to use Web Speech API as fallback
          const useSpeechRecognition = () => {
            if (recognition) {
              recognition.start()
            } else {
              setTranscribedText("Reconhecimento de voz não suportado. Por favor, digite sua pergunta.")
              setSpeechRecognitionError("Reconhecimento de voz não suportado.")
            }
          }

          try {
            setTranscriptionInProgress(true)

            // Gera um hash do áudio para verificar no cache
            const audioHash = await generateAudioHash(audioBlob)

            // Verifica se já existe uma transcrição no cache
            const cachedTranscription = findTranscriptionInCache(audioHash)

            if (cachedTranscription) {
              console.log("Usando transcrição em cache")
              setTranscribedText(cachedTranscription)
              setAudioQuestion(cachedTranscription)
              setQuestion(cachedTranscription)
              setSpeechRecognitionError(null)
              setTranscriptionFromCache(true) // Indica que veio do cache
            } else {
              // Quando não usar o cache, defina como false
              setTranscriptionFromCache(false)

              // Se não estiver em cache, faz a chamada à API
              console.log("Transcrição não encontrada em cache, chamando API")

              // Tenta usar a API de transcrição
              const formData = new FormData()
              formData.append("audio", audioBlob, "question.webm")

              const response = await fetch("/api/transcribe-audio", {
                method: "POST",
                body: formData,
              })

              // Verifica se a resposta é válida antes de tentar fazer o parse
              if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
              }

              // Tenta fazer o parse do JSON com tratamento de erro
              let data
              try {
                const text = await response.text()
                data = JSON.parse(text)
              } catch (parseError) {
                console.error("Erro ao analisar resposta JSON:", parseError)
                throw new Error("Formato de resposta inválido")
              }

              if (data && data.text) {
                // Adiciona a transcrição ao cache
                addTranscriptionToCache(audioHash, data.text)

                setTranscribedText(data.text)
                setAudioQuestion(data.text)
                setQuestion(data.text)
                setSpeechRecognitionError(null)
              } else {
                // Se não houver texto, tenta usar o reconhecimento de voz do navegador
                useSpeechRecognition()
              }
            }
          } catch (error) {
            console.error("Erro ao transcrever áudio:", error)
            // Tenta usar o reconhecimento de voz do navegador como fallback
            useSpeechRecognition()
          } finally {
            setTranscriptionInProgress(false)
          }
        } catch (error) {
          console.error("Erro ao processar áudio:", error)
          setTranscribedText("Erro ao processar áudio. Por favor, digite sua pergunta.")
          setSpeechRecognitionError("Erro ao processar áudio.")
        } finally {
          // Limpa as faixas do stream
          if (newStream) {
            newStream.getTracks().forEach((track) => track.stop())
          }
          setIsRecordingAudio(false)
        }
      }

      // Inicia a gravação
      mediaRecorder.start()
      setIsRecordingAudio(true)
      setSpeechRecognitionError(null)
    } catch (error) {
      console.error("Erro ao iniciar gravação de áudio:", error)
      alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.")
      setIsRecordingAudio(false)
      setSpeechRecognitionError("Não foi possível acessar o microfone.")
    }
  }, [speechRecognitionAvailable, recognition, speechRecognitionSetup])

  // Parar gravação de áudio
  const stopAudioRecording = useCallback(() => {
    if (audioRecorderRef.current && isRecordingAudio) {
      audioRecorderRef.current.stop()
    }

    if (recognition) {
      recognition.stop()
    }
  }, [isRecordingAudio, recognition])

  // Scan the stones and generate a reading
  const scanStones = async () => {
    if (stones.length === 0) {
      alert("Adicione pedras à caixa antes de escanear.")
      return
    }

    setIsScanning(true)

    try {
      // Obtém os tipos de pedras da caixa virtual
      const stoneTypes = stones.map((stone) => stone.type)

      // Obtém as posições das pedras para análise
      const stonePositions = stones.map((stone) => ({
        type: stone.type,
        x: stone.x,
        y: stone.y,
        size: stone.size,
        rotation: stone.rotation,
      }))

      // Create a request body with all necessary information
      const requestBody = {
        name: "Usuário da Caixa Virtual",
        birthDate: new Date().toISOString().split("T")[0],
        question: question || audioQuestion || "O que as pedras revelam sobre meu caminho?",
        stoneTypes: stoneTypes,
        stonePositions: stonePositions,
        timestamp: Date.now(),
        uniqueId: Math.random().toString(36).substring(2, 15),
      }

      console.log("Enviando dados para a API:", JSON.stringify(requestBody))

      // Make the API call with improved error handling
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      // Check if the response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Erro na resposta da API: ${response.status} ${response.statusText}`, errorText)
        throw new Error(`Falha ao gerar a leitura: ${response.status}`)
      }

      // Parse the response
      const responseText = await response.text()
      let chatData

      try {
        chatData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Erro ao analisar resposta JSON:", parseError)
        console.error("Texto da resposta:", responseText)
        // Use default reading in case of parsing error
        chatData = { reply: defaultReading }
      }

      const reading = chatData.reply || defaultReading
      setReadingResult(reading)

      // Generate mandala parameters
      try {
        const mandalaResponse = await fetch("/api/generate-mandala", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reading,
            timestamp: Date.now(),
          }),
        })

        if (!mandalaResponse.ok) {
          throw new Error(`Falha ao gerar parâmetros da mandala: ${mandalaResponse.status}`)
        }

        const mandalaData = await mandalaResponse.json()
        setMandalaParams(mandalaData.params || defaultMandalaParams)
      } catch (mandalaError) {
        console.error("Erro ao gerar mandala:", mandalaError)
        setMandalaParams(defaultMandalaParams)
      }

      setScanComplete(true)
    } catch (error) {
      console.error("Erro ao processar a leitura:", error)
      // Set default reading and mandala parameters
      setReadingResult(defaultReading)
      setMandalaParams(defaultMandalaParams)
      setScanComplete(true)
      alert(
        "Ocorreu um erro ao processar a leitura, mas estamos usando uma leitura padrão para você continuar a experiência.",
      )
    } finally {
      setIsScanning(false)
    }
  }

  // Gera o áudio da leitura
  const generateAudio = async () => {
    if (!readingResult) return

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

        const utterance = new SpeechSynthesisUtterance(readingResult)

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
        ;(window as any).speechSynthesisUtterance = utterance

        setAudioGenerated(true)
        console.log("Áudio pronto para reprodução")
      } else {
        console.log("Web Speech API não suportada neste navegador")
        // Cria um áudio alternativo simples
        try {
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

          // Cria um blob de áudio e um URL para ele
          const audioBlob = new Blob([buffer], { type: "audio/wav" })
          const audioUrl = URL.createObjectURL(audioBlob)

          if (audioRef.current) {
            audioRef.current.src = audioUrl
          }

          setAudioGenerated(true)
        } catch (audioError) {
          console.error("Erro ao criar áudio alternativo:", audioError)
          // Mesmo com erro, permitimos que o usuário continue
          setAudioGenerated(true)
        }
      }
    } catch (error) {
      console.error("Erro ao gerar áudio:", error)
      // Set audio as generated anyway to allow user to proceed
      setAudioGenerated(true)
      alert("Não foi possível gerar o áudio, mas você pode continuar com a experiência.")
    }
  }

  // Controla a reprodução do áudio
  const toggleAudio = () => {
    if (!audioGenerated) return

    if (isPlaying) {
      window.speechSynthesis.pause()
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      if ((window as any).speechSynthesisUtterance) {
        try {
          window.speechSynthesis.speak((window as any).speechSynthesisUtterance)
          setIsPlaying(true)
        } catch (error) {
          console.error("Erro ao iniciar síntese de fala:", error)
          // Tenta reproduzir o áudio alternativo
          if (audioRef.current) {
            audioRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch((e) => console.error("Erro ao reproduzir áudio alternativo:", e))
          }
        }
      } else if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Erro ao iniciar áudio:", error)
            alert("Clique OK para permitir a reprodução de áudio")
            audioRef.current
              ?.play()
              .then(() => setIsPlaying(true))
              .catch((e) => console.error("Falha na segunda tentativa:", e))
          })
      }
    }
  }

  // Inicia a gravação de vídeo
  const startRecording = async () => {
    if (!boxRef.current) return

    try {
      setIsCapturingImage(true)
      // Em vez de tentar capturar a tela, vamos capturar apenas o conteúdo do canvas
      const canvas = document.createElement("canvas")
      const box = boxRef.current
      const { width, height } = box.getBoundingClientRect()

      canvas.width = width
      canvas.height = height

      // Use html2canvas ou uma abordagem similar para capturar o conteúdo
      // Por enquanto, vamos apenas criar uma imagem simples
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Desenha um fundo
        ctx.fillStyle = "#f5f5f0"
        ctx.fillRect(0, 0, width, height)

        // Desenha as pedras
        stones.forEach((stone) => {
          ctx.beginPath()
          ctx.arc(stone.x, stone.y, stone.size / 2, 0, Math.PI * 2)
          ctx.fillStyle = stone.color
          ctx.fill()
        })

        // Converte o canvas para uma URL de dados
        const dataUrl = canvas.toDataURL("image/png")
        setVideoUrl(dataUrl)
      }

      setIsRecording(false)
      setIsCapturingImage(false)

      alert('Captura concluída! Você pode baixar a imagem usando o botão "Baixar Imagem".')
    } catch (error) {
      console.error("Erro ao capturar imagem:", error)
      alert("Não foi possível capturar a imagem. Tente novamente mais tarde.")
      setIsRecording(false)
      setIsCapturingImage(false)
    }
  }

  // Substitua a função exportAsMP4 por esta versão
  const exportAsMP4 = () => {
    if (!scanComplete) {
      alert("Primeiro escaneie as pedras.")
      return
    }

    if (videoUrl) {
      // Se já temos uma imagem capturada, oferece para download
      const a = document.createElement("a")
      a.href = videoUrl
      a.download = `leitura-mistica-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      // Oferece para iniciar captura
      if (confirm("Deseja capturar uma imagem da sua caixa de pedras?")) {
        startRecording()
      }
    }
  }

  // Função para renderizar uma pedra com aparência realista
  const renderRealisticStone = (stone: Stone) => {
    // Determina a forma da pedra com base no valor shape
    let clipPath = ""
    switch (stone.shape) {
      case 1:
        clipPath = "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
        break
      case 2:
        clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
        break
      case 3:
        clipPath = "polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)"
        break
      case 4:
        clipPath = "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
        break
      default:
        clipPath = "circle(50% at 50% 50%)"
    }

    // Cores para o gradiente
    const mainColor = stone.color
    const secondaryColor = stone.colorVariations[Math.floor(Math.random() * stone.colorVariations.length)]

    // Cria um estilo de gradiente para a pedra
    const gradientStyle = {
      background: `radial-gradient(circle at 30% 30%, ${mainColor} 0%, ${mainColor} 60%, ${secondaryColor} 100%)`,
    }

    return (
      <>
        {/* Base da pedra */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: `${stone.x - stone.size / 2}px`,
            top: `${stone.y - stone.size / 2}px`,
            width: `${stone.size}px`,
            height: `${stone.size}px`,
            transform: `rotate(${stone.rotation}deg)`,
            clipPath: clipPath,
            ...gradientStyle,
            opacity: stone.opacity,
            boxShadow: `
              inset 0 0 ${stone.size / 10}px rgba(255,255,255,${stone.shine}),
              0 ${stone.size / 20}px ${stone.size / 10}px rgba(0,0,0,0.3)
            `,
            zIndex: stone.selected ? 10 : 1,
          }}
        >
          {/* Reflexo de luz */}
          <div
            className="absolute"
            style={{
              width: `${stone.size * 0.4}px`,
              height: `${stone.size * 0.2}px`,
              left: `${stone.size * 0.3}px`,
              top: `${stone.size * 0.2}px`,
              background: `radial-gradient(ellipse at center, rgba(255,255,255,${stone.shine * 0.8}) 0%, rgba(255,255,255,0) 70%)`,
              borderRadius: "50%",
              transform: "rotate(-20deg)",
            }}
          />

          {/* Textura da pedra */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
              backgroundSize: "cover",
              mixBlendMode: "overlay",
            }}
          />
        </div>

        {/* Brilho energético (quando no modo energia) */}
        {energyMode && (
          <div
            className="absolute rounded-full"
            style={{
              left: `${stone.x - stone.size}px`,
              top: `${stone.y - stone.size}px`,
              width: `${stone.size * 2}px`,
              height: `${stone.size * 2}px`,
              background: `radial-gradient(circle, ${stone.glowColor}33 0%, transparent 70%)`,
              opacity: stone.energy / 100,
              zIndex: 0,
            }}
          />
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {stoneTypes.slice(0, 12).map((type) => (
          <motion.div key={type.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setSelectedStoneType(type)}
              className={`px-3 py-1 rounded-full ${
                selectedStoneType.id === type.id
                  ? "bg-white/20 border border-white/40"
                  : "bg-white/5 border border-white/10"
              }`}
              style={{ color: type.color }}
              disabled={isScanning || scanComplete}
            >
              {type.name}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Campo de pergunta com opção de áudio */}
      <div className="w-full mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua pergunta para o oráculo..."
            className="flex-grow p-2 rounded-md bg-white/10 border border-white/20 text-white"
          />
          <Button
            onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
            className={`${
              isRecordingAudio ? "bg-red-600 hover:bg-red-700" : "bg-[#8e2de2] hover:bg-[#a100f5]"
            } text-white p-2 rounded-full`}
          >
            {isRecordingAudio ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>
        {transcribedText && (
          <div className="mt-2 p-2 bg-white/5 rounded-md text-sm">
            <div className="flex justify-between items-center">
              <p className="text-gray-300">Pergunta transcrita:</p>
              {transcriptionFromCache && (
                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full">cache</span>
              )}
            </div>
            <p className="text-white">{transcribedText}</p>
          </div>
        )}
        {speechRecognitionError && (
          <div className="mt-2 p-2 bg-red-100 border border-red-500 rounded-md text-sm">
            <p className="text-red-700">{speechRecognitionError}</p>
          </div>
        )}
      </div>

      <div className="relative w-full">
        {/* Virtual Box */}
        <div
          ref={boxRef}
          className={`virtual-stone-box relative w-full h-[400px] bg-[#f5f5f0] border-8 rounded-md shadow-xl overflow-hidden cursor-pointer transition-all duration-500 ${
            is3DMode ? "transform-style-3d perspective-800" : ""
          }`}
          style={{
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.3)",
            borderImage: "linear-gradient(45deg, #fff, #d2b48c, #fff) 1",
            transform: is3DMode ? "rotateX(20deg)" : "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Box background with wood texture */}
          <div
            className="absolute inset-0 bg-[#d2b48c] opacity-40"
            style={{
              backgroundImage: "url('/placeholder.svg?height=400&width=800')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Grid lines for 3D effect */}
          {is3DMode && (
            <div className="absolute inset-0">
              <div className="w-full h-full grid grid-cols-12 grid-rows-6">
                {Array.from({ length: 12 * 6 }).map((_, i) => (
                  <div key={i} className="border border-white/5"></div>
                ))}
              </div>
            </div>
          )}

          {/* Render all stones */}
          <AnimatePresence>
            {stones.map((stone) => (
              <motion.div
                key={stone.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`stone absolute ${stone.selected ? "z-10" : ""}`}
                data-type={stone.type}
                data-x={stone.x}
                data-y={stone.y}
                data-size={stone.size}
                data-rotation={stone.rotation}
                data-energy={stone.energy}
              >
                {realisticMode ? (
                  renderRealisticStone(stone)
                ) : (
                  <div
                    className={`rounded-full shadow-md ${stone.selected ? "ring-2 ring-white" : ""}`}
                    style={{
                      position: "absolute",
                      left: `${stone.x - stone.size / 2}px`,
                      top: `${stone.y - stone.size / 2}px`,
                      width: `${stone.size}px`,
                      height: `${stone.size}px`,
                      backgroundColor: stone.color,
                      transform: `rotate(${stone.rotation}deg) ${is3DMode ? "translateZ(10px)" : ""}`,
                      zIndex: stone.selected ? 10 : 1,
                      opacity: 0.9,
                      boxShadow: energyMode
                        ? `0 0 ${stone.energy / 5}px ${stone.glowColor}`
                        : "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* Add shine effect to stones */}
                    <div
                      className="absolute rounded-full bg-white opacity-30"
                      style={{
                        width: `${stone.size * 0.3}px`,
                        height: `${stone.size * 0.3}px`,
                        left: `${stone.size * 0.1}px`,
                        top: `${stone.size * 0.1}px`,
                      }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Scanning overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#8e2de2]/30 flex items-center justify-center z-20"
              >
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white text-lg font-bold">Escaneando pedras...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Example overlay */}
          <AnimatePresence>
            {showExample && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center z-20"
              >
                <div className="relative w-[90%] h-[90%]">
                  <Image
                    src="/placeholder.svg?height=400&width=800"
                    alt="Exemplo de disposição de pedras"
                    fill
                    className="object-contain"
                  />
                  <button
                    className="absolute top-2 right-2 bg-white/20 rounded-full p-1 hover:bg-white/40 transition-colors"
                    onClick={toggleExample}
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mandala overlay when scan is complete */}
          <AnimatePresence>
            {scanComplete && mandalaParams && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center z-20"
              >
                <div className="relative">
                  <div className="w-64 h-64 relative">
                    {/* Aqui seria renderizada a mandala */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff9be2] to-[#8e2de2] opacity-20 animate-pulse-slow"></div>
                    <div className="relative z-10">
                      {mandalaParams && (
                        <MandalaGenerator
                          params={mandalaParams}
                          size={256}
                          className="rounded-full"
                          animate={true}
                          highQuality={true}
                        />
                      )}
                    </div>

                    {/* Botão de play no centro da mandala */}
                    <button
                      onClick={toggleAudio}
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-30 ${
                        audioGenerated ? "bg-[#8e2de2] hover:bg-[#a100f5]" : "bg-gray-500 cursor-not-allowed opacity-50"
                      }`}
                      disabled={!audioGenerated}
                    >
                      <Volume2 className="w-8 h-8 text-white" />
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-white mb-2">Leitura completa!</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {!audioGenerated && (
                        <Button onClick={generateAudio} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white">
                          Gerar Áudio
                        </Button>
                      )}
                      <Button
                        onClick={exportAsMP4}
                        className="bg-[#6a1fc7] hover:bg-[#8e2de2] text-white"
                        disabled={isCapturingImage}
                      >
                        <Download className="w-4 h-4 mr-2" /> {videoUrl ? "Baixar Imagem" : "Capturar Imagem"}
                      </Button>
                      {isRecording && (
                        <Button
                          onClick={() => setIsRecording(false)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Cancelar Captura
                        </Button>
                      )}
                      <Button
                        onClick={() => setScanComplete(false)}
                        variant="outline"
                        className="bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        Voltar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={clearStones}
              variant="outline"
              className="bg-white/5 border border-white/20 hover:bg-white/10"
              disabled={isScanning}
            >
              Limpar Pedras
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={shakeStones}
              className="bg-[#8e2de2] hover:bg-[#a100f5] text-white shadow-purple"
              disabled={isScanning}
            >
              <Sparkles className="w-4 h-4 mr-2" /> {isScanning ? "Agitando..." : "Agitar Pedras"}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={scanStones}
              className="bg-[#6a1fc7] hover:bg-[#8e2de2] text-white"
              disabled={isScanning || stones.length === 0}
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Escaneando...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" /> Auto-Escanear
                </>
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleRealisticMode}
              variant="outline"
              className={`border transition-colors ${
                realisticMode ? "bg-[#8e2de2]/30 border-[#8e2de2]" : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
              disabled={isScanning}
            >
              Pedras Realistas {realisticMode ? "✓" : ""}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggle3DMode}
              variant="outline"
              className={`border transition-colors ${
                is3DMode ? "bg-[#8e2de2]/30 border-[#8e2de2]" : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
              disabled={isScanning}
            >
              Modo 3D {is3DMode ? "✓" : ""}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleEnergyMode}
              variant="outline"
              className={`border transition-colors ${
                energyMode ? "bg-[#8e2de2]/30 border-[#8e2de2]" : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
              disabled={isScanning}
            >
              <Wand2 className="w-4 h-4 mr-2" /> Energia {energyMode ? "✓" : ""}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-white/70">
        <p>Clique para adicionar pedras ou arraste para movê-las</p>
        <p>Escolha o tipo de pedra nos botões acima</p>
        <p>Use o botão "Auto-Escanear" para analisar a disposição das pedras</p>
      </div>

      {/* Área de resultado da leitura */}
      {readingResult && (
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg w-full">
          <h3 className="text-xl font-bold mb-2 text-[#ff9be2]">Leitura das Pedras</h3>
          <p className="whitespace-pre-line">{readingResult}</p>
        </div>
      )}

      {/* Elementos ocultos para áudio e vídeo */}
      <audio ref={audioRef} className="hidden" />
      <video ref={videoRef} className="hidden" controls />
    </div>
  )
}
