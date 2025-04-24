"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles, Wand2, Camera, Volume2, Download, X, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { stonePrompts } from "@/lib/stone-prompts"
import { MandalaGenerator } from "@/components/mandala-generator"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Interface para as pedras
interface Stone {
  id: string
  type: string
  x: number
  y: number
  size: number
  rotation: number
  color: string
  selected: boolean
  energy: number
  glowColor: string
  texture: string
  shape: string
  finish: string
  elevation: number
  shadow: number
  glow: number
  opacity: number
  reflectivity: number
  roughness: number
}

// Leitura mística padrão para fallback
const defaultReading = `
# Leitura Mística das Pedras

## Percepção Interior Atual
As pedras revelam que você está em um momento de transição interior. Sua energia vibra em busca de equilíbrio, como cristais que ressoam em harmonia. Há uma força silenciosa crescendo dentro de você, aguardando o momento certo para manifestar-se. As pedras mostram que sua intuição está especialmente aguçada neste ciclo.

## Bloqueios Energéticos Ocultos
Existe uma resistência sutil que impede o fluxo completo de sua energia criativa. As pedras indicam um padrão de pensamento recorrente que, como uma sombra, segue seus passos sem que você perceba. Este bloqueio está relacionado a experiências passadas que ainda não foram completamente integradas à sua consciência.

## Caminhos para Expansão do ECI
O caminho para expandir seu Estado de Consciência Interna se revela através da aceitação do silêncio. As pedras sugerem práticas de contemplação junto à natureza, especialmente ao amanhecer. Há um portal energético se abrindo que favorece sua conexão com dimensões mais sutis da existência. Confie no ritmo natural de seu despertar.

Que as pedras místicas iluminem seu caminho interior e revelem os segredos que sua alma busca compreender. Qual aspecto desta leitura ressoa mais profundamente com seu momento atual?
`

// Parâmetros padrão para a mandala
const defaultMandalaParams = {
  colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
  layers: 5,
  shape: "circle",
  complexity: 7,
  symbols: ["estrela", "espiral", "lua"],
}

