// Configurações da API BBPay
export const BBPAY_API_URL = process.env.BBPAY_API_URL || "https://api.bbpay.com.br"
export const BBPAY_API_KEY = process.env.PAGBANK_TOKEN || "" // Usando a variável existente PAGBANK_TOKEN
export const BBPAY_MERCHANT_ID = process.env.BBPAY_MERCHANT_ID || ""

// Tipos de dados para a API BBPay
export interface BBPayCustomer {
  name: string
  email: string
  cpf: string
  phone: string
}

export interface BBPayAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipcode: string
}

export interface BBPayPaymentMethod {
  type: "credit_card" | "pix" | "boleto"
  installments?: number
  card?: {
    number: string
    holder: string
    expiry: string
    cvv: string
  }
}

export interface BBPayOrderItem {
  name: string
  quantity: number
  price: number
}

export interface BBPayOrderRequest {
  reference: string
  customer: BBPayCustomer
  billing_address?: BBPayAddress
  payment_method: BBPayPaymentMethod
  items: BBPayOrderItem[]
  amount: number
  currency: string
  notification_url?: string
}

export interface BBPayOrderResponse {
  id: string
  status: "pending" | "approved" | "rejected" | "canceled" | "refunded"
  payment_url?: string
  pix_qrcode?: string
  pix_code?: string
  boleto_url?: string
  boleto_barcode?: string
  created_at: string
  expires_at?: string
}

// Funções auxiliares para a API BBPay
export function getAuthHeader() {
  return {
    Authorization: `Bearer ${BBPAY_API_KEY}`,
    "Content-Type": "application/json",
    "X-Merchant-ID": BBPAY_MERCHANT_ID,
  }
}

export function formatCurrency(amount: number): number {
  // Converte centavos para reais com 2 casas decimais
  return amount / 100
}
