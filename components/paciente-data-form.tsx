"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import { FileSpreadsheet, Download, CheckCircle2, XCircle, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

// Import the server actions at the top of the file
import { submitPacientesData, submitPacienteData, type ValidationResponse } from "@/actions/validate-form"

// Import the helper functions
import { handleServerValidationErrors } from "@/utils/form-helpers"

// Import the LoadingButton component
import { LoadingButton } from "@/components/ui/loading-button"

// Define the schema for a patient record
const pacienteSchema = z.object({
  nomePaciente: z
    .string()
    .min(3, { message: "Nome do paciente é obrigatório" })
    .refine((name) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name), {
      message: "O nome deve conter apenas letras e espaços.",
    }),
  nomeResponsavel: z
    .string()
    .min(3, { message: "Nome do responsável é obrigatório" })
    .refine((name) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name), {
      message: "O nome deve conter apenas letras e espaços.",
    }),
  contato: z
    .string()
    .min(8, { message: "Contato é obrigatório" })
    .refine(
      (contact) => {
        // Check if it's an email
        if (contact.includes("@")) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
        }
        // Check if it's a phone number
        return /^[0-9() -]+$/.test(contact)
      },
      {
        message: "Contato deve ser um email válido ou um número de telefone",
      },
    ),
  pendencias: z.string().optional(),
  jaFezConsulta: z.boolean().default(false),
  jaFezAnvisa: z.boolean().default(false),
  enviadoAdvogado: z.boolean().default(false),
})

// Define the schema for the form
const formSchema = z.object({
  pacientes: z.array(pacienteSchema),
  searchTerm: z.string().optional(),
})

// Type for a patient record
type Paciente = z.infer<typeof pacienteSchema>