// Função para gerar texturas SVG para as pedras
const generateTexturePattern = (texture: string, color: string) => {
  const baseColor = color
  const darkerColor = adjustColorBrightness(color, -20)
  const lighterColor = adjustColorBrightness(color, 20)

  switch (texture) {
    case "crystalline":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L100 100M20 0L100 80M40 0L100 60M60 0L100 40M80 0L100 20M0 20L80 100M0 40L60 100M0 60L40 100M0 80L20 100' stroke='${encodeURIComponent(
        darkerColor,
      )}' strokeWidth='0.5' fill='none' /%3E%3C/svg%3E")`
    case "veined":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30,10 Q50,30 30,50 T50,90 M70,10 Q50,30 70,50 T50,90' stroke='${encodeURIComponent(
        darkerColor,
      )}' strokeWidth='1' fill='none' /%3E%3C/svg%3E")`
    case "banded":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='100' height='20' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Crect x='0' y='20' width='100' height='15' fill='${encodeURIComponent(
        darkerColor,
      )}' /%3E%3Crect x='0' y='35' width='100' height='30' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Crect x='0' y='65' width='100' height='15' fill='${encodeURIComponent(
        darkerColor,
      )}' /%3E%3Crect x='0' y='80' width='100' height='20' fill='${encodeURIComponent(baseColor)}' /%3E%3C/svg%3E")`
    case "chatoyant":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        darkerColor,
      )}' /%3E%3Cstop offset='45%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}' /%3E%3Cstop offset='55%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        darkerColor,
      )}' /%3E%3C/linearGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "speckled":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cg fill='${encodeURIComponent(
        lighterColor,
      )}'%3E%3Ccircle cx='10' cy='10' r='1' /%3E%3Ccircle cx='25' cy='30' r='1.5' /%3E%3Ccircle cx='40' cy='15' r='1' /%3E%3Ccircle cx='55' cy='35' r='2' /%3E%3Ccircle cx='70' cy='20' r='1' /%3E%3Ccircle cx='85' cy='40' r='1.5' /%3E%3Ccircle cx='15' cy='50' r='1' /%3E%3Ccircle cx='30' cy='65' r='1.5' /%3E%3Ccircle cx='45' cy='80' r='1' /%3E%3Ccircle cx='60' cy='60' r='2' /%3E%3Ccircle cx='75' cy='75' r='1' /%3E%3Ccircle cx='90' cy='90' r='1.5' /%3E%3C/g%3E%3C/svg%3E")`
    case "smooth":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3CradialGradient id='g' cx='30%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3C/radialGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "metallic":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}' /%3E%3Cstop offset='20%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cstop offset='40%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}' /%3E%3Cstop offset='60%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cstop offset='80%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3C/linearGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "striated":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 L100,10 M0,30 L100,30 M0,50 L100,50 M0,70 L100,70 M0,90 L100,90' stroke='${encodeURIComponent(
        darkerColor,
      )}' strokeWidth='2' /%3E%3C/svg%3E")`
    case "adularescent":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}80' /%3E%3Cstop offset='70%25' stopColor='${encodeURIComponent(
        baseColor,
      )}40' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        baseColor,
      )}00' /%3E%3C/radialGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cellipse cx='50' cy='50' rx='30' ry='20' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "aventurescent":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cg fill='${encodeURIComponent(
        lighterColor,
      )}'%3E%3Cpath d='M10,10 L12,8 L14,10 L12,12 Z' /%3E%3Cpath d='M30,15 L33,12 L36,15 L33,18 Z' /%3E%3Cpath d='M50,10 L53,7 L56,10 L53,13 Z' /%3E%3Cpath d='M70,15 L72,13 L74,15 L72,17 Z' /%3E%3Cpath d='M90,10 L93,7 L96,10 L93,13 Z' /%3E%3Cpath d='M20,30 L22,28 L24,30 L22,32 Z' /%3E%3Cpath d='M40,35 L43,32 L46,35 L43,38 Z' /%3E%3Cpath d='M60,30 L62,28 L64,30 L62,32 Z' /%3E%3Cpath d='M80,35 L83,32 L86,35 L83,38 Z' /%3E%3Cpath d='M10,50 L13,47 L16,50 L13,53 Z' /%3E%3Cpath d='M30,55 L32,53 L34,55 L32,57 Z' /%3E%3Cpath d='M50,50 L53,47 L56,50 L53,53 Z' /%3E%3Cpath d='M70,55 L73,52 L76,55 L73,58 Z' /%3E%3Cpath d='M90,50 L92,48 L94,50 L92,52 Z' /%3E%3Cpath d='M20,70 L23,67 L26,70 L23,73 Z' /%3E%3Cpath d='M40,75 L42,73 L44,75 L42,77 Z' /%3E%3Cpath d='M60,70 L63,67 L66,70 L63,73 Z' /%3E%3Cpath d='M80,75 L82,73 L84,75 L82,77 Z' /%3E%3Cpath d='M10,90 L12,88 L14,90 L12,92 Z' /%3E%3Cpath d='M30,95 L33,92 L36,95 L33,98 Z' /%3E%3Cpath d='M50,90 L52,88 L54,90 L52,92 Z' /%3E%3Cpath d='M70,95 L73,92 L76,95 L73,98 Z' /%3E%3Cpath d='M90,90 L93,87 L96,90 L93,93 Z' /%3E%3C/g%3E%3C/svg%3E")`
    case "transparent":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        baseColor,
      )}80' /%3E%3Cstop offset='50%25' stopColor='${encodeURIComponent(
        baseColor,
      )}40' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        baseColor,
      )}80' /%3E%3C/linearGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "bladed":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,0 L30,100 M30,0 L50,100 M50,0 L70,100 M70,0 L90,100' stroke='${encodeURIComponent(
        darkerColor,
      )}' strokeWidth='1' /%3E%3C/svg%3E")`
    case "glassy":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3CradialGradient id='g' cx='30%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}60' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3C/radialGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "translucent":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3C/radialGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "labradorescent":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cstop offset='25%25' stopColor='${encodeURIComponent(
        "#4169E1",
      )}80' /%3E%3Cstop offset='50%25' stopColor='${encodeURIComponent(
        "#3CB371",
      )}80' /%3E%3Cstop offset='75%25' stopColor='${encodeURIComponent(
        "#4169E1",
      )}80' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3C/linearGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "opaque":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3C/svg%3E")`
    case "mottled":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cellipse cx='30' cy='30' rx='15' ry='10' fill='${encodeURIComponent(
        "#000000",
      )}40' /%3E%3Cellipse cx='70' cy='40' rx='10' ry='8' fill='${encodeURIComponent(
        "#000000",
      )}40' /%3E%3Cellipse cx='20' cy='70' rx='12' ry='9' fill='${encodeURIComponent(
        "#000000",
      )}40' /%3E%3Cellipse cx='60' cy='80' rx='8' ry='6' fill='${encodeURIComponent("#000000")}40' /%3E%3C/svg%3E")`
    case "dendritic":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}80' /%3E%3Cpath d='M50,10 L50,30 M50,30 L30,50 M50,30 L70,50 M30,50 L20,70 M30,50 L40,70 M70,50 L60,70 M70,50 L80,70' stroke='${encodeURIComponent(
        "#006400",
      )}' strokeWidth='1' /%3E%3C/svg%3E")`
    case "vitreous":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3CradialGradient id='g' cx='40%25' cy='40%25' r='60%25'%3E%3Cstop offset='0%25' stopColor='${encodeURIComponent(
        lighterColor,
      )}' /%3E%3Cstop offset='100%25' stopColor='${encodeURIComponent(
        baseColor,
      )}' /%3E%3C/radialGradient%3E%3Crect x='0' y='0' width='100' height='100' fill='url(%23g)' /%3E%3C/svg%3E")`
    case "included":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cg fill='${encodeURIComponent(
        lighterColor,
      )}'%3E%3Ccircle cx='20' cy='20' r='3' /%3E%3Ccircle cx='40' cy='30' r='4' /%3E%3Ccircle cx='60' cy='20' r='2' /%3E%3Ccircle cx='80' cy='30' r='3' /%3E%3Ccircle cx='30' cy='50' r='5' /%3E%3Ccircle cx='70' cy='50' r='4' /%3E%3Ccircle cx='20' cy='70' r='3' /%3E%3Ccircle cx='50' cy='80' r='5' /%3E%3Ccircle cx='80' cy='70' r='2' /%3E%3C/g%3E%3C/svg%3E")`
    case "snowflake":
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3Cg fill='${encodeURIComponent(
        "#FFFFFF",
      )}'%3E%3Ccircle cx='20' cy='20' r='5' /%3E%3Ccircle cx='50' cy='30' r='7' /%3E%3Ccircle cx='80' cy='20' r='4' /%3E%3Ccircle cx='30' cy='50' r='6' /%3E%3Ccircle cx='70' cy='60' r='8' /%3E%3Ccircle cx='20' cy='80' r='5' /%3E%3Ccircle cx='60' cy='80' r='4' /%3E%3C/g%3E%3C/svg%3E")`
    default:
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(
        baseColor,
      )}' /%3E%3C/svg%3E")`
  }
}

