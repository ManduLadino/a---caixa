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
  PointMaterial,
  Points,
  SpotLight,
  useDepthBuffer,
} from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, X, Sparkles, Volume2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { stonePrompts } from "@/lib/stone-prompts"
import * as THREE from "three"
import Image from "next/image"

// Definição das pedras com suas propriedades
const stoneData = [
  // Primeira prateleira
  { id: "labradorite", name: "Labradorite", color: "#3A7D7E", position: [0.7, 1.6, 0.2], shelf: 0 },
  { id: "agree", name: "Agree", color: "#89CFF0", position: [0.35, 1.6, 0.2], shelf: 0 },
  { id: "abalone", name: "Abalone", color: "#4F7942", position: [0, 1.6, 0.2], shelf: 0 },
  { id: "abalone2", name: "Abalone", color: "#5F8575", position: [-0.35, 1.6, 0.2], shelf: 0 },
  { id: "onyx", name: "Ônix", color: "#0D0D0D", position: [-0.7, 1.6, 0.2], shelf: 0 },

  // Segunda prateleira
  { id: "kyarite", name: "Kyarite", color: "#3A7D7E", position: [0.7, 1.1, 0.2], shelf: 1 },
  { id: "amoityop", name: "Amoityop", color: "#9370DB", position: [0.35, 1.1, 0.2], shelf: 1 },
  { id: "petrihual", name: "Petrihual", color: "#4F7942", position: [0, 1.1, 0.2], shelf: 1 },
  { id: "arsieronite", name: "Arsieronite", color: "#5F8575", position: [-0.35, 1.1, 0.2], shelf: 1 },
  { id: "moonstone", name: "Pedra da Lua", color: "#ADD8E6", position: [-0.7, 1.1, 0.2], shelf: 1 },

  // Terceira prateleira
  { id: "malachite2", name: "Malaquita", color: "#0000CD", position: [0.7, 0.6, 0.2], shelf: 2 },
  { id: "cenerite", name: "Cenerite", color: "#40E0D0", position: [0.35, 0.6, 0.2], shelf: 2 },
  { id: "fluorite", name: "Fluorita", color: "#00FF7F", position: [0, 0.6, 0.2], shelf: 2 },
  { id: "aventurite", name: "Aventurita", color: "#2E8B57", position: [-0.35, 0.6, 0.2], shelf: 2 },
  { id: "sodelite", name: "Sodelita", color: "#0000CD", position: [-0.7, 0.6, 0.2], shelf: 2 },

  // Quarta prateleira
  { id: "chrosepase", name: "Chrosepase", color: "#4F7942", position: [0.7, 0.1, 0.2], shelf: 3 },
  { id: "angelite", name: "Angelita", color: "#ADD8E6", position: [0.35, 0.1, 0.2], shelf: 3 },
  { id: "aquamarine", name: "Água Marinha", color: "#00BFFF", position: [0, 0.1, 0.2], shelf: 3 },
  { id: "aquamarine2", name: "Água Marinha", color: "#2E8B57", position: [-0.35, 0.1, 0.2], shelf: 3 },
  { id: "sodalite", name: "Sodalita", color: "#191970", position: [-0.7, 0.1, 0.2], shelf: 3 },
]

// Componente para iluminação dinâmica
function DynamicLighting({ selectedStones }) {
  const depthBuffer = useDepthBuffer({ frames: 1 })
  const spotLightRefs = useRef([])
  const pointLightRefs = useRef([])

  // Criar cores combinadas das pedras selecionadas
  const combinedColors = useMemo(() => {
    if (selectedStones.length === 0) return ["#FFD700", "#FFFFFF", "#FFD700"]

    return selectedStones.map((stoneId) => {
      const stone = stoneData.find((s) => s.id === stoneId)
      return stone ? stone.color : "#FFFFFF"
    })
  }, [selectedStones])

  // Atualizar posições e cores das luzes
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    // Atualizar luzes pontuais
    pointLightRefs.current.forEach((light, i) => {
      if (light) {
        const t = time * 0.5 + (i * Math.PI) / 4
        light.position.x = Math.sin(t) * 2
        light.position.z = Math.cos(t) * 2
        light.position.y = Math.sin(t * 0.5) * 0.5 + 1

        // Transição suave de cores
        const colorIndex = i % combinedColors.length
        const targetColor = new THREE.Color(combinedColors[colorIndex])
        light.color.lerp(targetColor, 0.05)

        // Intensidade pulsante
        light.intensity = 0.5 + Math.sin(time * 2 + i) * 0.3
      }
    })

    // Atualizar spotlights
    spotLightRefs.current.forEach((light, i) => {
      if (light) {
        const colorIndex = i % combinedColors.length
        const targetColor = new THREE.Color(combinedColors[colorIndex])
        light.color.lerp(targetColor, 0.05)
      }
    })
  })

  return (
    <>
      {/* Luzes pontuais orbitando */}
      {[0, 1, 2].map((_, i) => (
        <pointLight
          key={`point-${i}`}
          ref={(el) => (pointLightRefs.current[i] = el)}
          position={[Math.sin(i * 2) * 2, 1 + i * 0.5, Math.cos(i * 2) * 2]}
          intensity={0.8}
          distance={6}
          color={combinedColors[i % combinedColors.length]}
          castShadow
        />
      ))}

      {/* Spotlights direcionais */}
      {selectedStones.length > 0 ? (
        selectedStones.map((stoneId, i) => {
          const stone = stoneData.find((s) => s.id === stoneId)
          if (!stone) return null

          return (
            <SpotLight
              key={`spot-${stoneId}`}
              ref={(el) => (spotLightRefs.current[i] = el)}
              position={[stone.position[0], stone.position[1] + 1, stone.position[2] + 1]}
              angle={0.3}
              attenuation={5}
              distance={5}
              intensity={2}
              color={stone.color}
              castShadow
              depthBuffer={depthBuffer}
              target-position={stone.position}
            />
          )
        })
      ) : (
        <SpotLight
          ref={(el) => (spotLightRefs.current[0] = el)}
          position={[0, 2, 2]}
          angle={0.6}
          attenuation={5}
          distance={7}
          intensity={1}
          color="#FFD700"
          castShadow
          depthBuffer={depthBuffer}
        />
      )}

      {/* Luz ambiente */}
      <ambientLight intensity={0.2} />
    </>
  )
}