export default function PacienteDataForm() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Add a loading state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pacientes: [],
      searchTerm: "",
    },
  })

  // Get the current list of patients
  const pacientes = form.watch("pacientes")

  // Filter patients based on search term
  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.nomePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.nomeResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paciente.pendencias && paciente.pendencias.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Update the onSubmit function to handle loading state
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Submit the pacientes data to the server for validation
      const response: ValidationResponse = await submitPacientesData(values.pacientes)

      // Handle validation errors
      if (!handleServerValidationErrors(form, response)) {
        return
      }

      // If successful, show success toast
      toast({
        title: "Dados salvos com sucesso",
        description: response.message || `${values.pacientes.length} pacientes registrados.`,
      })

      console.log(values)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Excel file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ]

    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Formato de arquivo inválido",
        description: "Por favor, selecione um arquivo Excel (.xls ou .xlsx).",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        // Validate required columns
        const requiredColumns = ["NOME PACIENTE", "NOME RESPONSÁVEL", "CONTATO"]
        const headers = Object.keys(jsonData[0] || {})

        const missingColumns = requiredColumns.filter((col) => !headers.includes(col))
        if (missingColumns.length > 0) {
          toast({
            variant: "destructive",
            title: "Colunas obrigatórias ausentes",
            description: `As seguintes colunas são obrigatórias: ${missingColumns.join(", ")}`,
          })
          return
        }

        // Map the data to our schema
        const pacientes: Paciente[] = jsonData.map((row) => ({
          nomePaciente: row["NOME PACIENTE"] || "",
          nomeResponsavel: row["NOME RESPONSÁVEL"] || "",
          contato: row["CONTATO"] || "",
          pendencias: row["PENDÊNCIAS"] || "",
          jaFezConsulta: row["JÁ FEZ CONSULTA?"] === "Sim" || row["JÁ FEZ CONSULTA?"] === true,
          jaFezAnvisa: row["JÁ FEZ ANVISA?"] === "Sim" || row["JÁ FEZ ANVISA?"] === true,
          enviadoAdvogado: row["ENVIADO AO ADVOGADO"] === "Sim" || row["ENVIADO AO ADVOGADO"] === true,
        }))

        // Validate data
        if (pacientes.length === 0) {
          toast({
            variant: "destructive",
            title: "Planilha vazia",
            description: "A planilha não contém dados para importar.",
          })
          return
        }

        // Check for empty required fields
        const invalidRows = pacientes.filter((p) => !p.nomePaciente || !p.nomeResponsavel || !p.contato)

        if (invalidRows.length > 0) {
          toast({
            variant: "warning",
            title: "Dados incompletos",
            description: `${invalidRows.length} registros possuem campos obrigatórios vazios.`,
          })
        }

        // Update the form
        form.setValue("pacientes", pacientes)

        toast({
          title: "Dados importados com sucesso",
          description: `${pacientes.length} pacientes importados.`,
        })
      } catch (error) {
        console.error("Error importing Excel file:", error)
        toast({
          variant: "destructive",
          title: "Erro ao importar arquivo",
          description: "Verifique se o formato do arquivo está correto.",
        })
      }
    }

    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Erro ao ler arquivo",
        description: "Não foi possível ler o arquivo selecionado.",
      })
    }

    reader.readAsArrayBuffer(file)
  }

  // Handle Excel file export
  const handleExport = () => {
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      pacientes.map((p) => ({
        "NOME PACIENTE": p.nomePaciente,
        "NOME RESPONSÁVEL": p.nomeResponsavel,
        CONTATO: p.contato,
        PENDÊNCIAS: p.pendencias || "",
        "JÁ FEZ CONSULTA?": p.jaFezConsulta ? "Sim" : "Não",
        "JÁ FEZ ANVISA?": p.jaFezAnvisa ? "Sim" : "Não",
        "ENVIADO AO ADVOGADO": p.enviadoAdvogado ? "Sim" : "Não",
      })),
    )

    // Create a workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes")

    // Generate Excel file
    XLSX.writeFile(workbook, `pacientes-${format(new Date(), "dd-MM-yyyy")}.xlsx`)
  }

  // Add a new patient
  const addPaciente = (paciente: Paciente) => {
    const currentPacientes = form.getValues("pacientes")
    form.setValue("pacientes", [...currentPacientes, paciente])
    setShowAddDialog(false)
  }

  // Edit an existing patient
  const editPaciente = (paciente: Paciente, index: number) => {
    const currentPacientes = form.getValues("pacientes")
    const updatedPacientes = [...currentPacientes]
    updatedPacientes[index] = paciente
    form.setValue("pacientes", updatedPacientes)
    setEditingPaciente(null)
    setEditingIndex(null)
  }

  // Delete a patient
  const deletePaciente = (index: number) => {
    const currentPacientes = form.getValues("pacientes")
    const updatedPacientes = currentPacientes.filter((_, i) => i !== index)
    form.setValue("pacientes", updatedPacientes)
  }

  // Add a loading state for the PacienteForm
  const [isSubmittingPaciente, setIsSubmittingPaciente] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-green-600 border-green-500">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Gerenciamento de Pacientes MANDU</CardTitle>
          <CardDescription className="text-gray-200">
            Importe, gerencie e exporte dados de pacientes do projeto MANDU CANNABINIO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-4 mb-4">
                    <Input
                      id="excelFile"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileImport}
                      className="max-w-md"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 bg-white text-green-700 hover:bg-gray-100"
                      onClick={() => document.getElementById("excelFile")?.click()}
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Importar Excel
                    </Button>
                  </div>
                  <FormDescription className="text-gray-200 mb-4">
                    Importe uma planilha Excel com os dados dos pacientes. A planilha deve conter as colunas: NOME
                    PACIENTE, NOME RESPONSÁVEL, CONTATO, PENDÊNCIAS, JÁ FEZ CONSULTA?, JÁ FEZ ANVISA?, ENVIADO AO
                    ADVOGADO.
                  </FormDescription>
                </div>
                <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4 justify-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar paciente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 bg-white text-green-700 hover:bg-gray-100"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4" />
                    Exportar Excel
                  </Button>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white">
                        <Plus className="h-4 w-4" />
                        Adicionar Paciente
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Paciente</DialogTitle>
                        <DialogDescription>Preencha os dados do paciente para adicionar ao sistema.</DialogDescription>
                      </DialogHeader>
                      <PacienteForm
                        onSubmit={addPaciente}
                        onCancel={() => setShowAddDialog(false)}
                        initialData={null}
                        isSubmitting={isSubmittingPaciente}
                        setIsSubmitting={setIsSubmittingPaciente}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="bg-white rounded-md overflow-hidden">
                <Table>
                  <TableCaption>Lista de pacientes do projeto MANDU CANNABINIO</TableCaption>
                  <TableHeader className="bg-green-700">
                    <TableRow>
                      <TableHead className="text-white">Nome do Paciente</TableHead>
                      <TableHead className="text-white">Nome do Responsável</TableHead>
                      <TableHead className="text-white">Contato</TableHead>
                      <TableHead className="text-white">Pendências</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPacientes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {searchTerm
                            ? "Nenhum paciente encontrado com os critérios de busca."
                            : "Nenhum paciente cadastrado. Importe uma planilha ou adicione manualmente."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPacientes.map((paciente, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{paciente.nomePaciente}</TableCell>
                          <TableCell>{paciente.nomeResponsavel}</TableCell>
                          <TableCell>{paciente.contato}</TableCell>
                          <TableCell>
                            {paciente.pendencias ? (
                              <Badge variant="destructive">{paciente.pendencias}</Badge>
                            ) : (
                              <Badge variant="outline">Sem pendências</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                {paciente.jaFezConsulta ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-xs">Consulta</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {paciente.jaFezAnvisa ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-xs">ANVISA</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {paciente.enviadoAdvogado ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-xs">Advogado</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog
                                open={editingIndex === index}
                                onOpenChange={(open) => {
                                  if (open) {
                                    setEditingPaciente(paciente)
                                    setEditingIndex(index)
                                  } else {
                                    setEditingPaciente(null)
                                    setEditingIndex(null)
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Editar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle>Editar Paciente</DialogTitle>
                                    <DialogDescription>Atualize os dados do paciente no sistema.</DialogDescription>
                                  </DialogHeader>
                                  {editingPaciente && (
                                    <PacienteForm
                                      onSubmit={(data) => editPaciente(data, index)}
                                      onCancel={() => {
                                        setEditingPaciente(null)
                                        setEditingIndex(null)
                                      }}
                                      initialData={editingPaciente}
                                      isSubmitting={isSubmittingPaciente}
                                      setIsSubmitting={setIsSubmittingPaciente}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button variant="destructive" size="sm" onClick={() => deletePaciente(index)}>
                                Excluir
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between">
                <div className="text-white">
                  Total de pacientes: <strong>{pacientes.length}</strong>
                  {searchTerm && (
                    <>
                      {" "}
                      | Filtrados: <strong>{filteredPacientes.length}</strong>
                    </>
                  )}
                </div>
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-green-800 hover:bg-green-900 text-white"
                >
                  Salvar Alterações
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

// Form for adding/editing a patient
function PacienteForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting,
  setIsSubmitting,
}: {
  onSubmit: (data: Paciente) => void
  onCancel: () => void
  initialData: Paciente | null
  isSubmitting: boolean
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const form = useForm<Paciente>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: initialData || {
      nomePaciente: "",
      nomeResponsavel: "",
      contato: "",
      pendencias: "",
      jaFezConsulta: false,
      jaFezAnvisa: false,
      enviadoAdvogado: false,
    },
  })

  // Update the PacienteForm component's handleSubmit function
  async function handleSubmit(values: Paciente) {
    setIsSubmitting(true)

    try {
      // First validate on the server
      const response = await submitPacienteData(values)

      if (handleServerValidationErrors(form, response)) {
        onSubmit(values)
        form.reset()
      }
    } catch (error) {
      console.error("Error submitting paciente:", error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar paciente",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatContact = (value: string) => {
    // If it looks like an email, don't format it
    if (value.includes("@")) return value

    // Otherwise format as phone
    const phoneClean = value.replace(/[^\d]/g, "")
    if (phoneClean.length <= 2) return phoneClean
    if (phoneClean.length <= 6) return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2)}`
    if (phoneClean.length <= 10) return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2, 6)}-${phoneClean.slice(6)}`
    return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2, 7)}-${phoneClean.slice(7, 11)}`
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nomePaciente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Paciente*</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nomeResponsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Responsável*</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contato*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o telefone ou email"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value
                    // Only format if it doesn't look like an email
                    if (!value.includes("@")) {
                      field.onChange(formatContact(value))
                    } else {
                      field.onChange(value)
                    }
                  }}
                />
              </FormControl>
              <FormDescription>Informe um email válido ou telefone no formato (00) 00000-0000</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pendencias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pendências</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva as pendências, se houver" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="jaFezConsulta"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Já fez consulta?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jaFezAnvisa"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Já fez ANVISA?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enviadoAdvogado"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enviado ao advogado?</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <LoadingButton type="submit" isLoading={isSubmitting}>
            Salvar
          </LoadingButton>
        </DialogFooter>
      </form>
    </Form>
  )
}
