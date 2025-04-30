"use client"

import { useState, useRef, useEffect, Suspense, useMemo } from "react"
import { Canvas, useFrame, extend } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  useGLTF,
  Html,
  PerspectiveCamera,
  useTexture,
  Bounds,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Sparkles,
  useAnimations,
  ContactShadows,
} from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, X, Volume2, ArrowLeft, Scan, Download, Share } from "lucide-react"
import { stonePrompts } from "@/lib/stone-prompts"
import * as THREE from "three"
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { useSpring, animated } from "@react-spring/three"
import { DragControls } from "three/examples/jsm/controls/DragControls"
import { MandalaGenerator } from "@/components/mandala-generator"

// Estender o Three.js com DragControls
extend({ DragControls })

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
    description: "Pedra de transformação e magia, revela verdades ocultas e expande a consciência.",
  },
  {
    id: "agree",
    name: "Ágata Azul",
    color: "#89CFF0",
    position: [0.35, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#5DA9E9",
    description: "Pedra da expressão e comunicação, facilita a manifestação de ideias e pensamentos.",
  },
  {
    id: "abalone",
    name: "Abalone",
    color: "#4F7942",
    position: [0, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.IRIDESCENT,
    secondaryColor: "#A1E887",
    description: "Pedra do oceano e intuição, conecta com as emoções profundas e a sabedoria ancestral.",
  },
  {
    id: "amethyst",
    name: "Ametista",
    color: "#9B59B6",
    position: [-0.35, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#D7BDE2",
    description: "Pedra da intuição e proteção espiritual, eleva a consciência e acalma a mente.",
  },
  {
    id: "onyx",
    name: "Ônix",
    color: "#0D0D0D",
    position: [-0.7, 1.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#2C3E50",
    description: "Pedra de força e proteção, absorve energias negativas e fortalece a determinação.",
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
    description: "Pedra de alinhamento e equilíbrio, conecta os chakras e facilita a meditação.",
  },
  {
    id: "amethyst2",
    name: "Ametista",
    color: "#9370DB",
    position: [0.35, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#BB8FCE",
    description: "Pedra da intuição e proteção espiritual, eleva a consciência e acalma a mente.",
  },
  {
    id: "peridot",
    name: "Peridoto",
    color: "#4F7942",
    position: [0, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#ABEBC6",
    description: "Pedra da abundância e crescimento, atrai prosperidade e renova a energia vital.",
  },
  {
    id: "carnelian",
    name: "Cornalina",
    color: "#E74C3C",
    position: [-0.35, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#F5B7B1",
    description: "Pedra da criatividade e coragem, estimula a motivação e a vitalidade.",
  },
  {
    id: "moonstone",
    name: "Pedra da Lua",
    color: "#D0D3D4",
    position: [-0.7, 1.1, 0.2],
    shelf: 1,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#F7F9F9",
    description: "Pedra da intuição e dos ciclos, conecta com o feminino e os aspectos lunares da consciência.",
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
    description: "Pedra da transformação profunda, revela padrões inconscientes e facilita mudanças.",
  },
  {
    id: "citrine",
    name: "Citrino",
    color: "#F4D03F",
    position: [0.35, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#F9E79F",
    description: "Pedra da abundância e alegria, atrai prosperidade e energia solar.",
  },
  {
    id: "fluorite",
    name: "Fluorita",
    color: "#9B59B6",
    position: [0, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#D2B4DE",
    description: "Pedra da clareza mental e foco, organiza pensamentos e expande a consciência.",
  },
  {
    id: "aventurine",
    name: "Aventurina",
    color: "#27AE60",
    position: [-0.35, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#ABEBC6",
    description: "Pedra da sorte e oportunidade, atrai circunstâncias favoráveis e renovação.",
  },
  {
    id: "sodalite",
    name: "Sodalita",
    color: "#2E4053",
    position: [-0.7, 0.6, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#5D6D7E",
    description: "Pedra da lógica e intuição, equilibra o racional com o intuitivo.",
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
    description: "Pedra do coração e cura, promove amor incondicional e aceitação.",
  },
  {
    id: "angelite",
    name: "Angelita",
    color: "#AED6F1",
    position: [0.35, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#D6EAF8",
    description: "Pedra da comunicação angélica, facilita conexões com reinos superiores.",
  },
  {
    id: "aquamarine",
    name: "Água Marinha",
    color: "#5DADE2",
    position: [0, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#AED6F1",
    description: "Pedra da serenidade e fluidez, acalma emoções e promove clareza.",
  },
  {
    id: "jade",
    name: "Jade",
    color: "#138D75",
    position: [-0.35, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#48C9B0",
    description: "Pedra da harmonia e equilíbrio, atrai prosperidade e sabedoria.",
  },
  {
    id: "lapis",
    name: "Lápis-Lazúli",
    color: "#1F618D",
    position: [-0.7, 0.1, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#5DADE2",
    description: "Pedra da sabedoria e verdade, expande a consciência e revela insights profundos.",
  },
]

// Componente para o gabinete com vidro transparente
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
    transmission: 0.95,
    thickness: 0.05,
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.3,
  })

  // Animação da gaveta
  const drawerRef = useRef()
  const { drawerZ } = useSpring({
    drawerZ: drawerOpen ? 0.4 : 0,
    config: { mass: 1, tension: 280, friction: 60 },
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

      {/* Vidro frontal transparente */}
      <mesh receiveShadow position={[0, 0.9, 0.31]}>
        <boxGeometry args={[1.7, 1.7, 0.02]} />
        <meshPhysicalMaterial
          roughness={0.1}
          transmission={0.95}
          thickness={0.05}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Prateleiras de vidro */}
      {[0.3, 0.8, 1.3].map((y, i) => (
        <mesh key={i} receiveShadow material={glassMaterial} position={[0, y, 0]}>
          <boxGeometry args={[1.7, 0.02, 0.5]} />
        </mesh>
      ))}

      {/* Gaveta */}
      <animated.group ref={drawerRef} position-z={drawerZ}>
        <mesh
          receiveShadow
          castShadow
          material={cabinetStyle === "wood" ? woodMaterial : goldMaterial}
          position={[0, -0.1, 0]}
        >
          <boxGeometry args={[1.7, 0.3, 0.5]} />
        </mesh>

        {/* Botão da gaveta */}
        <mesh position={[0, -0.1, 0.26]} onClick={toggleDrawer}>
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
      </animated.group>

      {/* Fundo do gabinete */}
      <mesh receiveShadow position={[0, 0.9, -0.3]}>
        <planeGeometry args={[1.7, 1.8]} />
        <meshStandardMaterial color="#111" opacity={0.5} transparent />
      </mesh>
    </group>
  )
}

// Componente para uma pedra com materiais realistas
function RealisticStone({ stone, isSelected, onClick, onInfoClick, isDraggable, inBox }) {
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

  // Animação de flutuação para pedras na caixa
  const { y } = useSpring({
    y: inBox ? (isSelected ? 0.08 : 0) : 0,
    config: { mass: 1, tension: 280, friction: 60 },
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
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1)
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1)
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1)
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
    <animated.group position-y={inBox ? y : stone.position[1]}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={inBox ? [0, 0, 0] : [stone.position[0], 0, stone.position[2]]}
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
    </animated.group>
  )
}

// Componente para a mão virtual
function VirtualHand({ position, isGrabbing, onClick }) {
  const { nodes, materials, animations } = useGLTF("/models/hand.glb") || { nodes: {}, materials: {}, animations: [] }
  const { actions } = useAnimations(animations, nodes.hand)

  useEffect(() => {
    if (isGrabbing) {
      actions.grab?.play()
    } else {
      actions.idle?.play()
    }
  }, [isGrabbing, actions])

  return (
    <group position={position} onClick={onClick} scale={0.2}>
      <primitive object={nodes.hand} />
    </group>
  )
}

// Componente para a caixa de areia
function SandBox({ selectedStones, toggleStoneSelection, boxStones, setBoxStones, isScanning }) {
  const boxRef = useRef()
  const [boxDimensions, setBoxDimensions] = useState({ width: 1.6, depth: 0.4 })
  const [handPosition, setHandPosition] = useState([0, 0, 0])
  const [isGrabbing, setIsGrabbing] = useState(false)
  const [grabbedStone, setGrabbedStone] = useState(null)

  // Atualizar posição da mão com o movimento do mouse
  const handleMouseMove = (e) => {
    if (!boxRef.current) return

    const box = boxRef.current
    const { width, height, left, top } = box.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 2 - 1
    const y = -((e.clientY - top) / height) * 2 + 1

    setHandPosition([(x * boxDimensions.width) / 2, 0.1, (y * boxDimensions.depth) / 2])
  }

  // Manipular clique para pegar/soltar pedras
  const handleClick = () => {
    if (isGrabbing && grabbedStone) {
      // Soltar a pedra na posição atual da mão
      setBoxStones((prev) =>
        prev.map((stone) => (stone.id === grabbedStone.id ? { ...stone, position: [...handPosition] } : stone)),
      )
      setIsGrabbing(false)
      setGrabbedStone(null)
    } else {
      // Verificar se há uma pedra próxima para pegar
      const nearbyStone = boxStones.find((stone) => {
        const dx = stone.position[0] - handPosition[0]
        const dz = stone.position[2] - handPosition[2]
        return Math.sqrt(dx * dx + dz * dz) < 0.2
      })

      if (nearbyStone) {
        setIsGrabbing(true)
        setGrabbedStone(nearbyStone)
      }
    }
  }

  // Atualizar posição da pedra sendo segurada
  useEffect(() => {
    if (isGrabbing && grabbedStone) {
      setBoxStones((prev) =>
        prev.map((stone) => (stone.id === grabbedStone.id ? { ...stone, position: [...handPosition] } : stone)),
      )
    }
  }, [handPosition, isGrabbing, grabbedStone])

  return (
    <group>
      {/* Areia na caixa */}
      <mesh ref={boxRef} position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} onPointerMove={handleMouseMove}>
        <planeGeometry args={[boxDimensions.width, boxDimensions.depth]} />
        <meshStandardMaterial
          color="#F5DEB3"
          roughness={1}
          metalness={0}
          bumpMap={useTexture("/textures/sand-bump.png")}
          bumpScale={0.01}
        />
      </mesh>

      {/* Pedras na caixa */}
      {boxStones.map((stone) => {
        const stoneData = selectedStones.find((s) => s.id === stone.id)
        if (!stoneData) return null

        return (
          <RealisticStone
            key={stone.id}
            stone={{ ...stoneData, position: stone.position }}
            isSelected={false}
            onClick={() => {}}
            onInfoClick={() => {}}
            isDraggable={true}
            inBox={true}
          />
        )
      })}

      {/* Mão virtual */}
      <VirtualHand position={handPosition} isGrabbing={isGrabbing} onClick={handleClick} />

      {/* Efeito de escaneamento */}
      {isScanning && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[boxDimensions.width, boxDimensions.depth]} />
            <meshBasicMaterial color="#8e2de2" transparent opacity={0.3} />
          </mesh>
          <Sparkles
            count={50}
            scale={[boxDimensions.width, 0.2, boxDimensions.depth]}
            size={2}
            speed={0.3}
            color="#8e2de2"
          />
          <pointLight position={[0, 0.5, 0]} color="#8e2de2" intensity={2} distance={1} />
        </group>
      )}
    </group>
  )
}

// Componente para o resultado da leitura
function ReadingResult({ reading, mandalaParams, onClose, onGenerateAudio, isPlaying, toggleAudio }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-amber-100">Leitura Mística</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="prose prose-invert prose-amber max-w-none">
            <div className="whitespace-pre-line">{reading}</div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-64 h-64 relative">
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
            <div className="mt-4 flex flex-col gap-2 items-center">
              <Button
                onClick={toggleAudio}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {isPlaying ? "Pausar Áudio" : "Ouvir Leitura"}
              </Button>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="border-amber-500/30 hover:bg-amber-900/20">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
                <Button variant="outline" className="border-amber-500/30 hover:bg-amber-900/20">
                  <Share className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Componente principal
export default function ACaixa3DCompleta() {
  const [selectedStones, setSelectedStones] = useState<any[]>([])
  const [boxStones, setBoxStones] = useState<any[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cabinetStyle, setCabinetStyle] = useState<"wood" | "gold">("gold")
  const [showStoneInfo, setShowStoneInfo] = useState(false)
  const [selectedStoneInfo, setSelectedStoneInfo] = useState<any>(null)
  const [readingResult, setReadingResult] = useState<string | null>(null)
  const [isGeneratingReading, setIsGeneratingReading] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [showReadingResult, setShowReadingResult] = useState(false)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mandalaParams, setMandalaParams] = useState(null)
  const [userName, setUserName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [showUserForm, setShowUserForm] = useState(false)
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
    if (selectedStones.find((s) => s.id === stoneId)) {
      setSelectedStones(selectedStones.filter((s) => s.id !== stoneId))
      setBoxStones(boxStones.filter((s) => s.id !== stoneId))
    } else {
      if (selectedStones.length < 7) {
        const stone = stoneData.find((s) => s.id === stoneId)
        if (stone) {
          setSelectedStones([...selectedStones, stone])

          // Adicionar a pedra à caixa em uma posição aleatória
          const randomX = (Math.random() - 0.5) * 1.4
          const randomZ = (Math.random() - 0.5) * 0.3
          setBoxStones([
            ...boxStones,
            {
              id: stoneId,
              position: [randomX, -0.15, randomZ],
            },
          ])

          playStoneSound()
        }
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
        meaning: stone.description || "Uma pedra mística com propriedades energéticas únicas.",
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

  // Iniciar escaneamento
  const startScanning = () => {
    if (boxStones.length === 0) {
      alert("Adicione pedras à caixa antes de escanear.")
      return
    }

    setIsScanning(true)
    setIsGeneratingReading(true)

    // Simular o processo de escaneamento
    setTimeout(() => {
      setIsScanning(false)
      generateReading()
    }, 3000)
  }

  // Gerar leitura baseada nas pedras selecionadas
  const generateReading = async () => {
    if (boxStones.length === 0) {
      alert("Adicione pedras à caixa antes de gerar a leitura.")
      return
    }

    // Verificar se temos informações do usuário
    if (!userName || !birthDate) {
      setShowUserForm(true)
      setIsGeneratingReading(false)
      return
    }

    // Simulação de tempo de processamento
    setTimeout(() => {
      const reading = `
# O Espírito da Caixa se Manifesta

As pedras falam quando os discípulos silenciam. Através da disposição mística de ${selectedStones
        .map((stone) => stone.name)
        .join(", ")}, revela-se a verdade interior que habita em seu ser, ${userName}.

## Percepção Interior Atual

Você se encontra em um momento de transição energética. As pedras revelam um padrão de busca por equilíbrio entre o material e o espiritual. A presença dominante dos cristais sugere uma necessidade de clareza mental e emocional para avançar em seu caminho.

## Bloqueios Energéticos Ocultos

As sombras projetadas pelas pedras indicam resistências internas relacionadas à aceitação de mudanças. Há um temor oculto de abandonar zonas de conforto que, paradoxalmente, já não nutrem seu crescimento. A disposição das pedras revela padrões de pensamento circulares que impedem o fluxo natural de sua energia vital.

## Caminhos para Expansão do ECI

O caminho se ilumina através da integração consciente das energias representadas por cada cristal presente. A combinação única dessas vibrações sugere um processo de transmutação interior, onde o que antes era percebido como obstáculo se transforma em catalisador de crescimento. Permita-se fluir com as correntes energéticas que as pedras manifestam, encontrando harmonia na aparente contradição.

Que pergunta seu coração faz quando confrontado com o silêncio das pedras que falam?
      `

      // Gerar parâmetros para a mandala
      const mandalaParams = {
        colors: selectedStones.map((stone) => stone.color),
        layers: 5 + Math.floor(Math.random() * 3),
        shape: "circle",
        complexity: 7 + Math.floor(Math.random() * 4),
        symbols: ["estrela", "espiral", "lua"],
      }

      setReadingResult(reading)
      setMandalaParams(mandalaParams)
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
    setBoxStones([])
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

  // Submeter formulário de usuário
  const submitUserForm = (e) => {
    e.preventDefault()
    setShowUserForm(false)
    generateReading()
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 border-b border-amber-500/30 pb-4">
        <Button variant="outline" className="bg-white/10 border-amber-300/30 hover:bg-white/20">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-100">A CAIXA MÍSTICA 3D</h1>
          <p className="text-sm text-amber-200/70">Explore seu Estado de Consciência Interna</p>
        </div>

        <Button
          onClick={toggleCabinetStyle}
          variant="outline"
          className="bg-white/10 border-amber-300/30 hover:bg-white/20"
        >
          {cabinetStyle === "wood" ? "Gabinete Dourado" : "Gabinete de Madeira"}
        </Button>
      </div>

      {/* Controles principais */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            onClick={clearSelection}
            variant="outline"
            className="bg-white/10 border-amber-300/30 hover:bg-white/20"
            disabled={selectedStones.length === 0}
          >
            Limpar Seleção
          </Button>
          <Button
            onClick={toggleDrawer}
            variant="outline"
            className="bg-white/10 border-amber-300/30 hover:bg-white/20"
          >
            {drawerOpen ? "Fechar Gaveta" : "Abrir Gaveta"}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-amber-200/70">Pedras selecionadas: {selectedStones.length}/7</p>
        </div>

        <Button
          onClick={startScanning}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          disabled={isGeneratingReading || boxStones.length === 0}
        >
          {isGeneratingReading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              <Scan className="w-4 h-4 mr-2" />
              Escanear Leitura
            </>
          )}
        </Button>
      </div>

      {/* Canvas 3D */}
      <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-gradient-to-b from-purple-900/30 to-black/50 shadow-xl">
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
                  isSelected={selectedStones.some((s) => s.id === stone.id)}
                  onClick={() => toggleStoneSelection(stone.id)}
                  onInfoClick={() => showStoneDetails(stone.id)}
                  isDraggable={false}
                  inBox={false}
                />
              ))}

              {drawerOpen && (
                <SandBox
                  selectedStones={selectedStones}
                  toggleStoneSelection={toggleStoneSelection}
                  boxStones={boxStones}
                  setBoxStones={setBoxStones}
                  isScanning={isScanning}
                />
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
                <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
              </EffectComposer>

              <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.5}
                scale={10}
                blur={1}
                far={5}
                resolution={256}
                color="#000000"
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
        <p>Use o mouse para girar o gabinete • Abra a gaveta para interagir com as pedras na caixa de areia</p>
        <p>
          Use a mão virtual para posicionar as pedras • Clique em "Escanear Leitura" para gerar sua interpretação
          mística
        </p>
      </div>

      {/* Rodapé */}
      <footer className="mt-12 border-t border-amber-500/30 pt-4 text-center text-amber-200/50 text-sm">
        <p>© 2023 A CAIXA MÍSTICA • Todos os direitos reservados</p>
        <p className="mt-1">Desenvolvido com tecnologia de ponta para experiências místicas digitais</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-amber-200">
            Termos de Uso
          </a>
          <a href="#" className="hover:text-amber-200">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-amber-200">
            Contato
          </a>
        </div>
      </footer>

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

      {/* Modal de formulário de usuário */}
      <AnimatePresence>
        {showUserForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-amber-100 mb-4">Informações para Leitura</h3>
              <p className="text-gray-300 mb-4">
                Para personalizar sua leitura mística, precisamos de algumas informações básicas:
              </p>

              <form onSubmit={submitUserForm}>
                <div className="mb-4">
                  <label className="block text-amber-200 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-amber-500/30 rounded text-white"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-amber-200 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-amber-500/30 rounded text-white"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-amber-500/30 hover:bg-amber-900/20"
                    onClick={() => setShowUserForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
                  >
                    Continuar
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de resultado da leitura */}
      <AnimatePresence>
        {showReadingResult && readingResult && (
          <ReadingResult
            reading={readingResult}
            mandalaParams={mandalaParams}
            onClose={() => setShowReadingResult(false)}
            onGenerateAudio={() => {}}
            isPlaying={isPlaying}
            toggleAudio={toggleAudio}
          />
        )}
      </AnimatePresence>

      {/* Elemento de áudio oculto */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
