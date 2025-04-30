import { NextResponse } from "next/server"
import { BBPAY_API_URL, getAuthHeader, type BBPayOrderRequest, type BBPayOrderResponse } from "@/lib/bbpay-config"
import { API_KEYS } from "@/lib/api-config"

// Simulação de resposta para ambiente de desenvolvimento
const MOCK_RESPONSES = {
  CREDIT_CARD: {
    id: "order_" + Date.now(),
    status: "approved",
    payment_url: "https://example.com/payment",
    created_at: new Date().toISOString(),
  },
  PIX: {
    id: "order_" + Date.now(),
    status: "pending",
    pix_qrcode: "https://placeholder.svg?height=200&width=200&query=QR%20Code%20PIX",
    pix_code:
      "00020101021226880014br.gov.bcb.pix2566qrcodes-pix.correiobraziliense.com.br/v2/5204000053039865802BR5925EMPRESA%20SIMULADA%20LTDA6008BRASILIA62070503***6304E2CA",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hora
  },
  BOLETO: {
    id: "order_" + Date.now(),
    status: "pending",
    boleto_url: "https://example.com/boleto",
    boleto_barcode: "23793.38128 60007.827136 95000.063305 9 84660000370000",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 259200000).toISOString(), // 3 dias
  },
}

export async function POST(request: Request) {
  // Verificar a chave de API
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "") || ""

  // Se a chave de API for fornecida mas for inválida, retornar erro
  if (apiKey && !apiKey.includes(API_KEYS.MAIN_API_KEY)) {
    return NextResponse.json({ error: "Chave de API inválida" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { planId, customerData, amount, paymentMethod } = body

    if (!planId || !customerData || !amount) {
      return NextResponse.json({ error: "Dados incompletos para o processamento do pagamento" }, { status: 400 })
    }

    // Formatar os dados para a API BBPay
    const orderData: BBPayOrderRequest = {
      reference: `plano-${planId}-${Date.now()}`,
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: customerData.cpf.replace(/\D/g, ""),
        phone: `${customerData.phoneArea}${customerData.phoneNumber.replace(/\D/g, "")}`,
      },
      payment_method: {
        type: mapPaymentMethod(paymentMethod),
        installments: customerData.installments || 1,
      },
      items: [
        {
          name: getPlanName(planId),
          quantity: 1,
          price: amount / 100, // Converter de centavos para reais
        },
      ],
      amount: amount / 100, // Converter de centavos para reais
      currency: "BRL",
      notification_url: `${API_KEYS.NEXT_PUBLIC_BASE_URL}/api/bbpay/webhook`,
    }

    // Adicionar dados específicos por método de pagamento
    if (paymentMethod === "CREDIT_CARD" && customerData.cardNumber) {
      orderData.payment_method.card = {
        number: customerData.cardNumber.replace(/\D/g, ""),
        holder: customerData.cardHolder,
        expiry: customerData.cardExpiry.replace(/\D/g, ""),
        cvv: customerData.cardCvv,
      }
    }

    // Adicionar endereço para boleto se fornecido
    if (paymentMethod === "BOLETO" && customerData.address) {
      orderData.billing_address = {
        street: customerData.address.street,
        number: customerData.address.number || "S/N",
        neighborhood: customerData.address.locality || "Centro",
        city: customerData.address.city,
        state: customerData.address.region || "SP",
        zipcode: customerData.address.postalCode.replace(/\D/g, ""),
      }
    }

    // Tentar criar o pedido na API BBPay
    let order: BBPayOrderResponse
    try {
      order = await createOrder(orderData)
    } catch (error) {
      console.error("Erro ao conectar com a API BBPay, usando resposta simulada:", error)

      // Em caso de falha na API, usar resposta simulada para desenvolvimento
      if (process.env.NODE_ENV !== "production") {
        order = MOCK_RESPONSES[paymentMethod] as BBPayOrderResponse
      } else {
        throw error // Em produção, propagar o erro
      }
    }

    // Formatar a resposta com base no método de pagamento
    const response: any = {
      success: true,
      orderId: order.id,
      status: order.status,
    }

    if (paymentMethod === "PIX" && order.pix_qrcode) {
      response.qrCodeImage = order.pix_qrcode
      response.qrCodeText = order.pix_code
      response.expirationDate = order.expires_at
    } else if (paymentMethod === "BOLETO" && order.boleto_url) {
      response.boletoUrl = order.boleto_url
      response.barCode = order.boleto_barcode
      response.dueDate = order.expires_at
    } else if (paymentMethod === "CREDIT_CARD") {
      response.paymentUrl = order.payment_url
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Erro ao processar pagamento BBPay:", error)
    return NextResponse.json(
      { error: error.message || "Erro ao processar pagamento. Por favor, tente novamente." },
      { status: 500 },
    )
  }
}

// Função para criar um pedido na API BBPay
async function createOrder(data: BBPayOrderRequest): Promise<BBPayOrderResponse> {
  try {
    // Verificar se a URL da API está definida
    if (!BBPAY_API_URL) {
      throw new Error("URL da API BBPay não configurada")
    }

    // Verificar se temos as credenciais necessárias
    const headers = getAuthHeader()
    if (!headers.Authorization.includes("Bearer ") || headers.Authorization === "Bearer ") {
      throw new Error("Token de API BBPay não configurado")
    }

    // Adicionar timeout para evitar que a requisição fique pendente por muito tempo
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

    const response = await fetch(`${BBPAY_API_URL}/orders`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      signal: controller.signal,
    })

    clearTimeout(timeoutId) // Limpar o timeout se a requisição completar

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta da BBPay:", errorText)
      throw new Error(`Erro ao criar pedido: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    // Melhorar a mensagem de erro para problemas de conexão
    if (error.name === "AbortError") {
      throw new Error("Timeout ao conectar com a API BBPay")
    } else if (error.message.includes("fetch failed")) {
      throw new Error("Não foi possível conectar à API BBPay. Verifique sua conexão ou as configurações da API.")
    }

    console.error("Erro ao criar pedido na BBPay:", error)
    throw error
  }
}

// Função para mapear os métodos de pagamento para o formato da BBPay
function mapPaymentMethod(method: string): "credit_card" | "pix" | "boleto" {
  switch (method) {
    case "CREDIT_CARD":
      return "credit_card"
    case "PIX":
      return "pix"
    case "BOLETO":
      return "boleto"
    default:
      return "credit_card"
  }
}

// Função para obter o nome do plano
function getPlanName(planId: string): string {
  switch (planId) {
    case "basic":
      return "Plano Básico"
    case "premium":
      return "Plano Premium"
    default:
      return "Plano Gratuito"
  }
}

// Rota para webhook da BBPay
export async function GET(request: Request) {
  // Esta rota será usada pela BBPay para notificações
  return NextResponse.json({ success: true })
}
