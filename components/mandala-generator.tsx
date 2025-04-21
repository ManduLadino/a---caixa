"use client"

import { useEffect, useRef } from "react"

interface MandalaParams {
  colors: string[]
  layers: number
  shape: string
  complexity: number
  symbols: string[]
}

interface MandalaGeneratorProps {
  params: MandalaParams
  size?: number
  className?: string
}

export default function MandalaGenerator({ params, size = 500, className = "" }: MandalaGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configura o canvas
    canvas.width = size
    canvas.height = size
    ctx.clearRect(0, 0, size, size)

    // Centro do canvas
    const centerX = size / 2
    const centerY = size / 2

    // Desenha o fundo
    ctx.fillStyle = "#1d002b"
    ctx.fillRect(0, 0, size, size)

    // Extrai parâmetros
    const { colors, layers, complexity, shape } = params
    const numSegments = complexity * 8 // Mais complexidade = mais segmentos

    // Desenha cada camada da mandala
    for (let layer = 1; layer <= layers; layer++) {
      const layerRadius = (size / 2) * (layer / layers) * 0.9
      const color = colors[layer % colors.length]

      // Desenha segmentos em cada camada
      for (let i = 0; i < numSegments; i++) {
        const angle = (i / numSegments) * Math.PI * 2
        const segmentSize = layerRadius * (0.2 + (0.8 * layer) / layers)

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)

        // Escolhe a forma com base no parâmetro
        if (shape === "triangle") {
          drawTriangle(ctx, 0, 0, segmentSize, color, layer, layerRadius)
        } else if (shape === "square") {
          drawSquare(ctx, 0, 0, segmentSize, color, layer, layerRadius)
        } else {
          // Círculo é o padrão
          drawCircle(ctx, 0, 0, segmentSize, color, layer, layerRadius)
        }

        ctx.restore()
      }

      // Adiciona detalhes decorativos
      if (layer % 2 === 0) {
        drawDecorations(ctx, centerX, centerY, layerRadius, numSegments, colors)
      }
    }

    // Adiciona um brilho central
    addCentralGlow(ctx, centerX, centerY, size / 6, colors[0])

    // Funções auxiliares para desenhar formas
    function drawCircle(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string,
      layer: number,
      layerRadius: number,
    ) {
      ctx.beginPath()
      ctx.arc(x, y + layerRadius / 2, radius / 4, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = 0.7
      ctx.fill()

      // Adiciona brilho
      ctx.beginPath()
      ctx.arc(x, y + layerRadius / 2, radius / 6, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.globalAlpha = 0.5
      ctx.fill()
      ctx.globalAlpha = 1
    }

    function drawTriangle(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      layer: number,
      layerRadius: number,
    ) {
      ctx.beginPath()
      ctx.moveTo(x, y + layerRadius / 2 - size / 4)
      ctx.lineTo(x - size / 4, y + layerRadius / 2 + size / 4)
      ctx.lineTo(x + size / 4, y + layerRadius / 2 + size / 4)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.7
      ctx.fill()
      ctx.globalAlpha = 1
    }

    function drawSquare(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      layer: number,
      layerRadius: number,
    ) {
      ctx.beginPath()
      ctx.rect(x - size / 8, y + layerRadius / 2 - size / 8, size / 4, size / 4)
      ctx.fillStyle = color
      ctx.globalAlpha = 0.7
      ctx.fill()
      ctx.globalAlpha = 1
    }

    function drawDecorations(
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number,
      segments: number,
      colors: string[],
    ) {
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = colors[i % colors.length]
        ctx.fill()

        // Linhas conectando ao centro
        if (i % 4 === 0) {
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.lineTo(x, y)
          ctx.strokeStyle = colors[i % colors.length]
          ctx.globalAlpha = 0.3
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      }
    }

    function addCentralGlow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.globalAlpha = 0.7
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }, [params, size])

  return <canvas ref={canvasRef} width={size} height={size} className={className} />
}
