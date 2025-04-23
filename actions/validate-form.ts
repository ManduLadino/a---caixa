"use server"

import * as z from "zod"
import { validateCPF } from "@/utils/validation"

// Schema for patient record validation
export const pacienteServerSchema = z.object({
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

// Schema for the main form validation
export const cadastroServerSchema = z.object({
  dataPreenchimento: z.string().refine(
    (dateStr) => {
      const date = new Date(dateStr)
      return !isNaN(date.getTime()) && date <= new Date()
    },
    {
      message: "A data de preenchimento é inválida ou está no futuro.",
    },
  ),
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
  dataNascimentoPaciente: z.string().refine(
    (dateStr) => {
      const date = new Date(dateStr)
      return !isNaN(date.getTime()) && date <= new Date()
    },
    {
      message: "A data de nascimento é inválida ou está no futuro.",
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
        return validateCPF(cpfClean)
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
        return validateCPF(cpfClean)
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
  observacoes: z.string().optional(),
})

// Type for validation response
export type ValidationResponse = {
  success: boolean
  errors?: Record<string, string[]>
  message?: string
}

// Server action to validate paciente data
export async function validatePacienteData(data: unknown): Promise<ValidationResponse> {
  try {
    // Validate the data against the schema
    pacienteServerSchema.parse(data)

    // If validation passes, return success
    return {
      success: true,
      message: "Dados validados com sucesso",
    }
  } catch (error) {
    // If validation fails, format the errors
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}

      error.errors.forEach((err) => {
        const field = err.path[0] as string
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(err.message)
      })

      return {
        success: false,
        errors,
      }
    }

    // For other errors, return a generic error message
    return {
      success: false,
      message: "Ocorreu um erro ao validar os dados",
    }
  }
}

// Server action to validate cadastro form data
export async function validateCadastroData(data: unknown): Promise<ValidationResponse> {
  try {
    // Validate the data against the schema
    cadastroServerSchema.parse(data)

    // Additional validation logic can be added here
    // For example, checking if the CPF exists in a database

    // If validation passes, return success
    return {
      success: true,
      message: "Dados validados com sucesso",
    }
  } catch (error) {
    // If validation fails, format the errors
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}

      error.errors.forEach((err) => {
        const field = err.path[0] as string
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(err.message)
      })

      return {
        success: false,
        errors,
      }
    }

    // For other errors, return a generic error message
    return {
      success: false,
      message: "Ocorreu um erro ao validar os dados",
    }
  }
}

// Server action to validate required file uploads
export async function validateRequiredFiles(fileUploads: Record<string, number>): Promise<ValidationResponse> {
  const requiredUploads = [
    { key: "laudoMedico", label: "Laudo Médico" },
    { key: "exames", label: "Exames" },
    { key: "agendamentos", label: "Agendamentos" },
    { key: "documentosPaciente", label: "Documentos do Paciente" },
    { key: "documentosResponsavel", label: "Documentos do Responsável" },
    { key: "comprovanteResidencia", label: "Comprovante de Residência" },
    { key: "extratosBancarios", label: "Extratos Bancários" },
  ]

  const missingUploads = requiredUploads.filter((item) => !fileUploads[item.key] || fileUploads[item.key] === 0)

  if (missingUploads.length > 0) {
    const errors: Record<string, string[]> = {}

    missingUploads.forEach((item) => {
      errors[item.key] = [`O documento "${item.label}" é obrigatório`]
    })

    return {
      success: false,
      errors,
      message: "Documentos obrigatórios faltando",
    }
  }

  return {
    success: true,
    message: "Todos os documentos obrigatórios foram enviados",
  }
}

// Server action to submit the form data
export async function submitFormData(
  formData: unknown,
  fileUploads: Record<string, number>,
): Promise<ValidationResponse> {
  try {
    // First validate the form data
    const formValidation = await validateCadastroData(formData)
    if (!formValidation.success) {
      return formValidation
    }

    // Then validate the file uploads
    const fileValidation = await validateRequiredFiles(fileUploads)
    if (!fileValidation.success) {
      return fileValidation
    }

    // If all validations pass, process the form submission
    // Here you would typically save the data to a database

    // For demonstration purposes, we'll just return success
    return {
      success: true,
      message: "Formulário enviado com sucesso!",
    }
  } catch (error) {
    console.error("Error submitting form:", error)

    return {
      success: false,
      message: "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.",
    }
  }
}

// Server action to submit paciente data
export async function submitPacienteData(data: unknown): Promise<ValidationResponse> {
  try {
    // Validate the data
    const validation = await validatePacienteData(data)
    if (!validation.success) {
      return validation
    }

    // Process the data (e.g., save to database)

    return {
      success: true,
      message: "Dados do paciente salvos com sucesso!",
    }
  } catch (error) {
    console.error("Error submitting paciente data:", error)

    return {
      success: false,
      message: "Ocorreu um erro ao salvar os dados do paciente. Por favor, tente novamente.",
    }
  }
}

// Server action to submit multiple pacientes
export async function submitPacientesData(data: unknown[]): Promise<ValidationResponse> {
  try {
    // Validate each paciente
    const validationPromises = data.map(validatePacienteData)
    const validationResults = await Promise.all(validationPromises)

    // Check if any validation failed
    const failedValidations = validationResults.filter((result) => !result.success)
    if (failedValidations.length > 0) {
      return {
        success: false,
        message: `${failedValidations.length} paciente(s) com dados inválidos`,
      }
    }

    // Process the data (e.g., save to database)

    return {
      success: true,
      message: `${data.length} paciente(s) salvos com sucesso!`,
    }
  } catch (error) {
    console.error("Error submitting pacientes data:", error)

    return {
      success: false,
      message: "Ocorreu um erro ao salvar os dados dos pacientes. Por favor, tente novamente.",
    }
  }
}
