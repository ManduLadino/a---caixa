"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Upload, FileText, Download, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExcelProcessor, type ExcelData } from "@/components/excel-processor"

// Import the server actions at the top of the file
import { submitFormData, type ValidationResponse } from "@/actions/validate-form"

// Import the helper functions
import {
  handleServerValidationErrors,
  formatFileUploadsForValidation,
  prepareFormDataForServer,
} from "@/utils/form-helpers"

// Import the LoadingButton component
import { LoadingButton } from "@/components/ui/loading-button"

const formSchema = z.object({
  dataPreenchimento: z
    .date({
      required_error: "A data de preenchimento é obrigatória.",
    })
    .refine((date) => date <= new Date(), {
      message: "A data de preenchimento não pode ser no futuro.",
    }),
  destinoDocumento: z.string({
    required_error: "O destino do documento é obrigatório.",
  }),
  tipoSolicitacao: z.enum(["cadastro", "renovacao"], {
    required_error: "O tipo de solicitação é obrigatório.",
  }),
  nomePaciente: z
    .string()
    .min(3, {
      message: "O nome completo deve ter pelo menos 3 caracteres.",
    })
    .refine((name) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name), {
      message: "O nome deve conter apenas letras e espaços.",
    }),
  idadePaciente: z
    .string()
    .min(1, {
      message: "A idade é obrigatória.",
    })
    .refine((age) => !isNaN(Number(age)) && Number(age) > 0 && Number(age) < 120, {
      message: "A idade deve ser um número entre 1 e 120.",
    }),
  dataNascimentoPaciente: z
    .date({
      required_error: "A data de nascimento é obrigatória.",
    })
    .refine((date) => date <= new Date(), {
      message: "A data de nascimento não pode ser no futuro.",
    })
    .refine(
      (date) => {
        const now = new Date()
        const minDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate())
        return date >= minDate
      },
      {
        message: "A data de nascimento não pode ser mais de 120 anos atrás.",
      },
    ),
  rgPaciente: z
    .string()
    .min(5, {
      message: "O RG deve ter pelo menos 5 caracteres.",
    })
    .refine((rg) => /^[0-9./-]+$/.test(rg), {
      message: "O RG deve conter apenas números e caracteres especiais como . / -",
    }),
  cpfPaciente: z
    .string()
    .min(11, {
      message: "O CPF deve ter 11 dígitos.",
    })
    .refine(
      (cpf) => {
        const cpfClean = cpf.replace(/[^\d]/g, "")
        return cpfClean.length === 11 && /^\d{11}$/.test(cpfClean)
      },
      {
        message: "O CPF deve conter 11 dígitos numéricos.",
      },
    )
    .refine(
      (cpf) => {
        const cpfClean = cpf.replace(/[^\d]/g, "")
        if (
          cpfClean === "00000000000" ||
          cpfClean === "11111111111" ||
          cpfClean === "22222222222" ||
          cpfClean === "33333333333" ||
          cpfClean === "44444444444" ||
          cpfClean === "55555555555" ||
          cpfClean === "66666666666" ||
          cpfClean === "77777777777" ||
          cpfClean === "88888888888" ||
          cpfClean === "99999999999"
        ) {
          return false
        }
        return true
      },
      {
        message: "CPF inválido. Verifique os números digitados.",
      },
    ),
  cartaoSusPaciente: z
    .string()
    .min(15, {
      message: "O Cartão SUS deve ter 15 dígitos.",
    })
    .refine((sus) => /^\d{15}$/.test(sus.replace(/[^\d]/g, "")), {
      message: "O Cartão SUS deve conter 15 dígitos numéricos.",
    }),
  emailContato: z.string().email({
    message: "Digite um e-mail válido no formato nome@dominio.com",
  }),
  telefoneContato: z
    .string()
    .min(10, {
      message: "O telefone deve ter pelo menos 10 dígitos.",
    })
    .refine((phone) => /^[0-9() -]+$/.test(phone), {
      message: "O telefone deve conter apenas números e caracteres como () -",
    }),
  enderecoPaciente: z.string().min(5, {
    message: "O endereço deve ter pelo menos 5 caracteres.",
  }),
  bairroPaciente: z.string().min(2, {
    message: "O bairro deve ter pelo menos 2 caracteres.",
  }),
  cidadePaciente: z
    .string()
    .min(2, {
      message: "A cidade deve ter pelo menos 2 caracteres.",
    })
    .refine((city) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(city), {
      message: "A cidade deve conter apenas letras e espaços.",
    }),
  cepPaciente: z
    .string()
    .min(8, {
      message: "O CEP deve ter 8 dígitos.",
    })
    .refine((cep) => /^\d{5}-?\d{3}$/.test(cep.replace(/[^\d-]/g, "")), {
      message: "O CEP deve estar no formato 00000-000 ou 00000000.",
    }),
  nomeResponsavel: z
    .string()
    .min(3, {
      message: "O nome do responsável deve ter pelo menos 3 caracteres.",
    })
    .refine((name) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name), {
      message: "O nome deve conter apenas letras e espaços.",
    }),
  cpfResponsavel: z
    .string()
    .min(11, {
      message: "O CPF do responsável deve ter 11 dígitos.",
    })
    .refine(
      (cpf) => {
        const cpfClean = cpf.replace(/[^\d]/g, "")
        return cpfClean.length === 11 && /^\d{11}$/.test(cpfClean)
      },
      {
        message: "O CPF deve conter 11 dígitos numéricos.",
      },
    )
    .refine(
      (cpf) => {
        const cpfClean = cpf.replace(/[^\d]/g, "")
        if (
          cpfClean === "00000000000" ||
          cpfClean === "11111111111" ||
          cpfClean === "22222222222" ||
          cpfClean === "33333333333" ||
          cpfClean === "44444444444" ||
          cpfClean === "55555555555" ||
          cpfClean === "66666666666" ||
          cpfClean === "77777777777" ||
          cpfClean === "88888888888" ||
          cpfClean === "99999999999"
        ) {
          return false
        }
        return true
      },
      {
        message: "CPF inválido. Verifique os números digitados.",
      },
    ),
  grauParentesco: z.string().min(1, {
    message: "O grau de parentesco é obrigatório.",
  }),
  diagnosticoPaciente: z.string().min(3, {
    message: "O diagnóstico deve ter pelo menos 3 caracteres.",
  }),
  medicamentosUsados: z.string().optional(),
  sintomasPrincipais: z.string().min(3, {
    message: "Os sintomas principais devem ter pelo menos 3 caracteres.",
  }),
  horarioContato: z.string().min(1, {
    message: "O horário de contato é obrigatório.",
  }),
  quantidadePessoas: z
    .string()
    .min(1, {
      message: "A quantidade de pessoas é obrigatória.",
    })
    .refine((qty) => !isNaN(Number(qty)) && Number(qty) > 0 && Number(qty) <= 20, {
      message: "A quantidade de pessoas deve ser um número entre 1 e 20.",
    }),
  rendaBruta: z.string().min(1, {
    message: "A renda bruta é obrigatória.",
  }),
  cadastroGovBr: z.enum(["sim", "nao"], {
    required_error: "Esta informação é obrigatória.",
  }),
  laudoMedico: z.any().optional(),
  exames: z.any().optional(),
  examesAdicionais: z.any().optional(),
  agendamentos: z.any().optional(),
  documentosPaciente: z.any().optional(),
  documentosResponsavel: z.any().optional(),
  comprovanteResidencia: z.any().optional(),
  extratosBancarios: z.any().optional(),
  contaBancaria: z.any().optional(),
  documentosAcompanhante: z.any().optional(),
  documentosDoador: z.any().optional(),
  observacoes: z.string().optional(),
})

