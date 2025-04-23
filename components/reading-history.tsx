"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { HolographicCard } from "@/components/ui/holographic-card"
import { Button } from "@/components/ui/button"
import { ScrollText, Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { formatDate, truncateText } from "@/lib/utils"
import { MandalaGenerator } from "@/components/mandala-generator"

export default function ReadingHistory() {
  const { readings } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReading, setSelectedReading] = useState<string | null>(null)

  // Filtra as leituras com base no termo de busca
  const filteredReadings = readings.filter((reading) =>
    reading.reading.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full max-w-3xl">
      <HolographicCard className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-[#ff9be2]" /> Histórico de Leituras
        </h2>

        {readings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-4">Você ainda não tem leituras salvas.</p>
            <p>Faça sua primeira consulta para começar seu histórico místico!</p>
          </div>
        ) : (
          <>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar nas suas leituras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20"
              />
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {filteredReadings.map((reading) => (
                <motion.div
                  key={reading.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedReading === reading.id
                      ? "bg-[#8e2de2]/20 border border-[#8e2de2]/50"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedReading(selectedReading === reading.id ? null : reading.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-[#ff9be2]">{reading.question}</h3>
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(reading.date)}
                    </div>
                  </div>
                  <p className="text-sm">{truncateText(reading.reading)}</p>

                  <AnimatePresence>
                    {selectedReading === reading.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-32 h-32 mx-auto md:mx-0 flex-shrink-0">
                            <MandalaGenerator
                              params={reading.mandalaParams}
                              size={128}
                              className="rounded-full"
                              animate={true}
                              highQuality={false} // Use lower quality for thumbnails to improve performance
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="bg-white/5 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                              <p className="whitespace-pre-line">{reading.reading}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/5 border-white/20 hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Lógica para exportar PDF seria implementada aqui
                              alert("Exportação para PDF será implementada em breve!")
                            }}
                          >
                            Exportar como PDF
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </HolographicCard>
    </div>
  )
}
