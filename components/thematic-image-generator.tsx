"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HolographicCard } from "@/components/ui/holographic-card"
import { Wand2, RefreshCw, Download } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface ThematicImageGeneratorProps {
  reading: string
}

// Imagens pré-definidas para simular a geração
const presetImages = [
  "/placeholder.svg?height=512&width=512",
  "/placeholder.svg?height=512&width=512",
  "/placeholder.svg?height=512&width=512",
]

export default function ThematicImageGenerator({ reading }: ThematicImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [imagePrompt, setImagePrompt] = useState<string>("")

  // Gera um prompt baseado na leitura
  useEffect(() => {
    if (reading) {
      // Extrai palavras-chave da leitura
      const keywords = extractKeywords(reading)
      const prompt = `Uma imagem mística e espiritual representando: ${keywords.join(", ")}`
      setImagePrompt(prompt)
    }
  }, [reading])

  // Função para extrair palavras-chave da leitura
  const extractKeywords = (text: string): string[] => {
    // Em uma implementação real, usaríamos NLP ou a API do OpenAI
    // Aqui, vamos simular extraindo algumas palavras comuns em leituras místicas
    const mysticalWords = [
      "energia",
      "espírito",
      "luz",
      "caminho",
      "jornada",
      "transformação",
      "equilíbrio",
      "harmonia",
      "cosmos",
      "universo",
      "alma",
      "destino",
    ]

    const foundWords = mysticalWords.filter((word) => text.toLowerCase().includes(word.toLowerCase()))

    // Se não encontrar palavras suficientes, adiciona algumas genéricas
    if (foundWords.length < 3) {
      foundWords.push("energia mística", "jornada espiritual", "luz divina")
    }

    return foundWords.slice(0, 5) // Limita a 5 palavras-chave
  }

  // Simula a geração de imagem
  const generateImage = async () => {
    setIsGenerating(true)

    try {
      // Simula o tempo de geração
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Seleciona uma imagem aleatória do conjunto pré-definido
      const randomImage = presetImages[Math.floor(Math.random() * presetImages.length)]
      setCurrentImage(randomImage)
    } catch (error) {
      console.error("Erro ao gerar imagem:", error)
      alert("Ocorreu um erro ao gerar a imagem. Por favor, tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <HolographicCard className="mb-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-[#ff9be2]" /> Imagem Temática
      </h2>

      <p className="mb-4">Gere uma imagem única baseada na energia da sua leitura mística.</p>

      {imagePrompt && (
        <div className="bg-white/5 p-3 rounded-lg mb-4 text-sm">
          <p className="text-gray-400">Prompt de geração:</p>
          <p>{imagePrompt}</p>
        </div>
      )}

      <div className="flex justify-center mb-4">
        {currentImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-64 h-64 rounded-lg overflow-hidden"
          >
            <Image
              src={currentImage || "/placeholder.svg"}
              alt="Imagem temática gerada"
              fill
              className="object-cover"
            />
          </motion.div>
        ) : (
          <div className="w-64 h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
            <p className="text-center text-gray-400">
              {isGenerating ? "Gerando imagem..." : "Clique em gerar para criar sua imagem temática"}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <Button onClick={generateImage} disabled={isGenerating} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white">
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Gerando...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" /> Gerar Imagem
            </>
          )}
        </Button>

        {currentImage && (
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 hover:bg-white/10"
            onClick={() => {
              // Lógica para download da imagem
              const link = document.createElement("a")
              link.href = currentImage
              link.download = `imagem-mistica-${Date.now()}.png`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="w-4 h-4 mr-2" /> Baixar
          </Button>
        )}
      </div>
    </HolographicCard>
  )
}