// Função para ajustar o brilho de uma cor
function adjustColorBrightness(color: string, percent: number) {
  const num = Number.parseInt(color.replace("#", ""), 16)
  const r = (num >> 16) + percent
  const g = ((num >> 8) & 0x00ff) + percent
  const b = (num & 0x0000ff) + percent

  const newR = Math.min(255, Math.max(0, r))
  const newG = Math.min(255, Math.max(0, g))
  const newB = Math.min(255, Math.max(0, b))

  return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, "0")}`
}

// Função para gerar a forma da pedra com base no tipo
const getStoneShape = (shape: string) => {
  switch (shape) {
    case "hexagonal":
      return "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
    case "oval":
      return "ellipse(50% 40% at 50% 50%)"
    case "block":
      return "polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)"
    case "slice":
      return "ellipse(45% 30% at 50% 50%)"
    case "irregular":
      return "polygon(30% 0%, 70% 10%, 90% 30%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 10% 30%)"
    case "cabochon":
      return "ellipse(40% 30% at 50% 50%)"
    case "cubic":
      return "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)"
    case "sphere":
      return "circle(50% at 50% 50%)"
    case "pointed":
      return "polygon(50% 0%, 80% 30%, 100% 60%, 80% 90%, 50% 100%, 20% 90%, 0% 60%, 20% 30%)"
    case "rod":
      return "polygon(30% 0%, 70% 0%, 90% 20%, 90% 80%, 70% 100%, 30% 100%, 10% 80%, 10% 20%)"
    case "heart":
      return "path('M50,15 C50,15 20,15 20,40 C20,60 40,70 50,80 C60,70 80,60 80,40 C80,15 50,15 50,15 Z')"
    case "blade":
      return "polygon(30% 0%, 70% 0%, 90% 10%, 90% 90%, 70% 100%, 30% 100%, 10% 90%, 10% 10%)"
    case "rhombohedral":
      return "polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)"
    case "rounded":
      return "circle(45% at 50% 50%)"
    case "slab":
      return "polygon(5% 20%, 95% 20%, 95% 80%, 5% 80%)"
    case "nodular":
      return "polygon(30% 10%, 70% 10%, 90% 30%, 90% 70%, 70% 90%, 30% 90%, 10% 70%, 10% 30%)"
    case "faceted":
      return "polygon(50% 0%, 80% 10%, 100% 35%, 100% 65%, 80% 90%, 50% 100%, 20% 90%, 0% 65%, 0% 35%, 20% 10%)"
    case "dodecahedral":
      return "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
    default:
      return "circle(50% at 50% 50%)"
  }
}

// Gera uma pedra com propriedades específicas
const generateStone = (x: number, y: number, stoneType: string, size?: number) => {
  const stoneData = stonePrompts[stoneType as keyof typeof stonePrompts]
  if (!stoneData) return null

  const stoneSize = size || Math.floor(Math.random() * 15) + 20 // 20-35px
  const energy = stoneData.energyLevel || Math.random() * 20 + 70 // 70-90 energia
  const glowColors = ["#ff9be2", "#c774f0", "#8e2de2", "#6a1fc7", "#36005d"]
  const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)]

  // Propriedades realistas
  const elevation = Math.random() * 5 // 0-5px de elevação
  const shadow = Math.random() * 0.5 + 0.5 // 0.5-1.0 intensidade da sombra
  const glow = Math.random() * 0.3 // 0-0.3 intensidade do brilho
  const opacity = Math.random() * 0.2 + 0.8 // 0.8-1.0 opacidade
  const reflectivity = Math.random() * 0.5 // 0-0.5 reflexividade
  const roughness = Math.random() * 0.5 + 0.3 // 0.3-0.8 rugosidade

  return {
    id: `stone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: stoneType,
    x,
    y,
    size: stoneSize,
    rotation: Math.random() * 360,
    color: stoneData.color,
    selected: false,
    energy,
    glowColor,
    texture: stoneData.texture || "smooth",
    shape: stoneData.shape || "rounded",
    finish: stoneData.finish || "polished",
    elevation,
    shadow,
    glow,
    opacity,
    reflectivity,
    roughness,
  }
}

