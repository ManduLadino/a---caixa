import type { UseFormReturn } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import type { ValidationResponse } from "@/actions/validate-form"

/**
 * Handles server validation errors by setting form errors and showing a toast
 * @param form The form instance from useForm
 * @param response The validation response from the server
 * @returns true if validation was successful, false otherwise
 */
export function handleServerValidationErrors(form: UseFormReturn<any>, response: ValidationResponse): boolean {
  if (!response.success) {
    // If there are field-specific errors, update the form with those errors
    if (response.errors) {
      Object.entries(response.errors).forEach(([field, messages]) => {
        form.setError(field as any, {
          type: "server",
          message: messages[0], // Use the first error message
        })
      })
    }

    // Show error toast
    toast({
      variant: "destructive",
      title: "Erro no formulário",
      description: response.message || "Verifique os campos destacados e tente novamente.",
    })
    return false
  }
  return true
}

/**
 * Formats file upload data for server validation
 * @param fileUploads Object containing file arrays
 * @returns Object with file counts
 */
export function formatFileUploadsForValidation(fileUploads: Record<string, File[]>): Record<string, number> {
  const fileUploadCounts: Record<string, number> = {}
  Object.keys(fileUploads).forEach((key) => {
    fileUploadCounts[key] = fileUploads[key].length
  })
  return fileUploadCounts
}

/**
 * Prepares form data for server validation by converting Date objects to ISO strings
 * @param values Form values
 * @returns Form values with dates converted to strings
 */
export function prepareFormDataForServer(values: any): any {
  const formDataForServer = { ...values }

  // Convert Date objects to ISO strings
  Object.entries(values).forEach(([key, value]) => {
    if (value instanceof Date) {
      formDataForServer[key] = value.toISOString()
    }
  })

  return formDataForServer
}
