"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Shapes, Sparkles, RefreshCw, Download } from "lucide-react"

interface MandalaCustomizerProps {
  initialParams: any
  onParamsChange: (params: any) => void
  onSave?: () => void
}

const SHAPES = ["circle", "flower", "triangle", "square"]
const PRESET_COLOR_PALETTES = [
  ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"], // Roxo e rosa
  ["#2de28e", "#9be2ff", "#1fc76a", "#005d36", "#74f0c7"], // Verde e azul
  ["#e28e2d", "#ffbe9b", "#c76a1f", "#5d3600", "#f0c774"], // Laranja e amarelo
  ["#2d8ee2", "#9bffbe", "#1f6ac7", "#00365d", "#74c7f0"], // Azul e verde
  ["#e22d8e", "#ff9bbe", "#c71f6a", "#5d0036", "#f074c7"], // Rosa e roxo
  ["#ffffff", "#d1d1d1", "#a0a0a0", "#606060", "#303030"], // Escala de cinza
  ["#ff0000", "#ff7700", "#ffff00", "#00ff00", "#0000ff"], // Arco-íris
  ["#000000", "#1a1a1a", "#333333", "#4d4d4d", "#666666"], // Tons de preto
]

const SYMBOLS = ["estrela", "espiral", "lua", "flor", "olho", "círculo", "triângulo", "hexágono"]

