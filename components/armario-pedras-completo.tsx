"use client"

import { useState, useRef, Suspense, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  Html,
  useTexture,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Sparkles,
  ContactShadows,
} from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, X } from "lucide-react"
import * as THREE from "three"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import Image from "next/image"

// Definição dos tipos de materiais para as pedras
const STONE_TYPES = {
  CRYSTAL: "crystal",
  OPAQUE: "opaque",
  METALLIC: "metallic",
  TRANSLUCENT: "translucent",
  IRIDESCENT: "iridescent",
}

// Definição das pedras com suas propriedades (expandida para 44 pedras)
const stoneData = [
  // Primeira prateleira (7 pedras)
  {
    id: "labradorite",
    name: "Labradorite",
    color: "#3A7D7E",
    position: [-0.9, 2.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.IRIDESCENT,
    secondaryColor: "#64B6AC",
    description: "Pedra de transformação e magia, revela verdades ocultas e expande a consciência.",
  },
  {
    id: "blue-agate",
    name: "Ágata Azul",
    color: "#89CFF0",
    position: [-0.6, 2.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#5DA9E9",
    description: "Pedra da expressão e comunicação, facilita a manifestação de ideias e pensamentos.",
  },
  {
    id: "abalone",
    name: "Abalone",
    color: "#4F7942",
    position: [-0.3, 2.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.IRIDESCENT,
    secondaryColor: "#A1E887",
    description: "Pedra do oceano e intuição, conecta com as emoções profundas e a sabedoria ancestral.",
  },
  {
    id: "amethyst",
    name: "Ametista",
    color: "#9B59B6",
    position: [0, 2.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#D7BDE2",
    description: "Pedra da intuição e proteção espiritual, eleva a consciência e acalma a mente.",
  },
  {
    id: "onyx",
    name: "Ônix",
    color: "#0D0D0D",
    position: [0.3, 2.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#2C3E50",
    description: "Pedra de força e proteção, absorve energias negativas e fortalece a determinação.",
  },
  {
    id: "rose-quartz",
    name: "Quartzo Rosa",
    color: "#F8C3CD",
    position: [0.6, 2.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#FEE5E0",
    description: "Pedra do amor incondicional, cura o coração e promove compaixão e paz interior.",
  },
  {
    id: "clear-quartz",
    name: "Quartzo Cristal",
    color: "#F5F5F5",
    position: [0.9, 2.6, 0.2],
    shelf: 0,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#FFFFFF",
    description: "Pedra mestra da amplificação, clareza e programação energética.",
  },

  // Segunda prateleira (7 pedras)
  {
    id: "kyanite",
    name: "Cianita",
    color: "#3A7D7E",
    position: [-0.9, 2.2, 0.2],
    shelf: 1,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#5DADE2",
    description: "Pedra de alinhamento e equilíbrio, conecta os chakras e facilita a meditação.",
  },
  {
    id: "amethyst2",
    name: "Ametista Escura",
    color: "#6A0DAD",
    position: [-0.6, 2.2, 0.2],
    shelf: 1,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#BB8FCE",
    description: "Pedra da intuição e proteção espiritual, eleva a consciência e acalma a mente.",
  },
  {
    id: "peridot",
    name: "Peridoto",
    color: "#4F7942",
    position: [-0.3, 2.2, 0.2],
    shelf: 1,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#ABEBC6",
    description: "Pedra da abundância e crescimento, atrai prosperidade e renova a energia vital.",
  },
  {
    id: "carnelian",
    name: "Cornalina",
    color: "#E74C3C",
    position: [0, 2.2, 0.2],
    shelf: 1,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#F5B7B1",
    description: "Pedra da criatividade e coragem, estimula a motivação e a vitalidade.",
  },
  {
    id: "moonstone",
    name: "Pedra da Lua",
    color: "#D0D3D4",
    position: [0.3, 2.2, 0.2],
    shelf: 1,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#F7F9F9",
    description: "Pedra da intuição e dos ciclos, conecta com o feminino e os aspectos lunares da consciência.",
  },
  {
    id: "tigers-eye",
    name: "Olho de Tigre",
    color: "#B8860B",
    position: [0.6, 2.2, 0.2],
    shelf: 1,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#DAA520",
    description: "Pedra da coragem e proteção, fortalece a confiança e a clareza mental.",
  },
  {
    id: "obsidian",
    name: "Obsidiana",
    color: "#1C1C1C",
    position: [0.9, 2.2, 0.2],
    shelf: 1,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#2F4F4F",
    description: "Pedra de proteção e verdade, revela sombras internas e protege contra negatividade.",
  },

  // Terceira prateleira (7 pedras)
  {
    id: "malachite",
    name: "Malaquita",
    color: "#0B5345",
    position: [-0.9, 1.8, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#48C9B0",
    description: "Pedra da transformação profunda, revela padrões inconscientes e facilita mudanças.",
  },
  {
    id: "citrine",
    name: "Citrino",
    color: "#F4D03F",
    position: [-0.6, 1.8, 0.2],
    shelf: 2,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#F9E79F",
    description: "Pedra da abundância e alegria, atrai prosperidade e energia solar.",
  },
  {
    id: "fluorite",
    name: "Fluorita",
    color: "#9B59B6",
    position: [-0.3, 1.8, 0.2],
    shelf: 2,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#D2B4DE",
    description: "Pedra da clareza mental e foco, organiza pensamentos e expande a consciência.",
  },
  {
    id: "aventurine",
    name: "Aventurina",
    color: "#27AE60",
    position: [0, 1.8, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#ABEBC6",
    description: "Pedra da sorte e oportunidade, atrai circunstâncias favoráveis e renovação.",
  },
  {
    id: "sodalite",
    name: "Sodalita",
    color: "#2E4053",
    position: [0.3, 1.8, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#5D6D7E",
    description: "Pedra da lógica e intuição, equilibra o racional com o intuitivo.",
  },
  {
    id: "lapis-lazuli",
    name: "Lápis-Lazúli",
    color: "#1F618D",
    position: [0.6, 1.8, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#5DADE2",
    description: "Pedra da sabedoria e verdade, expande a consciência e revela insights profundos.",
  },
  {
    id: "garnet",
    name: "Granada",
    color: "#8B0000",
    position: [0.9, 1.8, 0.2],
    shelf: 2,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#CD5C5C",
    description: "Pedra da vitalidade e paixão, energiza e revitaliza o corpo e espírito.",
  },

  // Quarta prateleira (7 pedras)
  {
    id: "chrysoprase",
    name: "Crisoprase",
    color: "#27AE60",
    position: [-0.9, 1.4, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#ABEBC6",
    description: "Pedra do coração e cura, promove amor incondicional e aceitação.",
  },
  {
    id: "angelite",
    name: "Angelita",
    color: "#AED6F1",
    position: [-0.6, 1.4, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#D6EAF8",
    description: "Pedra da comunicação angélica, facilita conexões com reinos superiores.",
  },
  {
    id: "aquamarine",
    name: "Água Marinha",
    color: "#5DADE2",
    position: [-0.3, 1.4, 0.2],
    shelf: 3,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#AED6F1",
    description: "Pedra da serenidade e fluidez, acalma emoções e promove clareza.",
  },
  {
    id: "jade",
    name: "Jade",
    color: "#138D75",
    position: [0, 1.4, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#48C9B0",
    description: "Pedra da harmonia e equilíbrio, atrai prosperidade e sabedoria.",
  },
  {
    id: "hematite",
    name: "Hematita",
    color: "#616A6B",
    position: [0.3, 1.4, 0.2],
    shelf: 3,
    type: STONE_TYPES.METALLIC,
    secondaryColor: "#ABB2B9",
    description: "Pedra do enraizamento e proteção, fortalece e estabiliza a energia.",
  },
  {
    id: "amazonite",
    name: "Amazonita",
    color: "#1ABC9C",
    position: [0.6, 1.4, 0.2],
    shelf: 3,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#76D7C4",
    description: "Pedra da verdade e comunicação, harmoniza e equilibra energias.",
  },
  {
    id: "pyrite",
    name: "Pirita",
    color: "#B7950B",
    position: [0.9, 1.4, 0.2],
    shelf: 3,
    type: STONE_TYPES.METALLIC,
    secondaryColor: "#F7DC6F",
    description: "Pedra da abundância e proteção, atrai prosperidade e afasta energias negativas.",
  },

  // Quinta prateleira (7 pedras)
  {
    id: "selenite",
    name: "Selenita",
    color: "#F7F9F9",
    position: [-0.9, 1.0, 0.2],
    shelf: 4,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#FBFCFC",
    description: "Pedra da luz e purificação, limpa e eleva a vibração energética.",
  },
  {
    id: "black-tourmaline",
    name: "Turmalina Negra",
    color: "#17202A",
    position: [-0.6, 1.0, 0.2],
    shelf: 4,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#2C3E50",
    description: "Pedra de proteção poderosa, absorve e transmuta energias negativas.",
  },
  {
    id: "emerald",
    name: "Esmeralda",
    color: "#0B5345",
    position: [-0.3, 1.0, 0.2],
    shelf: 4,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#138D75",
    description: "Pedra do coração e abundância, promove amor, lealdade e sabedoria.",
  },
  {
    id: "red-jasper",
    name: "Jaspe Vermelho",
    color: "#922B21",
    position: [0, 1.0, 0.2],
    shelf: 4,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#CB4335",
    description: "Pedra da força e vitalidade, estabiliza e energiza o corpo físico.",
  },
  {
    id: "moss-agate",
    name: "Ágata Musgosa",
    color: "#196F3D",
    position: [0.3, 1.0, 0.2],
    shelf: 4,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#229954",
    description: "Pedra da abundância e crescimento, conecta com a natureza e promove renovação.",
  },
  {
    id: "smoky-quartz",
    name: "Quartzo Fumê",
    color: "#4D5656",
    position: [0.6, 1.0, 0.2],
    shelf: 4,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#7F8C8D",
    description: "Pedra da transmutação, transforma energias negativas e promove enraizamento.",
  },
  {
    id: "sunstone",
    name: "Pedra do Sol",
    color: "#E67E22",
    position: [0.9, 1.0, 0.2],
    shelf: 4,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#F39C12",
    description: "Pedra da vitalidade e alegria, traz luz e energia positiva para a vida.",
  },

  // Sexta prateleira (7 pedras)
  {
    id: "rhodonite",
    name: "Rodonita",
    color: "#CD6155",
    position: [-0.9, 0.6, 0.2],
    shelf: 5,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#EC7063",
    description: "Pedra do perdão e cura emocional, equilibra e harmoniza o coração.",
  },
  {
    id: "howlite",
    name: "Howlita",
    color: "#EAECEE",
    position: [-0.6, 0.6, 0.2],
    shelf: 5,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#D5D8DC",
    description: "Pedra da calma e paciência, acalma a mente e facilita o sono tranquilo.",
  },
  {
    id: "green-aventurine",
    name: "Aventurina Verde",
    color: "#2ECC71",
    position: [-0.3, 0.6, 0.2],
    shelf: 5,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#58D68D",
    description: "Pedra da sorte e oportunidade, atrai prosperidade e bem-estar.",
  },
  {
    id: "blue-calcite",
    name: "Calcita Azul",
    color: "#85C1E9",
    position: [0, 0.6, 0.2],
    shelf: 5,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#AED6F1",
    description: "Pedra da comunicação e expressão, acalma e clareia a mente.",
  },
  {
    id: "orange-calcite",
    name: "Calcita Laranja",
    color: "#F5B041",
    position: [0.3, 0.6, 0.2],
    shelf: 5,
    type: STONE_TYPES.TRANSLUCENT,
    secondaryColor: "#F8C471",
    description: "Pedra da criatividade e energia, estimula a motivação e alegria.",
  },
  {
    id: "shungite",
    name: "Shungite",
    color: "#17202A",
    position: [0.6, 0.6, 0.2],
    shelf: 5,
    type: STONE_TYPES.OPAQUE,
    secondaryColor: "#1C2833",
    description: "Pedra de purificação e proteção, neutraliza energias negativas e EMF.",
  },
  {
    id: "ruby",
    name: "Rubi",
    color: "#C0392B",
    position: [0.9, 0.6, 0.2],
    shelf: 5,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#E74C3C",
    description: "Pedra da paixão e vitalidade, energiza e fortalece o espírito.",
  },

  // Sétima prateleira (2 pedras)
  {
    id: "sapphire",
    name: "Safira",
    color: "#2980B9",
    position: [-0.3, 0.2, 0.2],
    shelf: 6,
    type: STONE_TYPES.CRYSTAL,
    secondaryColor: "#3498DB",
    description: "Pedra da sabedoria e foco, promove clareza mental e intuição.",
  },
  {
    id: "opal",
    name: "Opala",
    color: "#D7BDE2",
    position: [0.3, 0.2, 0.2],
    shelf: 6,
    type: STONE_TYPES.IRIDESCENT,
    secondaryColor: "#EBDEF0",
    description: "Pedra da transformação e criatividade, amplifica emoções e intuição.",
  },
]

// Componente para o armário com vidro transparente e neons
function Cabinet({ cabinetStyle }) {
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

  // Altura total do armário
  const cabinetHeight = 3.0
  const cabinetWidth = 2.2
  const cabinetDepth = 0.6

  // Número de prateleiras
  const shelfCount = 7
  const shelfSpacing = cabinetHeight / (shelfCount + 1)

  return (
    <group>
      {/* Estrutura principal do armário */}
      <mesh
        receiveShadow
        castShadow
        material={cabinetStyle === "wood" ? woodMaterial : goldMaterial}
        position={[0, cabinetHeight / 2, 0]}
      >
        <boxGeometry args={[cabinetWidth, cabinetHeight, cabinetDepth]} />
      </mesh>

      {/* Vidro frontal transparente */}
      <mesh receiveShadow position={[0, cabinetHeight / 2, cabinetDepth / 2 + 0.01]}>
        <boxGeometry args={[cabinetWidth - 0.1, cabinetHeight - 0.1, 0.02]} />
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

      {/* Prateleiras de vidro com neons */}
      {Array.from({ length: shelfCount }).map((_, i) => (
        <group key={i} position={[0, (i + 1) * shelfSpacing, 0]}>
          {/* Prateleira de vidro */}
          <mesh receiveShadow material={glassMaterial}>
            <boxGeometry args={[cabinetWidth - 0.2, 0.02, cabinetDepth - 0.1]} />
          </mesh>

          {/* Neon sob a prateleira */}
          <mesh position={[0, -0.02, 0]}>
            <boxGeometry args={[cabinetWidth - 0.3, 0.01, cabinetDepth - 0.2]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#ff00ff" : "#ffff00"}
              opacity={0.7}
              transparent
            />
          </mesh>

          {/* Luz pontual para o efeito neon */}
          <pointLight
            position={[0, -0.05, 0]}
            color={i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#ff00ff" : "#ffff00"}
            intensity={0.5}
            distance={0.5}
          />
        </group>
      ))}

      {/* Fundo do armário */}
      <mesh receiveShadow position={[0, cabinetHeight / 2, -cabinetDepth / 2]}>
        <planeGeometry args={[cabinetWidth - 0.1, cabinetHeight - 0.1]} />
        <meshStandardMaterial color="#111" opacity={0.5} transparent />
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
        return <octahedronGeometry args={[0.08, 0]} />
      case STONE_TYPES.OPAQUE:
        return <dodecahedronGeometry args={[0.08, 0]} />
      case STONE_TYPES.METALLIC:
        return <icosahedronGeometry args={[0.08, 0]} />
      case STONE_TYPES.TRANSLUCENT:
        return <sphereGeometry args={[0.08, 32, 32]} />
      case STONE_TYPES.IRIDESCENT:
        return <torusKnotGeometry args={[0.06, 0.02, 64, 8]} />
      default:
        return <sphereGeometry args={[0.08, 32, 32]} />
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
    <group position={[stone.position[0], stone.position[1], stone.position[2]]}>
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

// Componente para a mão robótica
function RoboticHand({ position, isGrabbing, onClick }) {
  const handRef = useRef()
  const { scene } = useThree()

  // Animação da mão
  useFrame(() => {
    if (handRef.current) {
      // Rotação suave da mão
      handRef.current.rotation.z = THREE.MathUtils.lerp(handRef.current.rotation.z, isGrabbing ? Math.PI / 6 : 0, 0.1)

      // Movimento dos dedos
      const fingers = handRef.current.children.filter((child) => child.name.includes("finger"))
      fingers.forEach((finger) => {
        finger.rotation.x = THREE.MathUtils.lerp(finger.rotation.x, isGrabbing ? -Math.PI / 4 : 0, 0.1)
      })
    }
  })

  return (
    <group position={position} onClick={onClick} ref={handRef}>
      {/* Base da mão */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.15, 0.05]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Dedos */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} castShadow receiveShadow position={[0.03 * (i - 1), 0.1, 0]} name={`finger-${i}`}>
          <boxGeometry args={[0.02, 0.1, 0.02]} />
          <meshStandardMaterial color="#777" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Polegar */}
      <mesh castShadow receiveShadow position={[-0.06, 0.05, 0]} rotation={[0, 0, Math.PI / 4]} name="finger-thumb">
        <boxGeometry args={[0.02, 0.08, 0.02]} />
        <meshStandardMaterial color="#777" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Juntas e detalhes */}
      <mesh position={[0, 0.05, 0.03]}>
        <sphereGeometry args={[0.01, 16, 16]} />
        <meshStandardMaterial color="#f00" emissive="#f00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// Componente para a caixa de pedras
function StoneBox({ selectedStones, onStoneClick }) {
  const boxRef = useRef()
  const [handPosition, setHandPosition] = useState([0, 0, 0])
  const [isGrabbing, setIsGrabbing] = useState(false)
  const [activeStone, setActiveStone] = useState(null)

  // Dimensões da caixa
  const boxWidth = 1.2
  const boxDepth = 0.8
  const boxHeight = 0.2

  // Atualizar posição da mão com o movimento do mouse
  const handleMouseMove = (e) => {
    if (!boxRef.current) return

    const box = boxRef.current
    const { width, height, left, top } = box.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 2 - 1
    const y = -((e.clientY - top) / height) * 2 + 1

    // Limitar a posição da mão dentro da caixa
    const limitedX = Math.max(-boxWidth / 2 + 0.1, Math.min(boxWidth / 2 - 0.1, (x * boxWidth) / 2))
    const limitedZ = Math.max(-boxDepth / 2 + 0.1, Math.min(boxDepth / 2 - 0.1, (y * boxDepth) / 2))

    setHandPosition([limitedX, boxHeight / 2 + 0.1, limitedZ])
  }

  // Manipular clique para pegar/soltar pedras
  const handleClick = () => {
    if (isGrabbing && activeStone) {
      setIsGrabbing(false)
      setActiveStone(null)
      // Aqui poderia ter lógica para soltar a pedra
    } else {
      // Verificar se há uma pedra próxima para pegar
      const nearbyStone = selectedStones.find((stone) => {
        const dx = stone.position[0] - handPosition[0]
        const dz = stone.position[2] - handPosition[2]
        return Math.sqrt(dx * dx + dz * dz) < 0.2
      })

      if (nearbyStone) {
        setIsGrabbing(true)
        setActiveStone(nearbyStone)
        if (onStoneClick) onStoneClick(nearbyStone.id)
      }
    }
  }

  return (
    <group>
      {/* Base da caixa */}
      <mesh
        ref={boxRef}
        position={[0, -boxHeight / 2, 0]}
        receiveShadow
        onPointerMove={handleMouseMove}
        onClick={handleClick}
      >
        <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.8}
          metalness={0.2}
          bumpMap={useTexture("/textures/wood-texture.jpg")}
          bumpScale={0.02}
        />
      </mesh>

      {/* Interior da caixa (areia) */}
      <mesh position={[0, -boxHeight / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[boxWidth - 0.05, boxDepth - 0.05]} />
        <meshStandardMaterial
          color="#F5DEB3"
          roughness={1}
          bumpMap={useTexture("/textures/sand-bump.png")}
          bumpScale={0.01}
        />
      </mesh>

      {/* Mão robótica */}
      <RoboticHand position={handPosition} isGrabbing={isGrabbing} onClick={handleClick} />

      {/* Texto explicativo */}
      <Html position={[0, -boxHeight - 0.1, 0]} center>
        <div className="text-xs text-white bg-black/50 p-1 rounded">
          Mova o mouse sobre a caixa para controlar a mão robótica
        </div>
      </Html>
    </group>
  )
}

// Componente principal
export default function ArmarioPedrasCompleto() {
  const [selectedStones, setSelectedStones] = useState<any[]>([])
  const [cabinetStyle, setCabinetStyle] = useState<"wood" | "gold">("gold")
  const [showStoneInfo, setShowStoneInfo] = useState(false)
  const [selectedStoneInfo, setSelectedStoneInfo] = useState<any>(null)
  const [showBoxView, setShowBoxView] = useState(false)
  const controlsRef = useRef<any>(null)

  // Alternar estilo do armário
  const toggleCabinetStyle = () => {
    setCabinetStyle(cabinetStyle === "wood" ? "gold" : "wood")
  }

  // Selecionar/deselecionar uma pedra
  const toggleStoneSelection = (stoneId: string) => {
    if (selectedStones.find((s) => s.id === stoneId)) {
      setSelectedStones(selectedStones.filter((s) => s.id !== stoneId))
    } else {
      if (selectedStones.length < 7) {
        const stone = stoneData.find((s) => s.id === stoneId)
        if (stone) {
          setSelectedStones([...selectedStones, stone])
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
        properties: ["Equilíbrio", "Proteção", "Clareza mental"],
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

  // Resetar câmera
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  // Alternar entre visualização do armário e da caixa
  const toggleView = () => {
    setShowBoxView(!showBoxView)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Cabeçalho apenas com logo */}
      <div className="flex justify-center items-center mb-6">
        <div className="relative h-24 w-64">
          <Image src="/images/a-caixa-logo.png" alt="A CAIXA" width={240} height={96} className="object-contain" />
        </div>
      </div>

      {/* Controles principais */}
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={toggleCabinetStyle}
          variant="outline"
          className="bg-white/10 border-amber-300/30 hover:bg-white/20"
        >
          {cabinetStyle === "wood" ? "Gabinete Dourado" : "Gabinete de Madeira"}
        </Button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-amber-100">Armário Místico de Pedras</h2>
          <p className="text-sm text-amber-200/70">Selecione até 7 pedras para sua leitura</p>
        </div>

        <Button onClick={toggleView} variant="outline" className="bg-white/10 border-amber-300/30 hover:bg-white/20">
          {showBoxView ? "Ver Armário" : "Ver Caixa"}
        </Button>
      </div>

      {/* Canvas 3D */}
      <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-gradient-to-b from-purple-900/30 to-black/50 shadow-xl">
        <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow />
            <pointLight position={[-5, 5, 5]} intensity={1} />

            {!showBoxView ? (
              // Visualização do armário
              <>
                <Cabinet cabinetStyle={cabinetStyle} />

                {stoneData.map((stone) => (
                  <RealisticStone
                    key={stone.id}
                    stone={stone}
                    isSelected={selectedStones.some((s) => s.id === stone.id)}
                    onClick={() => toggleStoneSelection(stone.id)}
                    onInfoClick={() => showStoneDetails(stone.id)}
                  />
                ))}
              </>
            ) : (
              // Visualização da caixa com pedras selecionadas
              <StoneBox selectedStones={selectedStones} onStoneClick={(id) => console.log(`Pedra ${id} clicada`)} />
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

            <ContactShadows
              position={[0, -0.5, 0]}
              opacity={0.5}
              scale={10}
              blur={1}
              far={5}
              resolution={256}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Instruções */}
      <div className="mt-6 text-center text-sm text-amber-200/70">
        <p>
          Clique nas pedras para selecioná-las • Passe o mouse sobre uma pedra e clique no ícone (i) para ver detalhes
        </p>
        <p>Use o mouse para girar o armário • Clique em "Ver Caixa" para interagir com as pedras selecionadas</p>
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
    </div>
  )
}
