"use client"

import { useEffect, useRef, useState } from "react"

interface MandalaParams {
  colors: string[]
  layers: number
  shape: string
  complexity: number
  symbols: string[]
  rotationSpeed?: number
  highQuality?: boolean
}

interface MandalaGeneratorProps {
  params: MandalaParams
  size?: number
  className?: string
  animate?: boolean
  highQuality?: boolean
}

export function MandalaGenerator({
  params,
  size = 500,
  className = "",
  animate = true,
  highQuality = false,
}: MandalaGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number | null>(null)

  // Function to create a smooth gradient from an array of colors
  const createGradient = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, colors: string[]) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color)
    })
    return gradient
  }

  // Function to draw a petal shape
  const drawPetal = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    angle: number,
    petalWidth: number,
    color: string,
    shape: string,
  ) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)

    ctx.beginPath()

    switch (shape) {
      case "triangle":
        ctx.moveTo(0, 0)
        ctx.lineTo(radius * Math.cos(petalWidth), radius * Math.sin(petalWidth))
        ctx.lineTo(radius * Math.cos(-petalWidth), radius * Math.sin(-petalWidth))
        break
      case "square":
        ctx.moveTo(0, 0)
        ctx.lineTo(radius * 0.3, radius * 0.3)
        ctx.lineTo(radius, radius * 0.3)
        ctx.lineTo(radius, -radius * 0.3)
        ctx.lineTo(radius * 0.3, -radius * 0.3)
        break
      case "flower":
        // Draw a flower petal shape
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(radius * 0.5, radius * 0.5, radius, 0)
        ctx.quadraticCurveTo(radius * 0.5, -radius * 0.5, 0, 0)
        break
      case "star":
        // Draw a star-like shape
        ctx.moveTo(0, 0)
        ctx.lineTo(radius * 0.3, radius * 0.1)
        ctx.lineTo(radius, 0)
        ctx.lineTo(radius * 0.3, -radius * 0.1)
        ctx.lineTo(radius * 0.5, -radius * 0.5)
        ctx.lineTo(0, -radius * 0.2)
        ctx.lineTo(-radius * 0.5, -radius * 0.5)
        ctx.lineTo(-radius * 0.3, -radius * 0.1)
        ctx.lineTo(-radius, 0)
        ctx.lineTo(-radius * 0.3, radius * 0.1)
        ctx.lineTo(-radius * 0.5, radius * 0.5)
        ctx.lineTo(0, radius * 0.2)
        ctx.lineTo(radius * 0.5, radius * 0.5)
        break
      default: // circle or default
        ctx.arc(radius / 2, 0, radius / 4, 0, Math.PI * 2)
    }

    ctx.fillStyle = color
    ctx.fill()

    // Add highlight for 3D effect
    if (highQuality) {
      ctx.beginPath()
      if (shape === "circle") {
        ctx.arc(radius / 2, 0, radius / 6, 0, Math.PI * 2)
      } else {
        ctx.moveTo(0, 0)
        ctx.lineTo(radius * 0.4, radius * 0.1)
        ctx.lineTo(radius * 0.8, 0)
        ctx.lineTo(radius * 0.4, -radius * 0.1)
      }
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fill()
    }

    ctx.restore()
  }

  // Function to draw a mandala symbol
  const drawSymbol = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    symbol: string,
    color: string,
  ) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)

    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = highQuality ? 2 : 1

    switch (symbol.toLowerCase()) {
      case "estrela":
      case "star":
        // Draw a star
        const spikes = 5
        const outerRadius = size
        const innerRadius = size / 2

        ctx.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (Math.PI / spikes) * i
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
        }
        ctx.closePath()
        ctx.fill()
        break

      case "espiral":
      case "spiral":
        // Draw a spiral
        ctx.beginPath()
        for (let i = 0; i < 720; i++) {
          const angle = 0.1 * i * (Math.PI / 180)
          const radius = size * (i / 720)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        break

      case "lua":
      case "moon":
        // Draw a crescent moon
        ctx.beginPath()
        ctx.arc(0, 0, size, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.arc(size / 2, 0, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
        break

      case "flor":
      case "flower":
        // Draw a simple flower
        const petalCount = 6
        for (let i = 0; i < petalCount; i++) {
          const angle = ((Math.PI * 2) / petalCount) * i
          ctx.beginPath()
          ctx.ellipse(
            Math.cos(angle) * (size / 2),
            Math.sin(angle) * (size / 2),
            size / 3,
            size / 6,
            angle,
            0,
            Math.PI * 2,
          )
          ctx.fill()
        }

        // Draw center
        ctx.beginPath()
        ctx.arc(0, 0, size / 4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.fill()
        break

      case "olho":
      case "eye":
        // Draw an eye
        ctx.beginPath()
        ctx.ellipse(0, 0, size, size / 2, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(0, 0, size / 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        break

      case "triângulo":
      case "triangulo":
      case "triangle":
        // Draw a triangle
        ctx.beginPath()
        ctx.moveTo(0, -size)
        ctx.lineTo(size * 0.866, size * 0.5)
        ctx.lineTo(-size * 0.866, size * 0.5)
        ctx.closePath()
        ctx.fill()
        break

      case "hexágono":
      case "hexagono":
      case "hexagon":
        // Draw a hexagon
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i
          ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size)
        }
        ctx.closePath()
        ctx.fill()
        break

      case "círculo":
      case "circulo":
      case "circle":
        // Draw a circle
        ctx.beginPath()
        ctx.arc(0, 0, size, 0, Math.PI * 2)
        ctx.fill()
        break

      default:
        // Draw a circle as default
        ctx.beginPath()
        ctx.arc(0, 0, size, 0, Math.PI * 2)
        ctx.fill()
    }

    ctx.restore()
  }

  // Function to add glow effect
  const addGlow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    intensity = 0.5,
  ) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(
      0,
      `${color}${Math.floor(intensity * 99)
        .toString(16)
        .padStart(2, "0")}`,
    )
    gradient.addColorStop(1, "transparent")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // Animation loop
  const startAnimation = () => {
    setRotation((prev) => (prev + (params.rotationSpeed || 0.1)) % 360)
    animationRef.current = requestAnimationFrame(startAnimation)
  }

  // Start/stop animation
  useEffect(() => {
    if (animate) {
      animationRef.current = requestAnimationFrame(startAnimation)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, params.rotationSpeed])

  // Draw the mandala
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = size
    canvas.height = size

    // Get parameters
    const { colors, layers, complexity, shape, symbols } = params

    // Center coordinates
    const centerX = size / 2
    const centerY = size / 2

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw background
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2)
    bgGradient.addColorStop(0, "#1d002b")
    bgGradient.addColorStop(1, "#36005d")
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, size, size)

    // Add base glow
    if (highQuality) {
      addGlow(ctx, centerX, centerY, size / 2, colors[0], 0.3)
    }

    // Calculate number of segments based on complexity
    const numSegments = Math.max(6, Math.floor(complexity * 3))

    // Draw each layer
    for (let layer = 1; layer <= layers; layer++) {
      const layerRadius = (size / 2) * (layer / layers) * 0.9
      const segmentAngle = (Math.PI * 2) / numSegments

      // Select color for this layer
      const colorIndex = (layer - 1) % colors.length
      const color = colors[colorIndex]

      // Draw segments in this layer
      for (let i = 0; i < numSegments; i++) {
        const angle = segmentAngle * i + (rotation * Math.PI) / 180
        const petalWidth = Math.PI / (8 + complexity * 2)

        // Draw petal/segment
        drawPetal(ctx, centerX, centerY, layerRadius, angle, petalWidth, color, shape)

        // Add decorative elements at certain points
        if (layer % 2 === 0 && i % 3 === 0 && symbols.length > 0) {
          const symbolX = centerX + Math.cos(angle) * (layerRadius * 0.7)
          const symbolY = centerY + Math.sin(angle) * (layerRadius * 0.7)
          const symbolSize = layerRadius * 0.15
          const symbolRotation = angle + Math.PI / 2
          const symbolIndex = (i + layer) % symbols.length

          drawSymbol(
            ctx,
            symbolX,
            symbolY,
            symbolSize,
            symbolRotation,
            symbols[symbolIndex],
            colors[(colorIndex + 1) % colors.length],
          )
        }
      }

      // Add connecting lines between layers
      if (layer > 1 && highQuality) {
        const prevLayerRadius = (size / 2) * ((layer - 1) / layers) * 0.9

        for (let i = 0; i < numSegments; i += 2) {
          const angle = segmentAngle * i + (rotation * Math.PI) / 180

          const x1 = centerX + Math.cos(angle) * prevLayerRadius
          const y1 = centerY + Math.sin(angle) * prevLayerRadius
          const x2 = centerX + Math.cos(angle) * layerRadius
          const y2 = centerY + Math.sin(angle) * layerRadius

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = `${colors[colorIndex]}80`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    // Draw central symbol
    if (symbols.length > 0) {
      const centralSymbol = symbols[0]
      const symbolSize = size * 0.1

      drawSymbol(ctx, centerX, centerY, symbolSize, (rotation * Math.PI) / 180, centralSymbol, colors[0])
    }

    // Add central glow
    addGlow(ctx, centerX, centerY, size / 4, colors[0], 0.7)

    // Add outer glow
    if (highQuality) {
      ctx.save()
      ctx.globalCompositeOperation = "screen"
      addGlow(ctx, centerX, centerY, size / 1.8, colors[1] || colors[0], 0.3)
      ctx.restore()
    }

    // Add subtle texture overlay for high quality mode
    if (highQuality) {
      ctx.save()
      ctx.globalCompositeOperation = "overlay"

      // Create noise texture
      const noiseCanvas = document.createElement("canvas")
      noiseCanvas.width = size
      noiseCanvas.height = size
      const noiseCtx = noiseCanvas.getContext("2d")

      if (noiseCtx) {
        const imageData = noiseCtx.createImageData(size, size)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const value = Math.floor(Math.random() * 255)
          data[i] = value
          data[i + 1] = value
          data[i + 2] = value
          data[i + 3] = 15 // Very transparent
        }

        noiseCtx.putImageData(imageData, 0, 0)
        ctx.drawImage(noiseCanvas, 0, 0)
      }

      ctx.restore()
    }
  }, [params, size, rotation, highQuality])

  return <canvas ref={canvasRef} width={size} height={size} className={className} />
}

// Add this line to maintain compatibility with both named and default imports
export default MandalaGenerator
