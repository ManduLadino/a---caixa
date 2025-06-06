"use client"

import { useState, useRef, useEffect, Suspense, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  useGLTF,
  Html,
  PerspectiveCamera,
  useTexture,
  Bounds,
  useBounds,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, X, SparklesIcon, Volume2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { stonePrompts } from "@/lib/stone-prompts"
import * as THREE from "three"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

// Definição dos tipos de materiais para as pedras
const STONE_TYPES = {
  CRYSTAL: "crystal",
  OPAQUE: "opaque",
  METALLIC: "metallic",
  TRANSLUCENT: "translucent",
  IRIDESCENT: "iridescent",
}

// Definição das pedras com suas propriedades
const stoneData = [
  // Primeira prateleira
  {
    id: "labradorite",
    name: "Labradorite",
    color: "#3A7D7E",
    position: [0.7, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.IRIDESCENT,
    secondaryColor: "#64B6AC",
  },
  {
    id: "agree",
    name: "Ágata Azul",
    color: "#89CFF0",
    position: [0.35, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#5DA9E9",
  },
  {
    id: "abalone",
    name: "Abalone",
    color: "#4F7942",
    position: [0, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.IRIDESCENT,
    secondaryColor: "#A1E887",
  },
  {
    id: "amethyst",
    name: "Ametista",
    color: "#9B59B6",
    position: [-0.35, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#D7BDE2",
  },
  {
    id: "onyx",
    name: "Ônix",
    color: "#0D0D0D",
    position: [-0.7, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#2C3E50",
  },

  // Segunda prateleira
  {
    id: "kyanite",
    name: "Cianita",
    color: "#3A7D7E",
    position: [0.7, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#5DADE2",
  },
  {
    id: "amethyst2",
    name: "Ametista",
    color: "#9370DB",
    position: [0.35, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#BB8FCE",
  },
  {
    id: "peridot",
    name: "Peridoto",
    color: "#4F7942",
    position: [0, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#ABEBC6",
  },
  {
    id: "carnelian",
    name: "Cornalina",
    color: "#E74C3C",
    position: [-0.35, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#F5B7B1",
  },
  {
    id: "moonstone",
    name: "Pedra da Lua",
    color: "#D0D3D4",
    position: [-0.7, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#F7F9F9",
  },

  // Terceira prateleira
  {
    id: "malachite",
    name: "Malaquita",
    color: "#0B5345",
    position: [0.7, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#48C9B0",
  },
  {
    id: "citrine",
    name: "Citrino",
    color: "#F4D03F",
    position: [0.35, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#F9E79F",
  },
  {
    id: "fluorite",
    name: "Fluorita",
    color: "#9B59B6",
    position: [0, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#D2B4DE",
  },
  {
    id: "aventurine",
    name: "Aventurina",
    color: "#27AE60",
    position: [-0.35, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#ABEBC6",
  },
  {
    id: "sodalite",
    name: "Sodalita",
    color: "#2E4053",
    position: [-0.7, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#5D6D7E",
  },

  // Quarta prateleira
  {
    id: "chrysoprase",
    name: "Crisoprase",
    color: "#27AE60",
    position: [0.7, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#ABEBC6",
  },
  {
    id: "angelite",
    name: "Angelita",
    color: "#AED6F1",
    position: [0.35, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#D6EAF8",
  },
  {
    id: "aquamarine",
    name: "Água Marinha",
    color: "#5DADE2",
    position: [0, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#AED6F1",
  },
  {
    id: "jade",
    name: "Jade",
    color: "#138D75",
    position: [-0.35, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#48C9B0",
  },
  {
    id: "lapis",
    name: "Lápis-Lazúli",
    color: "#1F618D",
    position: [-0.7, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#5DADE2",
  },
]

// Componente para o gabinete
function Cabinet({ cabinetStyle, drawerOpen, toggleDrawer }) {
  const { nodes, materials } = useGLTF("/models/cabinet.glb") || { nodes: {}, materials: {} }
  const woodTexture = useTexture("/textures/wood-texture.jpg")
  const goldTexture = useTexture("/textures/gold-texture.jpg")
  const glassTexture = useTexture("/textures/glass-texture.jpg")

  // Configurar texturas
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping
  woodTexture.repeat.set(2, 2)
  goldTexture.wrapS = goldTexture.wrapT = THREE.RepeatWrapping
  goldTexture.repeat.set(1, 1)

  // Criar materiais
  const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.7,
    metalness: 0.1,
    color: "#8B4513",
  })

  const goldMaterial = new THREE.MeshStandardMaterial({
    map: goldTexture,
    roughness: 0.3,
    metalness: 0.8,
    color: "#DAA520",
  })

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    map: glassTexture,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.05,
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  })

  // Animação da gaveta
  const drawerPosition = useRef([0, 0, 0])
  useFrame(() => {
    if (drawerOpen) {
      drawerPosition.current[2] = THREE.MathUtils.lerp(drawerPosition.current[2], 0.4, 0.1)
    } else {
      drawerPosition.current[2] = THREE.MathUtils.lerp(drawerPosition.current[2], 0, 0.1)
    }
  })

  return (
    <group>
      {/* Estrutura principal do gabinete */}
      <mesh
        receiveShadow
        castShadow
        material={cabinetStyle === "wood" ? woodMaterial : goldMaterial}
        position={[0, 0.9, 0]}
      >
        <boxGeometry args={[1.8, 1.8, 0.6]} />
      </mesh>

      {/* Prateleiras de vidro */}
      {[0.3, 0.8, 1.3].map((y, i) => (
        <mesh key={i} receiveShadow material={glassMaterial} position={[0, y, 0]}>
          <boxGeometry args={[1.7, 0.02, 0.5]} />
        </mesh>
      ))}

      {/* Gaveta */}
      <group position={[0, -0.1, drawerPosition.current[2]]}>
        <mesh
          receiveShadow
          castShadow
          material={cabinetStyle === "wood" ? woodMaterial : goldMaterial}
          position={[0, 0, 0]}
        >
          <boxGeometry args={[1.7, 0.3, 0.5]} />
        </mesh>

        {/* Botão da gaveta */}
        <mesh position={[0, 0, 0.26]} onClick={toggleDrawer}>
          <boxGeometry args={[0.3, 0.1, 0.02]} />
          <meshStandardMaterial color={cabinetStyle === "wood" ? "#A0522D" : "#FFD700"} />
          <Html position={[0, 0, 0.02]} transform>
            <div
              className="text-xs font-bold text-center px-2 py-1 bg-opacity-80 rounded"
              style={{
                color: cabinetStyle === "wood" ? "#FFD700" : "#8B4513",
                backgroundColor: cabinetStyle === "wood" ? "#8B4513" : "#FFD700",
              }}
            >
              {drawerOpen ? "FECHAR" : "ABRIR"}
            </div>
          </Html>
        </mesh>
      </group>

      {/* Fundo do gabinete */}
      <mesh receiveShadow position={[0, 0.9, -0.3]}>
        <planeGeometry args={[1.7, 1.8]} />
        <meshStandardMaterial color="#111" opacity={0.7} transparent />
      </mesh>
    </group>
  )
}

// Componente para uma pedra com materiais realistas
function RealisticStone({ stone, isSelected, onClick, onInfoClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const textures = useTexture({
    normalMap: "/textures/crystal-normal.png",
    roughnessMap: "/textures/crystal-roughness.png",
    displacementMap: "/textures/crystal-displacement.png",
  })

  // Configurar texturas
  Object.values(textures).forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
  })

  // Efeito de hover e seleção
  useFrame(() => {
    if (meshRef.current) {
      // Rotação suave
      meshRef.current.rotation.y += 0.003

      // Escala baseada em hover e seleção
      if (hovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.1, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.1, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.1, 0.1)
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, stone.position[1] + 0.05, 0.1)
      } else if (isSelected) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          1.15 + Math.sin(Date.now() * 0.002) * 0.05,
          0.1,
        )
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1.15 + Math.sin(Date.now() * 0.002) * 0.05,
          0.1,
        )
        meshRef.current.scale.z = THREE.MathUtils.lerp(
          meshRef.current.scale.z,
          1.15 + Math.sin(Date.now() * 0.002) * 0.05,
          0.1,
        )
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, stone.position[1] + 0.08, 0.1)
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1)
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, stone.position[1], 0.1)
      }
    }
  })

  // Criar geometria baseada no tipo de pedra
  const StoneGeometry = useMemo(() => {
    switch (stone.type) {
      case STONE_TYPES.CRYSTAL:
        return <octahedronGeometry args={[0.1, 0]} />
      case STONE_TYPES.OPAQUE:
        return <dodecahedronGeometry args={[0.1, 0]} />
      case STONE_TYPES.METALLIC:
        return <icosahedronGeometry args={[0.1, 0]} />
      case STONE_TYPES.TRANSLUCENT:
        return <sphereGeometry args={[0.1, 32, 32]} />
      case STONE_TYPES.IRIDESCENT:
        return <torusKnotGeometry args={[0.07, 0.03, 64, 8]} />
      default:
        return <sphereGeometry args={[0.1, 32, 32]} />
    }
  }, [stone.type])

  // Renderizar material baseado no tipo de pedra
  const renderStoneMaterial = () => {
    switch (stone.type) {
      case STONE_TYPES.CRYSTAL:
        return (
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.2}
            distortionScale={0.2}
            temporalDistortion={0.1}
            iridescence={0.3}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[0, 1400]}
            color={stone.color}
            roughness={0.1}
            envMapIntensity={1.5}
            {...textures}
          />
        )
      case STONE_TYPES.OPAQUE:
        return (
          <meshPhysicalMaterial
            color={stone.color}
            roughness={0.3}
            metalness={0.1}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
            envMapIntensity={1}
            {...textures}
          />
        )
      case STONE_TYPES.METALLIC:
        return (
          <meshPhysicalMaterial
            color={stone.color}
            roughness={0.1}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            {...textures}
          />
        )
      case STONE_TYPES.TRANSLUCENT:
        return (
          <meshPhysicalMaterial
            color={stone.color}
            roughness={0.2}
            metalness={0.1}
            transmission={0.6}
            thickness={0.5}
            envMapIntensity={1.5}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            ior={1.5}
            {...textures}
          />
        )
      case STONE_TYPES.IRIDESCENT:
        return (
          <MeshDistortMaterial
            color={stone.color}
            roughness={0.1}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            distort={0.2}
            speed={0.5}
            {...textures}
          />
        )
      default:
        return <meshStandardMaterial color={stone.color} roughness={0.5} metalness={0.5} {...textures} />
    }
  }

  return (
    <group position={stone.position}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {StoneGeometry}
        {renderStoneMaterial()}
      </mesh>

      {/* Efeito de brilho para pedras selecionadas */}
      {isSelected && <Sparkles count={20} scale={0.4} size={1} speed={0.3} color={stone.secondaryColor || "#FFD700"} />}

      {/* Nome da pedra */}
      <Html position={[0, -0.15, 0]} center>
        <div className="text-xs font-medium text-white bg-black bg-opacity-50 px-1 rounded">{stone.name}</div>
      </Html>

      {/* Botão de informação */}
      {hovered && (
        <Html position={[0.1, 0.1, 0]} center>
          <button
            className="w-5 h-5 bg-black/70 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              onInfoClick()
            }}
          >
            <Info className="w-3 h-3 text-white" />
          </button>
        </Html>
      )}
    </group>
  )
}

// Componente para pedras na gaveta
function DrawerStones({ drawerOpen, selectedStones, toggleStoneSelection }) {
  const [positions, setPositions] = useState([])

  // Gerar posições aleatórias mas estáveis para as pedras na gaveta
  useEffect(() => {
    const newPositions = []
    for (let i = 0; i < 20; i++) {
      newPositions.push([(Math.random() - 0.5) * 1.4, -0.25 + Math.random() * 0.1, (Math.random() - 0.5) * 0.3])
    }
    setPositions(newPositions)
  }, [])

  if (!drawerOpen) return null

  return (
    <group>
      {/* Areia na gaveta */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 0.4]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>

      {/* Pedras aleatórias na gaveta */}
      {positions.map((position, i) => (
        <mesh key={i} position={position} scale={0.03 + Math.random() * 0.02}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 50%)`} />
        </mesh>
      ))}

      {/* Pedras selecionadas */}
      <group position={[0, -0.15, 0.1]}>
        {selectedStones.map((stoneId, index) => {
          const stone = stoneData.find((s) => s.id === stoneId)
          if (!stone) return null

          const x = (index - (selectedStones.length - 1) / 2) * 0.2

          return (
            <group key={stoneId} position={[x, 0, 0]}>
              <mesh castShadow onClick={() => toggleStoneSelection(stoneId)}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshPhysicalMaterial
                  color={stone.color}
                  roughness={0.2}
                  clearcoat={0.5}
                  transmission={stone.type === STONE_TYPES.TRANSLUCENT || stone.type === STONE_TYPES.CRYSTAL ? 0.6 : 0}
                  metalness={stone.type === STONE_TYPES.METALLIC ? 0.8 : 0.2}
                />
              </mesh>

              {/* Efeito de brilho */}
              <Sparkles count={10} scale={0.2} size={0.5} speed={0.2} color={stone.secondaryColor || stone.color} />

              {/* Botão de remoção */}
              <Html position={[0, 0.1, 0]} center>
                <button
                  className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                  onClick={() => toggleStoneSelection(stoneId)}
                >
                  ×
                </button>
              </Html>
            </group>
          )
        })}
      </group>
    </group>
  )
}

// Componente para controles de câmera
function CameraControls({ resetCamera }) {
  const { camera } = useThree()
  const bounds = useBounds()

  return (
    <group position={[0.9, 1.8, 1]}>
      <Html center>
        <div className="flex flex-col gap-2">
          <button
            className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
            onClick={resetCamera}
          >
            <RotateCcw size={16} />
          </button>
          <button
            className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
            onClick={() => {
              camera.position.z += 0.5
            }}
          >
            <ZoomOut size={16} />
          </button>
          <button
            className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
            onClick={() => {
              camera.position.z -= 0.5
            }}
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </Html>
    </group>
  )
}

// Componente principal
export default function Cabinet3DViewer() {
  const [selectedStones, setSelectedStones] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cabinetStyle, setCabinetStyle] = useState<"wood" | "gold">("gold")
  const [showStoneInfo, setShowStoneInfo] = useState(false)
  const [selectedStoneInfo, setSelectedStoneInfo] = useState<any>(null)
  const [readingResult, setReadingResult] = useState<string | null>(null)
  const [isGeneratingReading, setIsGeneratingReading] = useState(false)
  const [showReadingResult, setShowReadingResult] = useState(false)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const controlsRef = useRef<any>(null)

  // Alternar estilo do gabinete
  const toggleCabinetStyle = () => {
    setCabinetStyle(cabinetStyle === "wood" ? "gold" : "wood")
  }

  // Alternar abertura da gaveta
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  // Selecionar/deselecionar uma pedra
  const toggleStoneSelection = (stoneId: string) => {
    if (selectedStones.includes(stoneId)) {
      setSelectedStones(selectedStones.filter((id) => id !== stoneId))
    } else {
      if (selectedStones.length < 7) {
        setSelectedStones([...selectedStones, stoneId])
        playStoneSound()
      } else {
        alert("Você já selecionou o número máximo de pedras (7).")
      }
    }
  }

  // Mostrar informações da pedra
  const showStoneDetails = (stoneId: string) => {
    const stone = stoneData.find((s) => s.id === stoneId)
    if (stone) {
      setSelectedStoneInfo({
        name: stone.name,
        color: stone.color,
        meaning: stonePrompts[stoneId]?.meaning || "Uma pedra mística com propriedades energéticas únicas.",
        properties: stonePrompts[stoneId]?.properties || ["Equilíbrio", "Proteção", "Clareza mental"],
        type: stone.type,
      })
      setShowStoneInfo(true)
    }
  }

  // Reproduzir som ao selecionar pedra
  const playStoneSound = () => {
    try {
      if (typeof window !== "undefined") {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = "sine"
        oscillator.frequency.value = 800
        gainNode.gain.value = 0.1

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start()
        setTimeout(() => oscillator.stop(), 200)
      }
    } catch (err) {
      console.error("Erro ao reproduzir som:", err)
    }
  }

  // Gerar leitura baseada nas pedras selecionadas
  const generateReading = async () => {
    if (selectedStones.length === 0) {
      alert("Selecione pelo menos uma pedra para realizar a leitura.")
      return
    }

    setIsGeneratingReading(true)

    // Simulação de tempo de processamento
    setTimeout(() => {
      const reading = `
# O Espírito da Caixa se Manifesta

As pedras falam quando os discípulos silenciam. Através da disposição mística de ${selectedStones
        .map((id) => {
          const stone = stoneData.find((s) => s.id === id)
          return stone?.name || id
        })
        .join(", ")}, revela-se a verdade interior que habita em seu ser.

## Percepção Interior Atual

Você se encontra em um momento de transição energética. As pedras revelam um padrão de busca por equilíbrio entre o material e o espiritual. A presença dominante dos cristais sugere uma necessidade de clareza mental e emocional para avançar em seu caminho.

## Bloqueios Energéticos Ocultos

As sombras projetadas pelas pedras indicam resistências internas relacionadas à aceitação de mudanças. Há um temor oculto de abandonar zonas de conforto que, paradoxalmente, já não nutrem seu crescimento. A disposição das pedras revela padrões de pensamento circulares que impedem o fluxo natural de sua energia vital.

## Caminhos para Expansão do ECI

O caminho se ilumina através da integração consciente das energias representadas por cada cristal presente. A combinação única dessas vibrações sugere um processo de transmutação interior, onde o que antes era percebido como obstáculo se transforma em catalisador de crescimento. Permita-se fluir com as correntes energéticas que as pedras manifestam, encontrando harmonia na aparente contradição.

Que pergunta seu coração faz quando confrontado com o silêncio das pedras que falam?
      `

      setReadingResult(reading)
      setShowReadingResult(true)
      setIsGeneratingReading(false)
      setAudioGenerated(true)
    }, 3000)
  }

  // Controlar reprodução de áudio
  const toggleAudio = () => {
    if (!audioGenerated) return

    if (isPlaying) {
      window.speechSynthesis.pause()
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      if (readingResult) {
        const utterance = new SpeechSynthesisUtterance(readingResult)
        utterance.lang = "pt-BR"
        utterance.rate = 0.9
        utterance.pitch = 1.1
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
      }
    }
  }

  // Limpar seleção de pedras
  const clearSelection = () => {
    setSelectedStones([])
    setReadingResult(null)
    setShowReadingResult(false)
    setAudioGenerated(false)
  }

  // Resetar câmera
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Controles superiores */}
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={toggleCabinetStyle}
          variant="outline"
          className="bg-white/10 border-amber-300/30 hover:bg-white/20"
        >
          {cabinetStyle === "wood" ? "Gabinete Dourado" : "Gabinete de Madeira"}
        </Button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-amber-100">A CAIXA MÍSTICA 3D</h2>
          <p className="text-sm text-amber-200/70">Selecione até 7 pedras para sua leitura</p>
        </div>

        <Button
          onClick={clearSelection}
          variant="outline"
          className="bg-white/10 border-amber-300/30 hover:bg-white/20"
          disabled={selectedStones.length === 0}
        >
          Limpar Seleção
        </Button>
      </div>

      {/* Canvas 3D */}
      <div className="w-full aspect-[3/2] rounded-lg overflow-hidden bg-gradient-to-b from-purple-900/30 to-black/50">
        <Canvas shadows camera={{ position: [0, 0.9, 2], fov: 50 }}>
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <PerspectiveCamera makeDefault position={[0, 0.9, 2]} />
              <ambientLight intensity={0.5} />
              <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow />
              <pointLight position={[-5, 5, 5]} intensity={1} />

              <Cabinet cabinetStyle={cabinetStyle} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

              {stoneData.map((stone) => (
                <RealisticStone
                  key={stone.id}
                  stone={stone}
                  isSelected={selectedStones.includes(stone.id)}
                  onClick={() => toggleStoneSelection(stone.id)}
                  onInfoClick={() => showStoneDetails(stone.id)}
                />
              ))}

              <DrawerStones
                drawerOpen={drawerOpen}
                selectedStones={selectedStones}
                toggleStoneSelection={toggleStoneSelection}
              />

              <CameraControls resetCamera={resetCamera} />

              {/* Botão de gerar leitura */}
              {drawerOpen && selectedStones.length > 0 && (
                <Html position={[0, -0.4, 0.3]} center>
                  <Button
                    onClick={generateReading}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
                    disabled={isGeneratingReading}
                  >
                    {isGeneratingReading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Consultando as pedras...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Realizar Leitura Mística
                      </>
                    )}
                  </Button>
                </Html>
              )}

              <Environment preset="sunset" />
              <OrbitControls
                ref={controlsRef}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
                minDistance={1.5}
                maxDistance={4}
                enablePan={false}
              />

              {/* Efeitos de pós-processamento */}
              <EffectComposer>
                <Bloom
                  intensity={0.5}
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  blendFunction={BlendFunction.SCREEN}
                />
                <ChromaticAberration offset={[0.0005, 0.0005]} blendFunction={BlendFunction.NORMAL} opacity={0.2} />
              </EffectComposer>
            </Bounds>
          </Suspense>
        </Canvas>
      </div>

      {/* Instruções */}
      <div className="mt-6 text-center text-sm text-amber-200/70">
        <p>
          Clique nas pedras para selecioná-las • Passe o mouse sobre uma pedra e clique no ícone (i) para ver detalhes
        </p>
        <p>Use o mouse para girar o gabinete • Abra a gaveta inferior para ver sua seleção e realizar a leitura</p>
      </div>

      {/* Modal de informações da pedra */}
      <AnimatePresence>
        {showStoneInfo && selectedStoneInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowStoneInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${selectedStoneInfo.color} 0%, ${selectedStoneInfo.color}80 100%)`,
                      boxShadow: `0 0 15px ${selectedStoneInfo.color}80`,
                    }}
                  >
                    <div
                      className="absolute w-6 h-3 rounded-full opacity-60"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        top: "25%",
                        left: "25%",
                        transform: "rotate(-20deg)",
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-100">{selectedStoneInfo.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowStoneInfo(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-4">
                <h4 className="text-sm uppercase tracking-wider text-amber-400 mb-1">Significado</h4>
                <p className="text-gray-300">{selectedStoneInfo.meaning}</p>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-wider text-amber-400 mb-1">Propriedades</h4>
                <ul className="list-disc pl-5 text-gray-300">
                  {selectedStoneInfo.properties.map((prop: string, index: number) => (
                    <li key={index}>{prop}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
                  onClick={() => setShowStoneInfo(false)}
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de resultado da leitura */}
      <AnimatePresence>
        {showReadingResult && readingResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReadingResult(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-amber-100">Leitura Mística</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReadingResult(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="prose prose-invert prose-amber max-w-none">
                <div className="whitespace-pre-line">{readingResult}</div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Button
                  onClick={toggleAudio}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isPlaying ? "Pausar Áudio" : "Ouvir Leitura"}
                </Button>

                <Button
                  onClick={() => setShowReadingResult(false)}
                  variant="outline"
                  className="border-amber-500/30 hover:bg-amber-900/20"
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elemento de áudio oculto */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
