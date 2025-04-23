"use client"

import type React from "react"

import { useState } from "react"
import * as XLSX from "xlsx"
import { FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export type ExcelData = {
  [key: string]: any
}

type ExcelProcessorProps = {
  onDataProcessed: (data: ExcelData) => void
  templateFields: string[]
}

type ProcessingStatus = "idle" | "processing" | "success" | "error"

export function ExcelProcessor({ onDataProcessed, templateFields }: ExcelProcessorProps) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [processedData, setProcessedData] = useState<ExcelData | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if file is Excel
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ]

    if (!validTypes.includes(selectedFile.type)) {
      setError("Formato de arquivo inválido. Por favor, envie um arquivo Excel (.xls ou .xlsx).")
      setStatus("error")
      return
    }

    setFile(selectedFile)
    setError(null)
    setStatus("idle")
  }

  const processExcelFile = async () => {
    if (!file) return

    try {
      setStatus("processing")
      setProgress(10)

      // Read the file
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          setProgress(30)
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })

          setProgress(50)

          // Get first sheet
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

          setProgress(70)

          // Process data - assuming first row contains headers
          const headers = jsonData[0] as string[]
          const rows = jsonData.slice(1)

          // Validate headers against template fields
          const missingFields = templateFields.filter((field) => !headers.includes(field))

          if (missingFields.length > 0) {
            setError(`Campos obrigatórios ausentes na planilha: ${missingFields.join(", ")}`)
            setStatus("error")
            return
          }

          // Create object with data
          const processedData: ExcelData = {}

          rows.forEach((row, rowIndex) => {
            headers.forEach((header, colIndex) => {
              if (templateFields.includes(header)) {
                processedData[header] = row[colIndex]
              }
            })
          })

          setProgress(90)

          // Validate data
          const invalidFields = Object.entries(processedData)
            .filter(
              ([key, value]) => templateFields.includes(key) && (value === undefined || value === null || value === ""),
            )
            .map(([key]) => key)

          if (invalidFields.length > 0) {
            setError(`Dados ausentes ou inválidos para os campos: ${invalidFields.join(", ")}`)
            setStatus("error")
            return
          }

          setProcessedData(processedData)
          onDataProcessed(processedData)
          setProgress(100)
          setStatus("success")
        } catch (err) {
          console.error("Error processing Excel file:", err)
          setError("Erro ao processar o arquivo Excel. Verifique se o formato está correto.")
          setStatus("error")
        }
      }

      reader.onerror = () => {
        setError("Erro ao ler o arquivo. Tente novamente.")
        setStatus("error")
      }

      reader.readAsArrayBuffer(file)
    } catch (err) {
      console.error("Error processing file:", err)
      setError("Ocorreu um erro inesperado. Tente novamente.")
      setStatus("error")
    }
  }

  const resetProcessor = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
    setProcessedData(null)
  }

  return (
    <Card className="bg-green-600 border-green-500">
      <CardHeader>
        <CardTitle className="text-white">Importar Dados da Planilha</CardTitle>
        <CardDescription className="text-gray-200">
          Importe todos os dados do paciente de uma planilha Excel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            id="excelFile"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="max-w-md"
            disabled={status === "processing" || status === "success"}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => document.getElementById("excelFile")?.click()}
            disabled={status === "processing" || status === "success"}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Selecionar Planilha
          </Button>
        </div>

        {file && status === "idle" && (
          <div className="flex items-center justify-between bg-green-700 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-white" />
              <span className="text-white font-medium">{file.name}</span>
            </div>
            <Button
              onClick={processExcelFile}
              variant="secondary"
              className="bg-white text-green-700 hover:bg-gray-100"
            >
              Processar Arquivo
            </Button>
          </div>
        )}

        {status === "processing" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white">Processando arquivo...</span>
              <span className="text-white">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === "success" && (
          <Alert variant="default" className="bg-green-700 text-white border-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              Dados processados com sucesso. O formulário foi preenchido com os dados da planilha.
            </AlertDescription>
            <Button
              onClick={resetProcessor}
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent text-white border-white hover:bg-green-800"
            >
              Processar outro arquivo
            </Button>
          </Alert>
        )}

        {status === "error" && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
              <Button onClick={resetProcessor} variant="outline" size="sm" className="mt-2 ml-2">
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-gray-200 text-sm mt-2">
          <p>A planilha deve conter os seguintes campos:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>nomePaciente, cpfPaciente, rgPaciente, dataNascimentoPaciente</li>
            <li>enderecoPaciente, bairroPaciente, cidadePaciente, cepPaciente</li>
            <li>emailContato, telefoneContato</li>
            <li>nomeResponsavel, cpfResponsavel, grauParentesco</li>
            <li>diagnosticoPaciente, sintomasPrincipais</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