type FileUploadState = {
  [key: string]: File[]
}

type ReportOption = {
  id: string
  label: string
  checked: boolean
}

export default function FormularioCadastro() {
  const [fileUploads, setFileUploads] = useState<FileUploadState>({
    laudoMedico: [],
    exames: [],
    examesAdicionais: [],
    agendamentos: [],
    documentosPaciente: [],
    documentosResponsavel: [],
    comprovanteResidencia: [],
    extratosBancarios: [],
    contaBancaria: [],
    documentosAcompanhante: [],
    documentosDoador: [],
  })

  const [reportOptions, setReportOptions] = useState<ReportOption[]>([
    { id: "dadosPessoais", label: "Dados Pessoais do Paciente", checked: true },
    { id: "dadosResponsavel", label: "Dados do Responsável", checked: true },
    { id: "dadosMedicos", label: "Informações Médicas", checked: true },
    { id: "dadosSocioeconomicos", label: "Informações Socioeconômicas", checked: true },
    { id: "documentosAnexados", label: "Lista de Documentos Anexados", checked: true },
    { id: "observacoes", label: "Observações", checked: true },
  ])

  const [reportPreview, setReportPreview] = useState<string>("")
  const [showReportDialog, setShowReportDialog] = useState(false)

  // Add a loading state
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataPreenchimento: new Date(),
      observacoes: "",
      medicamentosUsados: "",
    },
  })

  // Add this after the form declaration
  const formatCPF = (value: string) => {
    const cpfClean = value.replace(/[^\d]/g, "")
    if (cpfClean.length <= 3) return cpfClean
    if (cpfClean.length <= 6) return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3)}`
    if (cpfClean.length <= 9) return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3, 6)}.${cpfClean.slice(6)}`
    return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3, 6)}.${cpfClean.slice(6, 9)}-${cpfClean.slice(9, 11)}`
  }

  // Add this after the formatCPF function
  const formatCEP = (value: string) => {
    const cepClean = value.replace(/[^\d]/g, "")
    if (cepClean.length <= 5) return cepClean
    return `${cepClean.slice(0, 5)}-${cepClean.slice(5, 8)}`
  }

  // Add this after the formatCEP function
  const formatPhone = (value: string) => {
    const phoneClean = value.replace(/[^\d]/g, "")
    if (phoneClean.length <= 2) return phoneClean
    if (phoneClean.length <= 6) return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2)}`
    if (phoneClean.length <= 10) return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2, 6)}-${phoneClean.slice(6)}`
    return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2, 7)}-${phoneClean.slice(7, 11)}`
  }

  // Required fields for Excel import
  const requiredExcelFields = [
    "nomePaciente",
    "cpfPaciente",
    "rgPaciente",
    "dataNascimentoPaciente",
    "enderecoPaciente",
    "bairroPaciente",
    "cidadePaciente",
    "cepPaciente",
    "emailContato",
    "telefoneContato",
    "nomeResponsavel",
    "cpfResponsavel",
    "grauParentesco",
    "diagnosticoPaciente",
    "sintomasPrincipais",
  ]

  const handleExcelDataProcessed = (data: ExcelData) => {
    // Map Excel data to form fields
    const formValues: Partial<z.infer<typeof formSchema>> = {}

    // Process each field from Excel data
    Object.entries(data).forEach(([key, value]) => {
      // Handle date fields specially
      if (key === "dataNascimentoPaciente" && value) {
        try {
          // Try to parse date - Excel dates are often stored as numbers
          const dateValue =
            typeof value === "number"
              ? new Date(Math.round((value - 25569) * 86400 * 1000)) // Convert Excel date to JS date
              : new Date(value)

          if (!isNaN(dateValue.getTime())) {
            formValues[key as keyof z.infer<typeof formSchema>] = dateValue
          }
        } catch (err) {
          console.error(`Error parsing date for ${key}:`, err)
        }
      } else {
        // Handle other fields
        formValues[key as keyof z.infer<typeof formSchema>] = value
      }
    })

    // Update form with the processed data
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.setValue(key as any, value)
      }
    })

    toast({
      title: "Dados importados com sucesso",
      description: "Os campos do formulário foram preenchidos com os dados da planilha.",
    })
  }

  // Remove the validateFileUploads function as it's now handled by the server

  // Update the onSubmit function to use the helpers
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Format file uploads for validation
      const fileUploadCounts = formatFileUploadsForValidation(fileUploads)

      // Prepare form data for server validation
      const formDataForServer = prepareFormDataForServer(values)

      // Submit the form data to the server for validation
      const response: ValidationResponse = await submitFormData(formDataForServer, fileUploadCounts)

      // Handle validation errors
      if (!handleServerValidationErrors(form, response)) {
        return
      }

      // If successful, show success toast
      toast({
        title: "Formulário enviado com sucesso!",
        description: response.message || "Seus dados foram recebidos. Em breve entraremos em contato.",
      })

      // Here you would typically redirect the user or reset the form
      console.log("Dados do formulário:", values)
      console.log("Arquivos:", fileUploads)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    maxFiles = 50,
    maxSizeMB = 10,
  ) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    // Verificar tamanho dos arquivos
    const oversizedFiles = newFiles.filter((file) => file.size > maxSizeBytes)
    if (oversizedFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Arquivos muito grandes",
        description: `Alguns arquivos excedem o limite de ${maxSizeMB}MB.`,
      })
      return
    }

    // Verificar se são PDFs
    const nonPdfFiles = newFiles.filter((file) => file.type !== "application/pdf")
    if (nonPdfFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Apenas arquivos PDF são aceitos.",
      })
      return
    }

    // Verificar número máximo de arquivos
    if (fileUploads[fieldName].length + newFiles.length > maxFiles) {
      toast({
        variant: "destructive",
        title: "Muitos arquivos",
        description: `Você pode enviar no máximo ${maxFiles} arquivos.`,
      })
      return
    }

    setFileUploads((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], ...newFiles],
    }))
  }

  const removeFile = (fieldName: string, index: number) => {
    setFileUploads((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }))
  }

  const toggleReportOption = (id: string) => {
    setReportOptions(
      reportOptions.map((option) => (option.id === id ? { ...option, checked: !option.checked } : option)),
    )
  }

  const generateReport = () => {
    const values = form.getValues()
    let reportContent = "# Relatório do Paciente\n\n"

    // Dados Pessoais
    if (reportOptions.find((o) => o.id === "dadosPessoais")?.checked) {
      reportContent += "## Dados Pessoais\n\n"
      reportContent += `**Nome:** ${values.nomePaciente || "Não informado"}\n`
      reportContent += `**Idade:** ${values.idadePaciente || "Não informada"}\n`
      reportContent += `**Data de Nascimento:** ${
        values.dataNascimentoPaciente ? format(values.dataNascimentoPaciente, "dd/MM/yyyy") : "Não informada"
      }\n`
      reportContent += `**RG:** ${values.rgPaciente || "Não informado"}\n`
      reportContent += `**CPF:** ${values.cpfPaciente || "Não informado"}\n`
      reportContent += `**Cartão SUS:** ${values.cartaoSusPaciente || "Não informado"}\n`
      reportContent += `**Email:** ${values.emailContato || "Não informado"}\n`
      reportContent += `**Telefone:** ${values.telefoneContato || "Não informado"}\n`
      reportContent += `**Endereço:** ${values.enderecoPaciente || "Não informado"}\n`
      reportContent += `**Bairro:** ${values.bairroPaciente || "Não informado"}\n`
      reportContent += `**Cidade:** ${values.cidadePaciente || "Não informado"}\n`
      reportContent += `**CEP:** ${values.cepPaciente || "Não informado"}\n\n`
    }

    // Dados do Responsável
    if (reportOptions.find((o) => o.id === "dadosResponsavel")?.checked) {
      reportContent += "## Dados do Responsável\n\n"
      reportContent += `**Nome:** ${values.nomeResponsavel || "Não informado"}\n`
      reportContent += `**CPF:** ${values.cpfResponsavel || "Não informado"}\n`
      reportContent += `**Grau de Parentesco:** ${values.grauParentesco || "Não informado"}\n\n`
    }

    // Informações Médicas
    if (reportOptions.find((o) => o.id === "dadosMedicos")?.checked) {
      reportContent += "## Informações Médicas\n\n"
      reportContent += `**Diagnóstico:** ${values.diagnosticoPaciente || "Não informado"}\n`
      reportContent += `**Medicamentos:** ${values.medicamentosUsados || "Não informados"}\n`
      reportContent += `**Sintomas Principais:** ${values.sintomasPrincipais || "Não informados"}\n`
      reportContent += `**Horário de Contato:** ${values.horarioContato || "Não informado"}\n\n`
    }

    // Informações Socioeconômicas
    if (reportOptions.find((o) => o.id === "dadosSocioeconomicos")?.checked) {
      reportContent += "## Informações Socioeconômicas\n\n"
      reportContent += `**Quantidade de Pessoas na Residência:** ${values.quantidadePessoas || "Não informada"}\n`
      reportContent += `**Renda Bruta:** ${values.rendaBruta || "Não informada"}\n`
      reportContent += `**Cadastro no GOV.BR:** ${values.cadastroGovBr === "sim" ? "Sim" : "Não"}\n\n`
    }

    // Documentos Anexados
    if (reportOptions.find((o) => o.id === "documentosAnexados")?.checked) {
      reportContent += "## Documentos Anexados\n\n"

      const documentSections = [
        { name: "Laudo Médico", files: fileUploads.laudoMedico },
        { name: "Exames", files: fileUploads.exames },
        { name: "Exames Adicionais", files: fileUploads.examesAdicionais },
        { name: "Agendamentos", files: fileUploads.agendamentos },
        { name: "Documentos do Paciente", files: fileUploads.documentosPaciente },
        { name: "Documentos do Responsável", files: fileUploads.documentosResponsavel },
        { name: "Comprovante de Residência", files: fileUploads.comprovanteResidencia },
        { name: "Extratos Bancários", files: fileUploads.extratosBancarios },
        { name: "Conta Bancária", files: fileUploads.contaBancaria },
        { name: "Documentos do Acompanhante", files: fileUploads.documentosAcompanhante },
        { name: "Documentos do Doador", files: fileUploads.documentosDoador },
      ]

      documentSections.forEach((section) => {
        if (section.files.length > 0) {
          reportContent += `**${section.name}:** ${section.files.length} arquivo(s)\n`
        }
      })

      reportContent += "\n"
    }

    // Observações
    if (reportOptions.find((o) => o.id === "observacoes")?.checked && values.observacoes) {
      reportContent += "## Observações\n\n"
      reportContent += values.observacoes + "\n\n"
    }

    reportContent += `\nRelatório gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`

    setReportPreview(reportContent)
    setShowReportDialog(true)
  }

  const downloadReport = () => {
    const blob = new Blob([reportPreview], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${form.getValues().nomePaciente || "paciente"}-${format(new Date(), "dd-MM-yyyy")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printReport = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Relatório do Paciente</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1 { color: #2e7d32; }
              h2 { color: #388e3c; margin-top: 20px; }
              p { margin: 8px 0; }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            ${reportPreview
              .replace(/\n\n/g, "</p><p>")
              .replace(/\n/g, "<br>")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
              .replace(/^# (.*?)$/gm, "<h1>$1</h1>")}
            <div class="footer">Projeto MANDU CANNABINIO</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }

  return (
    <>
      <Header />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-green-600 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">Informações Iniciais</CardTitle>
              <CardDescription className="text-gray-200">
                Preencha as informações básicas para iniciar o processo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="dataPreenchimento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">Data do preenchimento do formulário*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destinoDocumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Para onde o documento deve ser enviado?*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tfd">TFD</SelectItem>
                        <SelectItem value="cerac">CERAC</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoSolicitacao"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-white">Tipo de solicitação*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="cadastro" />
                          </FormControl>
                          <FormLabel className="font-normal">Cadastro</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="renovacao" />
                          </FormControl>
                          <FormLabel className="font-normal">Renovação de cadastro</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Excel Processor Component */}
          <ExcelProcessor onDataProcessed={handleExcelDataProcessed} templateFields={requiredExcelFields} />

          <Card className="bg-green-600 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">Dados do Paciente</CardTitle>
              <CardDescription className="text-gray-200">Informe os dados pessoais do paciente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="nomePaciente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome completo do paciente*</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idadePaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Idade do paciente*</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a idade" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataNascimentoPaciente"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white">Data de nascimento do paciente*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="rgPaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">RG do paciente*</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o RG" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpfPaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">CPF do paciente*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o CPF (somente números)"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCPF(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-200">Formato: 000.000.000-00</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cartaoSusPaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Cartão do SUS do paciente*</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número do cartão SUS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emailContato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">E-mail para contato*</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o e-mail" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefoneContato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Telefone para contato*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o telefone (somente números)"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-200">Formato: (00) 00000-0000</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="enderecoPaciente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Endereço do paciente*</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o endereço completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bairroPaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Bairro do paciente*</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cidadePaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Cidade do paciente*</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cepPaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">CEP do paciente*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o CEP (somente números)"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCEP(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-200">Formato: 00000-000</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">Dados do Responsável</CardTitle>
              <CardDescription className="text-gray-200">
                Informe os dados do responsável pelo paciente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="nomeResponsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome completo do responsável*</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cpfResponsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">CPF do responsável*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o CPF (somente números)"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCPF(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-200">Formato: 000.000.000-00</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grauParentesco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Grau de parentesco*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o grau de parentesco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pai">Pai</SelectItem>
                          <SelectItem value="mae">Mãe</SelectItem>
                          <SelectItem value="irmao">Irmão/Irmã</SelectItem>
                          <SelectItem value="avo">Avô/Avó</SelectItem>
                          <SelectItem value="tio">Tio/Tia</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">Informações Médicas</CardTitle>
              <CardDescription className="text-gray-200">Informe os dados médicos do paciente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="diagnosticoPaciente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Qual o diagnóstico do paciente?*</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o diagnóstico" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicamentosUsados"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Quais medicamentos já fez ou faz uso?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Liste os medicamentos" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sintomasPrincipais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Quais os principais sintomas apresentados?*</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva os sintomas" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horarioContato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Qual o melhor horário para entrar em contato com você?*
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manha">Manhã (8h às 12h)</SelectItem>
                        <SelectItem value="tarde">Tarde (12h às 18h)</SelectItem>
                        <SelectItem value="noite">Noite (18h às 22h)</SelectItem>
                        <SelectItem value="qualquer">Qualquer horário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-green-600 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">Informações Socioeconômicas</CardTitle>
              <CardDescription className="text-gray-200">Informe os dados socioeconômicos do paciente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="quantidadePessoas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Quantas pessoas moram em sua residência?*</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a quantidade" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rendaBruta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Qual a renda bruta desta residência?*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a faixa de renda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ate1sm">Até 1 salário mínimo</SelectItem>
                        <SelectItem value="1a2sm">De 1 a 2 salários mínimos</SelectItem>
                        <SelectItem value="2a3sm">De 2 a 3 salários mínimos</SelectItem>
                        <SelectItem value="3a5sm">De 3 a 5 salários mínimos</SelectItem>
                        <SelectItem value="5a10sm">De 5 a 10 salários mínimos</SelectItem>
                        <SelectItem value="mais10sm">Mais de 10 salários mínimos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cadastroGovBr"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-white">Você possui cadastro no GOV.BR?*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="sim" />
                          </FormControl>
                          <FormLabel className="font-normal">Sim</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="nao" />
                          </FormControl>
                          <FormLabel className="font-normal">Não</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-green-600 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">Documentação</CardTitle>
              <CardDescription className="text-gray-200">
                Anexe todos os documentos necessários (somente arquivos PDF).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="laudoMedico"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">Anexar laudo médico TFD* (máx. 50 arquivos PDF)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="laudoMedico"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "laudoMedico")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("laudoMedico")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.laudoMedico.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.laudoMedico.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("laudoMedico", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormDescription>Anexe o laudo médico TFD em formato PDF.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="exames"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">
                      Anexar exames* (máx. 50 arquivos PDF, limite de 10MB por arquivo)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="exames"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "exames")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("exames")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.exames.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.exames.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("exames", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormDescription>Anexe os exames em formato PDF.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="examesAdicionais"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">Anexar exames adicionais (máx. 50 arquivos PDF)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="examesAdicionais"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "examesAdicionais")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("examesAdicionais")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.examesAdicionais.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.examesAdicionais.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("examesAdicionais", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="agendamentos"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">Anexar agendamento(s)* (máx. 50 arquivos PDF)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="agendamentos"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "agendamentos")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("agendamentos")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.agendamentos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.agendamentos.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("agendamentos", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="documentosPaciente"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">
                      Anexar RG, CPF e cartão SUS do paciente - Página única* (máx. 50 arquivos PDF)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="documentosPaciente"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "documentosPaciente")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("documentosPaciente")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.documentosPaciente.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.documentosPaciente.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("documentosPaciente", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="documentosResponsavel"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">
                      Anexar RG, CPF do responsável - Página única* (máx. 50 arquivos PDF)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="documentosResponsavel"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "documentosResponsavel")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("documentosResponsavel")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.documentosResponsavel.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.documentosResponsavel.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("documentosResponsavel", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="comprovanteResidencia"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">
                      Anexar comprovante de residência do paciente* (máx. 1 arquivo PDF)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="comprovanteResidencia"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "comprovanteResidencia", 1)}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("comprovanteResidencia")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.comprovanteResidencia.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivo selecionado:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.comprovanteResidencia.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("comprovanteResidencia", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="extratosBancarios"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">
                      Anexar extratos bancários dos últimos 3 meses* (máx. 50 arquivos PDF)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="extratosBancarios"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "extratosBancarios")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("extratosBancarios")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.extratosBancarios.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.extratosBancarios.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("extratosBancarios", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="contaBancaria"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">
                      Anexar conta bancária do paciente ou acompanhante frente e verso (máx. 50 arquivos PDF)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="contaBancaria"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "contaBancaria")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("contaBancaria")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.contaBancaria.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.contaBancaria.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("contaBancaria", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="documentosAcompanhante"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">
                      Anexar RG, CPF e cartão SUS do acompanhante - Página única (máx. 50 arquivos PDF)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="documentosAcompanhante"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "documentosAcompanhante")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("documentosAcompanhante")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.documentosAcompanhante.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.documentosAcompanhante.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("documentosAcompanhante", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="documentosDoador"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-white">
                      Anexar RG, CPF e cartão SUS do doador - Página única (máx. 50 arquivos PDF)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          id="documentosDoador"
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "documentosDoador")}
                          className="max-w-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById("documentosDoador")?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar
                        </Button>
                      </div>
                    </FormControl>
                    {fileUploads.documentosDoador.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Arquivos selecionados:</p>
                        <ul className="text-sm space-y-1">
                          {fileUploads.documentosDoador.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("documentosDoador", index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                &times;
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-green-600 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">Observações</CardTitle>
              <CardDescription className="text-gray-200">
                Informações adicionais que possam ser relevantes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Digite suas observações aqui..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-green-600 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">Relatórios</CardTitle>
              <CardDescription className="text-gray-200">
                Gere relatórios personalizados com os dados do formulário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={option.checked}
                        onCheckedChange={() => toggleReportOption(option.id)}
                      />
                      <label
                        htmlFor={option.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={generateReport}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <FileText className="h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-green-800 text-white p-4 rounded-md">
            <p className="text-sm">
              Campos marcados com * são obrigatórios. Certifique-se de que estão preenchidos corretamente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Enviando..."
              className="w-full md:w-auto md:px-8 bg-green-800 hover:bg-green-900 text-white"
            >
              Enviar Formulário
            </LoadingButton>
          </div>
        </form>
      </Form>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Relatório do Paciente</DialogTitle>
            <DialogDescription>Visualize, imprima ou baixe o relatório personalizado.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Visualizar</TabsTrigger>
              <TabsTrigger value="raw">Texto Bruto</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <div className="bg-white p-6 rounded-md border">
                {reportPreview.split("\n\n").map((paragraph, i) => {
                  if (paragraph.startsWith("# ")) {
                    return (
                      <h1 key={i} className="text-2xl font-bold mb-4">
                        {paragraph.substring(2)}
                      </h1>
                    )
                  } else if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-xl font-semibold mt-6 mb-3">
                        {paragraph.substring(3)}
                      </h2>
                    )
                  } else {
                    return (
                      <p key={i} className="mb-4">
                        {paragraph.split("\n").map((line, j) => {
                          const boldPattern = /\*\*(.*?)\*\*/g
                          const parts = []
                          let lastIndex = 0
                          let match

                          while ((match = boldPattern.exec(line)) !== null) {
                            parts.push(line.substring(lastIndex, match.index))
                            parts.push(<strong key={`${i}-${j}-${match.index}`}>{match[1]}</strong>)
                            lastIndex = match.index + match[0].length
                          }

                          parts.push(line.substring(lastIndex))

                          return (
                            <span key={j}>
                              {parts}
                              {j < paragraph.split("\n").length - 1 && <br />}
                            </span>
                          )
                        })}
                      </p>
                    )
                  }
                })}
              </div>
            </TabsContent>
            <TabsContent value="raw" className="mt-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">{reportPreview}</pre>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={printReport} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button
              type="button"
              onClick={downloadReport}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Baixar Relatório
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
