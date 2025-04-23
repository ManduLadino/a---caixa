/**
 * Validates a CPF number
 * @param cpf CPF to validate
 * @returns true if CPF is valid, false otherwise
 */
export function validateCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cpfClean = cpf.replace(/[^\d]/g, "")

  // Check if it has 11 digits
  if (cpfClean.length !== 11) return false

  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cpfClean)) return false

  // Validate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cpfClean.charAt(i)) * (10 - i)
  }
  let remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cpfClean.charAt(9))) return false

  // Validate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cpfClean.charAt(i)) * (11 - i)
  }
  remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cpfClean.charAt(10))) return false

  return true
}

/**
 * Formats a CPF number
 * @param cpf CPF to format
 * @returns Formatted CPF (000.000.000-00)
 */
export function formatCPF(cpf: string): string {
  const cpfClean = cpf.replace(/[^\d]/g, "")
  if (cpfClean.length <= 3) return cpfClean
  if (cpfClean.length <= 6) return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3)}`
  if (cpfClean.length <= 9) return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3, 6)}.${cpfClean.slice(6)}`
  return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3, 6)}.${cpfClean.slice(6, 9)}-${cpfClean.slice(9, 11)}`
}

/**
 * Formats a CEP (Brazilian postal code)
 * @param cep CEP to format
 * @returns Formatted CEP (00000-000)
 */
export function formatCEP(cep: string): string {
  const cepClean = cep.replace(/[^\d]/g, "")
  if (cepClean.length <= 5) return cepClean
  return `${cepClean.slice(0, 5)}-${cepClean.slice(5, 8)}`
}

/**
 * Formats a phone number
 * @param phone Phone number to format
 * @returns Formatted phone number ((00) 00000-0000)
 */
export function formatPhone(phone: string): string {
  const phoneClean = phone.replace(/[^\d]/g, "")
  if (phoneClean.length <= 2) return phoneClean
  if (phoneClean.length <= 6) return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2)}`
  if (phoneClean.length <= 10) return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2, 6)}-${phoneClean.slice(6)}`
  return `(${phoneClean.slice(0, 2)}) ${phoneClean.slice(2, 7)}-${phoneClean.slice(7, 11)}`
}

/**
 * Validates an email address
 * @param email Email to validate
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a date to ensure it's not in the future
 * @param date Date to validate
 * @returns true if date is valid and not in the future, false otherwise
 */
export function validateDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date <= today
}

/**
 * Validates a name (only letters and spaces)
 * @param name Name to validate
 * @returns true if name is valid, false otherwise
 */
export function validateName(name: string): boolean {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)
}