// Configuração inicial das pedras baseada na imagem de referência
const createInitialStones = (width: number, height: number) => {
  const stones: Stone[] = []

  // Definição das pedras principais baseadas na imagem
  const mainStones = [
    // Pedras verdes (jade/aventurina) - maioria
    { type: "jade", count: 40, size: [15, 25] },
    { type: "aventurina", count: 30, size: [12, 22] },

    // Pedras pretas maiores
    { type: "obsidiana", count: 3, size: [30, 40] },
    { type: "turmalinaNegra", count: 2, size: [28, 38] },

    // Pedras vermelhas/rosa
    { type: "jaspeVermelho", count: 15, size: [10, 15] },
    { type: "rodonita", count: 5, size: [12, 18] },

    // Pedras claras/brancas
    { type: "quartzoTransparente", count: 3, size: [25, 35] },
    { type: "howlita", count: 2, size: [20, 30] },

    // Pedras especiais
    { type: "pedraDaLua", count: 1, size: [25, 35] },
    { type: "labradorita", count: 1, size: [25, 35] },
  ]

  // Distribuição das pedras na caixa
  mainStones.forEach((stoneDef) => {
    for (let i = 0; i < stoneDef.count; i++) {
      // Posição aleatória dentro da caixa
      const x = Math.random() * (width - 40) + 20
      const y = Math.random() * (height - 40) + 20

      // Tamanho dentro do intervalo definido
      const size = Math.floor(Math.random() * (stoneDef.size[1] - stoneDef.size[0])) + stoneDef.size[0]

      const stone = generateStone(x, y, stoneDef.type, size)
      if (stone) {
        stones.push(stone)
      }
    }
  })

  return stones
}

