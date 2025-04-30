"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Após 4 segundos, redireciona para a página inicial
    const timer = setTimeout(() => {
      setShowSplash(false)
      setTimeout(() => {
        router.push("/")
      }, 1000) // Espera a animação de saída terminar
    }, 4000)

    return () => clearTimeout(timer)
  }, [router])

  if (!showSplash) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
        className="relative w-64 h-64 md:w-80 md:h-80"
      >
        <Image src="/images/a-caixa-official-logo.png" alt="A CAIXA" fill className="object-contain" priority />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-8 text-center"
      >
        <h1 className="text-amber-500 text-2xl md:text-3xl font-bold tracking-wider">A CAIXA</h1>
        <p className="text-amber-400/80 mt-2 text-sm md:text-base">TUDO ESTÁ DENTRO: O QUE FOI, O QUE É, O QUE VIRÁ.</p>
      </motion.div>

      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-10 text-amber-300/60 text-sm"
      >
        Carregando o portal místico...
      </motion.div>
    </motion.div>
  )
}