// Componente para efeitos de partículas ao redor das pedras selecionadas
function StoneGlowEffect({ selectedStones }) {
  const particlesRef = useRef()

  // Gerar posições de partículas ao redor das pedras selecionadas
  const particlePositions = useMemo(() => {
    const positions = []

    selectedStones.forEach((stoneId) => {
      const stone = stoneData.find((s) => s.id === stoneId)
      if (!stone) return

      // Gerar 50 partículas ao redor de cada pedra
      for (let i = 0; i < 50; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const r = 0.15 + Math.random() * 0.1

        positions.push(
          stone.position[0] + r * Math.sin(phi) * Math.cos(theta),
          stone.position[1] + r * Math.sin(phi) * Math.sin(theta),
          stone.position[2] + r * Math.cos(phi),
        )
      }
    })

    return new Float32Array(positions)
  }, [selectedStones])

  // Animar partículas
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime()
      particlesRef.current.rotation.y = time * 0.1

      // Pulsar tamanho das partículas
      particlesRef.current.material.size = 0.02 + Math.sin(time * 3) * 0.01
    }
  })

  if (selectedStones.length === 0) return null

  // Criar cores combinadas das pedras selecionadas
  const colors = selectedStones.map((stoneId) => {
    const stone = stoneData.find((s) => s.id === stoneId)
    return stone ? new THREE.Color(stone.color) : new THREE.Color("#FFFFFF")
  })

  return (
    <Points ref={particlesRef} positions={particlePositions}>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

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

// Componente para uma pedra
function Stone({ stone, isSelected, onClick, onInfoClick }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Efeito de hover e seleção
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime()

      if (hovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.1, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.1, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.1, 0.1)
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, stone.position[1] + 0.05, 0.1)
      } else if (isSelected) {
        // Animação pulsante para pedras selecionadas
        const pulse = Math.sin(time * 2) * 0.05 + 1.1
        meshRef.current.scale.set(pulse, pulse, pulse)
        meshRef.current.rotation.y = time * 0.5
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, stone.position[1] + 0.02, 0.1)
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1)
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, stone.position[1], 0.1)
        meshRef.current.rotation.y = time * 0.2
      }

      // Animar efeito de brilho
      if (glowRef.current) {
        if (isSelected) {
          glowRef.current.material.opacity = 0.7 + Math.sin(time * 3) * 0.3
          glowRef.current.scale.set(1.3, 1.3, 1.3)
        } else {
          glowRef.current.material.opacity = 0
          glowRef.current.scale.set(1, 1, 1)
        }
      }
    }
  })

  // Criar material com gradiente de cor
  const darkColor = new THREE.Color(stone.color).multiplyScalar(0.7)
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec2 vUv;
    
    void main() {
      vec3 color = mix(colorA, colorB, vUv.y);
      
      // Adicionar brilho
      float brightness = smoothstep(0.4, 0.6, vUv.y) * 0.5;
      color = mix(color, vec3(1.0), brightness);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  const uniforms = {
    colorA: { value: new THREE.Color(stone.color) },
    colorB: { value: darkColor },
  }

  const customMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  })

  return (
    <group position={stone.position}>
      {/* Efeito de brilho */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color={stone.color} transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Pedra */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1, 32, 32]} />
        <primitive object={customMaterial} />
      </mesh>

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

          // Organizar as pedras em linhas de 5
          const row = Math.floor(index / 5)
          const col = index % 5
          const x = (col - 2) * 0.2
          const z = row * 0.2

          return (
            <group key={stoneId} position={[x, 0, z]}>
              <mesh castShadow onClick={() => toggleStoneSelection(stoneId)}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshStandardMaterial color={stone.color} />
              </mesh>

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
      // Removido o limite de 7 pedras
      setSelectedStones([...selectedStones, stoneId])
      playStoneSound()
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
      {/* Logo no topo esquerdo */}
      <div className="absolute top-4 left-4 z-10">
        <Image
          src="/images/a-caixa-official-logo.png"
          alt="A CAIXA"
          width={150}
          height={150}
          className="drop-shadow-lg"
        />
      </div>

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
          <p className="text-sm text-amber-200/70">Selecione quantas pedras desejar para sua leitura</p>
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

              {/* Iluminação dinâmica */}
              <DynamicLighting selectedStones={selectedStones} />

              <Cabinet cabinetStyle={cabinetStyle} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

              {stoneData.map((stone) => (
                <Stone
                  key={stone.id}
                  stone={stone}
                  isSelected={selectedStones.includes(stone.id)}
                  onClick={() => toggleStoneSelection(stone.id)}
                  onInfoClick={() => showStoneDetails(stone.id)}
                />
              ))}

              {/* Efeito de brilho nas pedras selecionadas */}
              <StoneGlowEffect selectedStones={selectedStones} />

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
                        <Sparkles className="w-4 h-4 mr-2" />
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

      {/* Rodapé com logo */}
      <div className="mt-8 flex justify-end items-center">
        <Image
          src="/images/a-caixa-official-logo.png"
          alt="A CAIXA"
          width={120}
          height={120}
          className="drop-shadow-lg"
        />
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
