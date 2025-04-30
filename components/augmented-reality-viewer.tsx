"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, RotateCcw, ZoomIn, Move, Maximize2, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { stonePrompts } from "@/lib/stone-prompts"
import Image from "next/image"

// Importação de bibliotecas 3D
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface ARViewerProps {
  onClose: () => void
}

export default function AugmentedRealityViewer({ onClose }: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [cameraActive, setCameraActive] = useState(false)
  const [arSupported, setArSupported] = useState(false)
  const [selectedStone, setSelectedStone] = useState<string | null>(null)
  const [placedStones, setPlacedStones] = useState<any[]>([])
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"place" | "move" | "rotate" | "scale">("place")
  const [showInstructions, setShowInstructions] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const modelsRef = useRef<{ [key: string]: THREE.Group }>({})

  // Verificar suporte a WebXR
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      if ("xr" in navigator) {
        // @ts-ignore - TypeScript não reconhece a API WebXR
        navigator.xr
          ?.isSessionSupported("immersive-ar")
          .then((supported) => {
            setArSupported(supported)
          })
          .catch(() => {
            setArSupported(false)
          })
      } else {
        setArSupported(false)
      }
    }

    // Inicializar Three.js
    initThreeJS()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  // Inicializar Three.js
  const initThreeJS = () => {
    if (!canvasRef.current) return

    // Criar cena
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Criar câmera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Criar renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    // Adicionar luz
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Adicionar controles
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controlsRef.current = controls

    // Carregar modelos 3D das pedras
    loadStoneModels()

    // Iniciar loop de renderização
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (controlsRef.current) {
        controlsRef.current.update()
      }

      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    // Ajustar tamanho ao redimensionar a janela
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }

  // Carregar modelos 3D das pedras
  const loadStoneModels = () => {
    const loader = new GLTFLoader()
    const stones = Object.keys(stonePrompts)
    let loadedCount = 0

    // Para cada pedra, criar um modelo 3D simples
    stones.forEach((stoneKey) => {
      const stone = stonePrompts[stoneKey]

      // Criar geometria básica para a pedra
      let geometry

      // Escolher forma com base no tipo de pedra
      switch (Math.floor(Math.random() * 5)) {
        case 0:
          geometry = new THREE.DodecahedronGeometry(1, 0) // Forma cristalina
          break
        case 1:
          geometry = new THREE.OctahedronGeometry(1, 0) // Forma cristalina
          break
        case 2:
          geometry = new THREE.IcosahedronGeometry(1, 0) // Forma cristalina
          break
        case 3:
          geometry = new THREE.TetrahedronGeometry(1, 0) // Forma cristalina
          break
        default:
          // Criar forma personalizada para pedras mais orgânicas
          const customGeometry = new THREE.SphereGeometry(1, 8, 8)
          const positionAttribute = customGeometry.getAttribute("position")

          // Distorcer a esfera para criar uma forma mais natural
          for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i)
            const y = positionAttribute.getY(i)
            const z = positionAttribute.getZ(i)

            const noise = Math.sin(x * 3) * 0.1 + Math.cos(y * 2) * 0.1 + Math.sin(z * 5) * 0.1

            positionAttribute.setX(i, x + x * noise)
            positionAttribute.setY(i, y + y * noise)
            positionAttribute.setZ(i, z + z * noise)
          }

          positionAttribute.needsUpdate = true
          geometry = customGeometry
      }

      // Converter cor hex para valores RGB
      const color = stone.color.replace("#", "0x")
      const colorValue = Number.parseInt(color, 16)
      const r = (colorValue >> 16) & 255
      const g = (colorValue >> 8) & 255
      const b = colorValue & 255

      // Criar material com propriedades físicas realistas
      const material = new THREE.MeshStandardMaterial({
        color: stone.color,
        metalness: 0.1,
        roughness: 0.7,
        emissive: new THREE.Color(r / 1000, g / 1000, b / 1000),
        emissiveIntensity: 0.2,
        flatShading: true,
      })

      // Criar malha
      const mesh = new THREE.Mesh(geometry, material)

      // Criar grupo para a pedra
      const group = new THREE.Group()
      group.add(mesh)

      // Adicionar reflexos e detalhes
      const reflectionGeometry = new THREE.SphereGeometry(0.2, 8, 8)
      const reflectionMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      })

      const reflection = new THREE.Mesh(reflectionGeometry, reflectionMaterial)
      reflection.position.set(0.5, 0.5, 0.5)
      group.add(reflection)

      // Armazenar o modelo
      modelsRef.current[stoneKey] = group

      loadedCount++
      if (loadedCount === stones.length) {
        setIsLoading(false)
      }
    })
  }

  // Iniciar a câmera
  const startCamera = async () => {
    try {
      if (!videoRef.current) return

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      videoRef.current.srcObject = stream
      videoRef.current.play()

      setCameraActive(true)
      setError(null)
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err)
      setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.")
    }
  }

  // Parar a câmera
  const stopCamera = () => {
    if (!videoRef.current) return

    const stream = videoRef.current.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    videoRef.current.srcObject = null
    setCameraActive(false)
  }

  // Selecionar uma pedra
  const selectStone = (stoneKey: string) => {
    setSelectedStone(stoneKey)
  }

  // Colocar uma pedra no ambiente
  const placeStone = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedStone || !sceneRef.current || mode !== "place") return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Criar clone do modelo
    const stoneModel = modelsRef.current[selectedStone]
    if (!stoneModel) return

    const stoneClone = stoneModel.clone()

    // Posicionar a pedra no espaço 3D
    const vector = new THREE.Vector3(x, y, -1).unproject(cameraRef.current!)
    const dir = vector.sub(cameraRef.current!.position).normalize()
    const distance = -cameraRef.current!.position.z / dir.z
    const pos = cameraRef.current!.position.clone().add(dir.multiplyScalar(distance))

    stoneClone.position.copy(pos)
    stoneClone.scale.set(0.2, 0.2, 0.2)

    // Adicionar à cena
    sceneRef.current.add(stoneClone)

    // Adicionar à lista de pedras colocadas
    setPlacedStones([
      ...placedStones,
      {
        id: `stone-${Date.now()}`,
        type: selectedStone,
        model: stoneClone,
      },
    ])
  }

  // Capturar imagem
  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Desenhar o vídeo
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

    // Capturar a renderização 3D
    if (rendererRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height)
    }

    // Converter para URL de dados
    const dataUrl = canvas.toDataURL("image/png")
    setCapturedImage(dataUrl)
  }

  // Limpar todas as pedras
  const clearStones = () => {
    if (!sceneRef.current) return

    // Remover todas as pedras da cena
    placedStones.forEach((stone) => {
      sceneRef.current?.remove(stone.model)
    })

    setPlacedStones([])
  }

  // Baixar imagem capturada
  const downloadImage = () => {
    if (!capturedImage) return

    const link = document.createElement("a")
    link.href = capturedImage
    link.download = `pedras-misticas-ar-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Renderizar pedras disponíveis
  const renderStoneOptions = () => {
    return (
      <div className="flex flex-wrap gap-2 p-2 bg-black/30 backdrop-blur-sm rounded-lg max-h-32 overflow-y-auto">
        {Object.entries(stonePrompts).map(([key, stone]) => (
          <button
            key={key}
            onClick={() => selectStone(key)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedStone === key ? "ring-2 ring-white" : ""
            }`}
            style={{ backgroundColor: stone.color }}
            title={stone.name}
          >
            <span className="sr-only">{stone.name}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Vídeo da câmera */}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />

      {/* Canvas para renderização 3D */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" onClick={placeStone} />

      {/* Overlay de instruções */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-10"
          >
            <div className="bg-black/80 p-6 rounded-xl max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#ff9be2]">Realidade Aumentada</h2>
              <p className="mb-4">
                Visualize as pedras místicas em seu ambiente real! Permita o acesso à câmera e posicione seu dispositivo
                para começar.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <Camera className="h-6 w-6 text-[#ff9be2]" />
                  </div>
                  <p className="text-sm">Aponte a câmera para uma superfície plana</p>
                </div>

                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <Move className="h-6 w-6 text-[#ff9be2]" />
                  </div>
                  <p className="text-sm">Toque para posicionar as pedras no ambiente</p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setShowInstructions(false)
                  startCamera()
                }}
                className="bg-[#8e2de2] hover:bg-[#a100f5] text-white"
              >
                Começar Experiência
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensagem de erro */}
      {error && (
        <div className="absolute top-20 left-0 right-0 mx-auto w-max bg-red-500/80 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Controles superiores */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Button
          onClick={onClose}
          variant="outline"
          className="bg-black/50 border-white/20 hover:bg-black/70 h-10 w-10 p-0 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex gap-2">
          {cameraActive && (
            <Button onClick={captureImage} className="bg-[#8e2de2] hover:bg-[#a100f5] h-10 w-10 p-0 rounded-full">
              <Camera className="h-5 w-5" />
            </Button>
          )}

          {capturedImage && (
            <Button onClick={downloadImage} className="bg-[#6a1fc7] hover:bg-[#8e2de2] h-10 w-10 p-0 rounded-full">
              <Download className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Controles inferiores */}
      {cameraActive && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-4">
          {/* Modos de interação */}
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setMode("place")}
              className={`h-10 w-10 p-0 rounded-full ${
                mode === "place" ? "bg-[#8e2de2]" : "bg-black/50 border-white/20"
              }`}
              title="Colocar pedras"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => setMode("move")}
              className={`h-10 w-10 p-0 rounded-full ${
                mode === "move" ? "bg-[#8e2de2]" : "bg-black/50 border-white/20"
              }`}
              title="Mover pedras"
            >
              <Move className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => setMode("rotate")}
              className={`h-10 w-10 p-0 rounded-full ${
                mode === "rotate" ? "bg-[#8e2de2]" : "bg-black/50 border-white/20"
              }`}
              title="Rotacionar pedras"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => setMode("scale")}
              className={`h-10 w-10 p-0 rounded-full ${
                mode === "scale" ? "bg-[#8e2de2]" : "bg-black/50 border-white/20"
              }`}
              title="Redimensionar pedras"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>

            <Button
              onClick={clearStones}
              className="h-10 w-10 p-0 rounded-full bg-black/50 border-white/20 hover:bg-red-500/70"
              title="Limpar todas as pedras"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Seleção de pedras */}
          <div className="flex justify-center">{renderStoneOptions()}</div>
        </div>
      )}

      {/* Tela de carregamento */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#8e2de2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Carregando experiência de realidade aumentada...</p>
          </div>
        </div>
      )}

      {/* Imagem capturada */}
      {capturedImage && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-20">
          <div className="relative max-w-2xl w-full">
            <Image
              src={capturedImage || "/placeholder.svg"}
              alt="Captura com pedras em realidade aumentada"
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />

            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={() => setCapturedImage(null)}
                variant="outline"
                className="bg-black/50 border-white/20 hover:bg-black/70 h-10 w-10 p-0 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>

              <Button onClick={downloadImage} className="bg-[#8e2de2] hover:bg-[#a100f5] h-10 w-10 p-0 rounded-full">
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
