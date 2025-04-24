"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

interface ExportToPdfProps {
  reading: string
  question: string
  mandalaRef: React.RefObject<HTMLCanvasElement>
}

export default function ExportToPdf({ reading, question, mandalaRef }: ExportToPdfProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simulação da geração de PDF
      // Em uma implementação real, usaríamos uma biblioteca como jsPDF ou html2pdf
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulação de download
      const element = document.createElement("a")
      element.setAttribute("href", "data:text/plain;charset=utf-8,")
      element.setAttribute("download", `leitura-mistica-${new Date().getTime()}.pdf`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      alert("PDF gerado com sucesso! Em uma versão completa, o arquivo seria baixado automaticamente.")
    } catch (error) {
      console.error("Erro ao exportar PDF:", error)
      alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="bg-[#8e2de2] hover:bg-[#a100f5] text-white px-6 py-2 rounded-full"
    >
      <Download className="w-4 h-4 mr-2" /> {isExporting ? "Gerando PDF..." : "Salvar como PDF"}
    </Button>
  )
}