export default function RealisticStoneBox() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 })
  const [stones, setStones] = useState<Stone[]>([])
  const [selectedStoneType, setSelectedStoneType] = useState("jade")
  const [isScanning, setIsScanning] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [currentStone, setCurrentStone] = useState<Stone | null>(null)
  const [question, setQuestion] = useState("")
  const [readingResult, setReadingResult] = useState("")
  const [scanComplete, setScanComplete] = useState(false)
  const [mandalaParams, setMandalaParams] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showExample, setShowExample] = useState(false)
  const [is3DMode, setIs3DMode] = useState(false)
  const [energyMode, setEnergyMode] = useState(false)
  const [lightingEffect, setLightingEffect] = useState(true)
  const [boxStyle, setBoxStyle] = useState<"golden" | "wooden" | "dark">("wooden")
  const [showAllStones, setShowAllStones] = useState(false)
  const [isCapturingImage, setIsCapturingImage] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [stoneFilter, setStoneFilter] = useState("")
  const [selectedStoneInfo, setSelectedStoneInfo] = useState<any>(null)
  const [showStoneInfo, setShowStoneInfo] = useState(false)
  const [audioQuestion, setAudioQuestion] = useState<string | null>(null)
  const [transcribedText, setTranscribedText] = useState("")
  const [ambientLight, setAmbientLight] = useState(0.5)
  const [stoneCategories] = useState(["Todas", "Cristalinas", "Protetoras", "Energéticas", "Curativas"])
  const [isInitialized, setIsInitialized] = useState(false)

  // Atualiza o tamanho da caixa quando o componente é montado ou redimensionado
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

  // Inicializa as pedras quando o tamanho da caixa é conhecido
  useEffect(() => {
    if (boxSize.width > 0 && boxSize.height > 0 && !isInitialized) {
      const initialStones = createInitialStones(boxSize.width, boxSize.height)
      setStones(initialStones)
      setIsInitialized(true)
    }
  }, [boxSize, isInitialized])

  // Manipula o clique na caixa
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!boxRef.current || isScanning || scanComplete) return

    const rect = boxRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Verifica se clicou em uma pedra existente
    const clickedStone = stones.find((stone) => {
      const dx = stone.x - x
      const dy = stone.y - y
      return Math.sqrt(dx * dx + dy * dy) < stone.size / 2
    })

    if (clickedStone) {
      // Seleciona a pedra para arrastar ou mostra informações
      if (e.shiftKey) {
        // Mostra informações da pedra quando shift+click
        const stoneData = stonePrompts[clickedStone.type as keyof typeof stonePrompts]
        setSelectedStoneInfo({
          name: stoneData?.name || "Pedra Desconhecida",
          meaning: stoneData?.meaning || "Significado desconhecido",
          color: clickedStone.color,
          energy: clickedStone.energy,
          type: clickedStone.type,
          origin: stoneData?.origin || "Origem desconhecida",
          texture: clickedStone?.texture || "Textura desconhecida",
          shape: stoneData?.shape || "Forma desconhecida",
          finish: stoneData?.finish || "Acabamento desconhecido",
        })
        setShowStoneInfo(true)
      } else {
        // Clique normal para arrastar
        setCurrentStone(clickedStone)
        setIsDragging(true)
        setStones((prevStones) =>
          prevStones.map((stone) => ({
            ...stone,
            selected: stone.id === clickedStone.id,
          })),
        )
      }
    } else {
      // Adiciona uma nova pedra apenas se não houver muitas
      if (stones.length < 100) {
        const newStone = generateStone(x, y, selectedStoneType)
        if (newStone) {
          setStones((prevStones) => [...prevStones, newStone])
        }
      }
    }
  }

  // Manipula o movimento do mouse para arrastar
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

  // Manipula o fim do arrasto
  const handleMouseUp = () => {
    setIsDragging(false)
    setCurrentStone(null)
  }

  // Limpa todas as pedras
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

  // Randomiza as pedras na caixa
  const randomizeStones = () => {
    if (!boxRef.current) return

    const { width, height } = boxRef.current.getBoundingClientRect()
    setStones(createInitialStones(width, height))
    setScanComplete(false)
    setAudioGenerated(false)
    setReadingResult("")
    setMandalaParams(null)
    setVideoUrl(null)
  }

  // Adiciona uma animação de sacudir
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
            elevation: Math.max(0, stone.elevation + (Math.random() * 8 - 4) * (1 - progress)),
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

  // Alterna a exibição do exemplo
  const toggleExample = () => {
    setShowExample(!showExample)
  }

  // Alterna o modo 3D
  const toggle3DMode = () => {
    setIs3DMode(!is3DMode)
  }

  // Alterna o modo de energia
  const toggleEnergyMode = () => {
    setEnergyMode(!energyMode)
  }

  // Alterna o efeito de iluminação
  const toggleLightingEffect = () => {
    setLightingEffect(!lightingEffect)
  }

  // Alterna o estilo da caixa
  const cycleBoxStyle = () => {
    if (boxStyle === "golden") setBoxStyle("wooden")
    else if (boxStyle === "wooden") setBoxStyle("dark")
    else setBoxStyle("golden")
  }

  // Alterna a exibição de todas as pedras
  const toggleShowAllStones = () => {
    setShowAllStones(!showAllStones)
    if (!showAllStones) {
      // Preenche a caixa com todas as 33 pedras
      randomizeStones()
    }
  }

  // Escaneia as pedras e gera uma leitura
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

      // Cria um corpo de requisição com todas as informações necessárias
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

      // Faz a chamada à API com melhor tratamento de erros
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      // Verifica se a resposta está ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Erro na resposta da API: ${response.status} ${response.statusText}`, errorText)
        throw new Error(`Falha ao gerar a leitura: ${response.status}`)
      }

      // Analisa a resposta
      const responseText = await response.text()
      let chatData

      try {
        chatData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Erro ao analisar resposta JSON:", parseError)
        console.error("Texto da resposta:", responseText)
        // Usa a leitura padrão em caso de erro de análise
        chatData = { reply: defaultReading }
      }

      const reading = chatData.reply || defaultReading
      setReadingResult(reading)

      // Gera parâmetros da mandala
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
      // Define a leitura padrão e os parâmetros da mandala
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
        // Mesmo com erro, permitimos que o usuário continue
        setAudioGenerated(true)
      }
    } catch (error) {
      console.error("Erro ao gerar áudio:", error)
      // Define o áudio como gerado de qualquer forma para permitir que o usuário continue
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

  // Captura uma imagem da caixa
  const captureImage = async () => {
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
        ctx.fillStyle = boxStyle === "golden" ? "#d4af37" : boxStyle === "wooden" ? "#8b4513" : "#000000"
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

      setIsCapturingImage(false)

      alert('Captura concluída! Você pode baixar a imagem usando o botão "Baixar Imagem".')
    } catch (error) {
      console.error("Erro ao capturar imagem:", error)
      alert("Não foi possível capturar a imagem. Tente novamente mais tarde.")
      setIsCapturingImage(false)
    }
  }

  // Exporta a imagem capturada
  const exportImage = () => {
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
        captureImage()
      }
    }
  }

  // Filtra as pedras por categoria
  const filterStonesByCategory = (category: string) => {
    setSelectedCategory(category)

    if (category === "Todas") {
      return Object.keys(stonePrompts)
    }

    // Filtra as pedras com base na categoria
    return Object.entries(stonePrompts)
      .filter(([_, stone]) => {
        const meaning = stone.meaning.toLowerCase()

        switch (category) {
          case "Cristalinas":
            return stone.texture === "crystalline" || stone.finish === "raw"
          case "Protetoras":
            return meaning.includes("proteção") || meaning.includes("equilíbrio")
          case "Energéticas":
            return meaning.includes("energia") || meaning.includes("vitalidade") || stone.energyLevel > 85
          case "Curativas":
            return meaning.includes("cura") || meaning.includes("harmonia") || meaning.includes("paz")
          default:
            return true
        }
      })
      .map(([key, _]) => key)
  }

  // Filtra as pedras por texto de busca
  const filterStonesByText = (stones: string[]) => {
    if (!stoneFilter) return stones

    const filter = stoneFilter.toLowerCase()
    return stones.filter((key) => {
      const stone = stonePrompts[key as keyof typeof stonePrompts]
      return stone.name.toLowerCase().includes(filter) || stone.meaning.toLowerCase().includes(filter)
    })
  }

  // Obtém as pedras filtradas
  const getFilteredStones = () => {
    const stonesByCategory = filterStonesByCategory(selectedCategory)
    return filterStonesByText(stonesByCategory)
  }

  // Renderiza uma pedra com aparência realista
  const renderRealisticStone = (stone: Stone) => {
    const stoneData = stonePrompts[stone.type as keyof typeof stonePrompts]
    if (!stoneData) return null

    // Determina a forma da pedra
    const clipPath = getStoneShape(stone.shape)

    // Obtém a textura da pedra
    const texturePattern = generateTexturePattern(stone.texture, stone.color)

    // Adiciona efeito de elevação (3D)
    const elevationStyle = is3DMode
      ? {
          transform: `rotate(${stone.rotation}deg) translateZ(${stone.elevation}px)`,
          boxShadow: `0 ${stone.elevation}px ${stone.elevation * 2}px rgba(0,0,0,${stone.shadow})`,
        }
      : {
          transform: `rotate(${stone.rotation}deg)`,
          boxShadow: `0 2px 4px rgba(0,0,0,${stone.shadow})`,
        }

    // Adiciona efeito de iluminação
    const lightingStyle = lightingEffect
      ? {
          boxShadow: `
            inset 0 0 ${stone.size / 10}px rgba(255,255,255,${stone.reflectivity}),
            0 ${stone.size / 20}px ${stone.size / 10}px rgba(0,0,0,${stone.shadow}),
            0 0 ${stone.size / 3}px rgba(255,255,255,${ambientLight * 0.2})
          `,
        }
      : {}

    // Estilo para o acabamento da pedra
    const finishStyle =
      stone.finish === "polished"
        ? { filter: `brightness(1.2) contrast(1.1)` }
        : stone.finish === "raw"
          ? { filter: `brightness(0.9) contrast(1.2)` }
          : stone.finish === "cut"
            ? { filter: `brightness(1.3) contrast(1.3)` }
            : {}

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
            clipPath: clipPath,
            backgroundImage: texturePattern,
            backgroundSize: "cover",
            ...elevationStyle,
            ...lightingStyle,
            ...finishStyle,
            opacity: stone.opacity,
            zIndex: stone.selected ? 10 : 1,
          }}
        >
          {/* Reflexo de luz */}
          {stone.finish === "polished" && (
            <div
              className="absolute"
              style={{
                width: `${stone.size * 0.4}px`,
                height: `${stone.size * 0.2}px`,
                left: `${stone.size * 0.3}px`,
                top: `${stone.size * 0.2}px`,
                background: `radial-gradient(ellipse at center, rgba(255,255,255,${stone.reflectivity * 0.8}) 0%, rgba(255,255,255,0) 70%)`,
                borderRadius: "50%",
                transform: "rotate(-20deg)",
              }}
            />
          )}
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

        {/* Efeito de brilho (glow) */}
        {lightingEffect && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${stone.x - stone.size}px`,
              top: `${stone.y - stone.size}px`,
              width: `${stone.size * 2}px`,
              height: `${stone.size * 2}px`,
              background: `radial-gradient(circle, ${stone.color}33 0%, transparent 70%)`,
              opacity: stone.glow,
              zIndex: 0,
              filter: "blur(4px)",
            }}
          />
        )}
      </>
    )
  }

  // Função para obter o estilo da caixa
  const getBoxStyle = () => {
    switch (boxStyle) {
      case "golden":
        return {
          background: "linear-gradient(45deg, #d4af37 0%, #f9f295 50%, #d4af37 100%)",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.4)",
          border: "8px solid",
          borderImage: "linear-gradient(45deg, #b8860b, #ffd700, #b8860b) 1",
        }
      case "wooden":
        return {
          background: "linear-gradient(45deg, #8b4513 0%, #a0522d 50%, #8b4513 100%)",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.4)",
          border: "8px solid",
          borderImage: "linear-gradient(45deg, #5d2906, #8b4513, #5d2906) 1",
        }
      case "dark":
        return {
          background: "linear-gradient(45deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
          boxShadow: "inset 0 0 20px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.5)",
          border: "8px solid",
          borderImage: "linear-gradient(45deg, #000000, #333333, #000000) 1",
        }
      default:
        return {}
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      {/* Campo de pergunta */}
      <div className="w-full mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua pergunta para o oráculo..."
            className="flex-grow p-2 rounded-md bg-white/10 border border-white/20 text-white"
          />
        </div>
      </div>

      {/* Filtro de pedras */}
      <div className="w-full mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {stoneCategories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full ${
                selectedCategory === category
                  ? "bg-white/20 border border-white/40"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        <input
          type="text"
          value={stoneFilter}
          onChange={(e) => setStoneFilter(e.target.value)}
          placeholder="Buscar pedras por nome ou significado..."
          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
        />
      </div>

      {/* Lista de pedras */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 max-h-40 overflow-y-auto w-full">
        {getFilteredStones().map((stoneType) => {
          const stone = stonePrompts[stoneType as keyof typeof stonePrompts]
          return (
            <TooltipProvider key={stoneType}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setSelectedStoneType(stoneType)}
                      className={`px-3 py-1 rounded-full ${
                        selectedStoneType === stoneType
                          ? "bg-white/20 border border-white/40"
                          : "bg-white/5 border border-white/10"
                      }`}
                      style={{ color: stone.color }}
                      disabled={isScanning || scanComplete}
                    >
                      {stone.name}
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{stone.meaning}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      <div className="relative w-full">
        {/* Caixa Virtual */}
        <div
          ref={boxRef}
          className={`virtual-stone-box relative w-full h-[400px] rounded-md overflow-hidden cursor-pointer transition-all duration-500 ${
            is3DMode ? "transform-style-3d perspective-800" : ""
          }`}
          style={{
            ...getBoxStyle(),
            transform: is3DMode ? "rotateX(20deg)" : "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Fundo da caixa com textura */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                boxStyle === "golden"
                  ? "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ea20dadfd091d7a597050ee805d66c0d1858d37d2b60aaf0a0ebbb0515f6fad3.jpg-g6vnzwsT7IlOSqOV3EWT45S7cbJX9p.jpeg')"
                  : boxStyle === "wooden"
                    ? "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAIXA%20%20IMAGE%201.jpg-AsZHIyfbjunxC95WuocYQG1ukxk7cM.jpeg')"
                    : "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAIXA%20%20IMAGE%201.jpg-AsZHIyfbjunxC95WuocYQG1ukxk7cM.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: boxStyle === "dark" ? "brightness(0.3)" : "none",
            }}
          />

          {/* Linhas de grade para efeito 3D */}
          {is3DMode && (
            <div className="absolute inset-0">
              <div className="w-full h-full grid grid-cols-12 grid-rows-6">
                {Array.from({ length: 12 * 6 }).map((_, i) => (
                  <div key={i} className="border border-white/5"></div>
                ))}
              </div>
            </div>
          )}

          {/* Renderiza todas as pedras */}
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
                {renderRealisticStone(stone)}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Overlay de escaneamento */}
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

          {/* Overlay de exemplo */}
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
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAIXA%20%20IMAGE%201.jpg-AsZHIyfbjunxC95WuocYQG1ukxk7cM.jpeg"
                    alt="Exemplo de disposição de pedras"
                    fill
                    className="object-contain"
                  />
                  <button
                    className="absolute top-2 right-2 bg-white/20 rounded-full p-1 hover:bg-white/40 transition-colors"
                    onClick={toggleExample}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay de informações da pedra */}
          <AnimatePresence>
            {showStoneInfo && selectedStoneInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center z-20"
              >
                <Card className="bg-black/80 border-white/20 max-w-md">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: selectedStoneInfo.color }}>
                      {selectedStoneInfo.name}
                    </h3>
                    <p className="text-white mb-4">{selectedStoneInfo.meaning}</p>
                    <div
                      className="w-20 h-20 mx-auto mb-4 rounded-full"
                      style={{
                        backgroundColor: selectedStoneInfo.color,
                        boxShadow: `0 0 20px ${selectedStoneInfo.color}80`,
                      }}
                    ></div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div className="text-left">
                        <p className="text-gray-400">Origem:</p>
                        <p className="text-white">{selectedStoneInfo.origin}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400">Energia:</p>
                        <p className="text-white">{Math.round(selectedStoneInfo.energy)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400">Textura:</p>
                        <p className="text-white">{selectedStoneInfo.texture}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400">Acabamento:</p>
                        <p className="text-white">{selectedStoneInfo.finish}</p>
                      </div>
                    </div>
                    <Button onClick={() => setShowStoneInfo(false)} className="bg-white/10 hover:bg-white/20">
                      Fechar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay da mandala quando o escaneamento estiver completo */}
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
                        onClick={exportImage}
                        className="bg-[#6a1fc7] hover:bg-[#8e2de2] text-white"
                        disabled={isCapturingImage}
                      >
                        <Download className="w-4 h-4 mr-2" /> {videoUrl ? "Baixar Imagem" : "Capturar Imagem"}
                      </Button>
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

        {/* Controles */}
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

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleLightingEffect}
              variant="outline"
              className={`border transition-colors ${
                lightingEffect ? "bg-[#8e2de2]/30 border-[#8e2de2]" : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
              disabled={isScanning}
            >
              <Lightbulb className="w-4 h-4 mr-2" /> Iluminação {lightingEffect ? "✓" : ""}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={cycleBoxStyle}
              variant="outline"
              className="bg-white/5 border border-white/20 hover:bg-white/10"
              disabled={isScanning}
            >
              Estilo: {boxStyle === "golden" ? "Dourado" : boxStyle === "wooden" ? "Madeira" : "Escuro"}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleShowAllStones}
              variant="outline"
              className="bg-white/5 border border-white/20 hover:bg-white/10"
              disabled={isScanning}
            >
              {showAllStones ? "Mostrar Menos" : "Mostrar Todas (33)"}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-white/70">
        <p>Clique para adicionar pedras ou arraste para movê-las</p>
        <p>Shift+Clique em uma pedra para ver suas informações</p>
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

      {/* Elementos ocultos para áudio */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
