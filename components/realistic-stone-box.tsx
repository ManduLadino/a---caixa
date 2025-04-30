"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function RealisticStoneBox() {
  const [message, setMessage] = useState("Clique para interagir com as pedras")

  return (
    <div className="relative w-full max-w-md mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
      <div className="aspect-square relative mb-4 bg-gray-800/50 rounded-lg overflow-hidden">
        <Image src="/images/stone-box.png" alt="Caixa de Pedras Místicas" fill className="object-cover" />
      </div>

      <div className="text-center">
        <p className="text-white/80 mb-4">{message}</p>
        <Button
          onClick={() => setMessage("As pedras estão sendo energizadas...")}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        >
          Energizar Pedras
        </Button>
      </div>
    </div>
  )
}