export default function MandalaCustomizer({ initialParams, onParamsChange, onSave }: MandalaCustomizerProps) {
  const [params, setParams] = useState(initialParams)
  const [activeTab, setActiveTab] = useState("cores")

  // Atualiza os parâmetros quando o componente é montado
  useEffect(() => {
    setParams(initialParams)
  }, [initialParams])

  // Função para atualizar os parâmetros e notificar o componente pai
  const updateParams = (updates: any) => {
    const newParams = { ...params, ...updates }
    setParams(newParams)
    onParamsChange(newParams)
  }

  // Função para aplicar uma paleta de cores predefinida
  const applyColorPalette = (palette: string[]) => {
    updateParams({ colors: [...palette] })
  }

  // Função para gerar uma paleta de cores aleatória
  const generateRandomPalette = () => {
    const randomPalette = Array(5)
      .fill(0)
      .map(() => {
        return `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
      })
    updateParams({ colors: randomPalette })
  }

  // Função para atualizar uma cor específica na paleta
  const updateColor = (index: number, color: string) => {
    const newColors = [...params.colors]
    newColors[index] = color
    updateParams({ colors: newColors })
  }

  // Função para adicionar um símbolo
  const addSymbol = (symbol: string) => {
    const currentSymbols = params.symbols || []
    if (!currentSymbols.includes(symbol)) {
      updateParams({ symbols: [...currentSymbols, symbol] })
    }
  }

  // Função para remover um símbolo
  const removeSymbol = (symbol: string) => {
    const currentSymbols = params.symbols || []
    updateParams({ symbols: currentSymbols.filter((s: string) => s !== symbol) })
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-white mb-4">Personalizar Mandala</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="cores" className="flex items-center gap-2">
            <Palette className="w-4 h-4" /> Cores
          </TabsTrigger>
          <TabsTrigger value="forma" className="flex items-center gap-2">
            <Shapes className="w-4 h-4" /> Forma
          </TabsTrigger>
          <TabsTrigger value="detalhes" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Detalhes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cores" className="space-y-4">
          {/* Paletas predefinidas */}
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Paletas Predefinidas</Label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLOR_PALETTES.map((palette, index) => (
                <button
                  key={index}
                  className="h-8 rounded-md overflow-hidden flex cursor-pointer border border-gray-700 hover:border-white/50 transition-colors"
                  onClick={() => applyColorPalette(palette)}
                >
                  {palette.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1 h-full"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </button>
              ))}
            </div>
          </div>

          {/* Cores individuais */}
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Cores Personalizadas</Label>
            <div className="grid grid-cols-5 gap-2">
              {params.colors?.map((color: string, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-gray-700"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-400 mt-1">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={generateRandomPalette}
            variant="outline"
            size="sm"
            className="w-full mt-2 border-gray-700 text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Gerar Paleta Aleatória
          </Button>
        </TabsContent>

        <TabsContent value="forma" className="space-y-4">
          {/* Forma da mandala */}
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Forma Base</Label>
            <div className="grid grid-cols-4 gap-2">
              {SHAPES.map((shape) => (
                <button
                  key={shape}
                  className={`p-2 rounded-md border ${
                    params.shape === shape
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                  onClick={() => updateParams({ shape })}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center">
                      {shape === "circle" && <div className="w-8 h-8 rounded-full bg-white/80"></div>}
                      {shape === "flower" && (
                        <div className="relative w-10 h-10">
                          {[0, 60, 120, 180, 240, 300].map((angle) => (
                            <div
                              key={angle}
                              className="absolute w-4 h-4 rounded-full bg-white/80"
                              style={{
                                top: `${50 - 40 * Math.cos((angle * Math.PI) / 180)}%`,
                                left: `${50 - 40 * Math.sin((angle * Math.PI) / 180)}%`,
                              }}
                            ></div>
                          ))}
                          <div className="absolute w-4 h-4 rounded-full bg-white/80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                      )}
                      {shape === "triangle" && (
                        <div className="w-0 h-0 mx-auto border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-white/80"></div>
                      )}
                      {shape === "square" && <div className="w-8 h-8 bg-white/80"></div>}
                    </div>
                    <span className="text-xs text-gray-300 capitalize">{shape}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Número de camadas */}
          <div>
            <div className="flex justify-between">
              <Label className="text-sm text-gray-400">Número de Camadas</Label>
              <span className="text-sm text-gray-400">{params.layers || 6}</span>
            </div>
            <Slider
              value={[params.layers || 6]}
              min={3}
              max={12}
              step={1}
              onValueChange={(value) => updateParams({ layers: value[0] })}
              className="my-2"
            />
          </div>

          {/* Complexidade */}
          <div>
            <div className="flex justify-between">
              <Label className="text-sm text-gray-400">Complexidade</Label>
              <span className="text-sm text-gray-400">{params.complexity || 8}</span>
            </div>
            <Slider
              value={[params.complexity || 8]}
              min={1}
              max={15}
              step={1}
              onValueChange={(value) => updateParams({ complexity: value[0] })}
              className="my-2"
            />
          </div>
        </TabsContent>

        <TabsContent value="detalhes" className="space-y-4">
          {/* Símbolos */}
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Símbolos</Label>
            <div className="grid grid-cols-4 gap-2">
              {SYMBOLS.map((symbol) => {
                const isSelected = params.symbols?.includes(symbol)
                return (
                  <button
                    key={symbol}
                    className={`p-2 rounded-md border ${
                      isSelected ? "border-purple-500 bg-purple-500/20" : "border-gray-700 hover:border-gray-500"
                    }`}
                    onClick={() => (isSelected ? removeSymbol(symbol) : addSymbol(symbol))}
                  >
                    <span className="text-xs text-gray-300 capitalize">{symbol}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Velocidade de rotação */}
          <div>
            <div className="flex justify-between">
              <Label className="text-sm text-gray-400">Velocidade de Rotação</Label>
              <span className="text-sm text-gray-400">{params.rotationSpeed || 1}x</span>
            </div>
            <Slider
              value={[params.rotationSpeed || 1]}
              min={0}
              max={5}
              step={0.1}
              onValueChange={(value) => updateParams({ rotationSpeed: value[0] })}
              className="my-2"
            />
          </div>

          {/* Qualidade */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="highQuality"
              checked={params.highQuality || false}
              onChange={(e) => updateParams({ highQuality: e.target.checked })}
              className="rounded border-gray-700"
            />
            <Label htmlFor="highQuality" className="text-sm text-gray-300">
              Alta Qualidade (efeitos adicionais)
            </Label>
          </div>
        </TabsContent>
      </Tabs>

      {onSave && (
        <Button onClick={onSave} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" /> Salvar Mandala
        </Button>
      )}
    </div>
  )
}
