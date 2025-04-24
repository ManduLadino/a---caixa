import { NextResponse } from "next/server"
import { API_KEYS, getAuthHeader } from "@/lib/api-config"

// Configurações do PagBank
const PAGBANK_API_URL =
  process.env.NODE_ENV === "production" ? "https://api.pagseguro.com" : "https://sandbox.api.pagseguro.com"

const PAGBANK_TOKEN = API_KEYS.PAGBANK_TOKEN

// Função para criar um pedido no PagBank
async function createOrder(data: any) {
  try {
    const response = await fetch(`${PAGBANK_API_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAGBANK_TOKEN}`,
        "Content-Type": "application/json",
        "x-api-version": "4.0",
        ...getAuthHeader(), // Adiciona os cabeçalhos de autenticação
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta do PagBank:", errorText)
      throw new Error(`Erro ao criar pedido: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar pedido no PagBank:", error)
    throw error
  }
}

// Resto do código permanece o mesmo...
export async function POST(request: Request) {
  // Verificar a chave de API
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "") || ""

  // Se a chave de API for fornecida mas for inválida, retornar erro
  if (apiKey && !apiKey.includes(API_KEYS.MAIN_API_KEY)) {
    return NextResponse.json({ error: "Chave de API inválida" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { planId, customerData, amount } = body

    if (!planId || !customerData || !amount) {
      return NextResponse.json({ error: "Dados incompletos para o processamento do pagamento" }, { status: 400 })
    }

    // Formata os dados para o PagBank
    const orderData = {
      reference_id: `plano-${planId}-${Date.now()}`,
      customer: {
        name: customerData.name,
        email: customerData.email,
        tax_id: customerData.cpf, // CPF do cliente
        phones: [
          {
            country: "55", // Brasil
            area: customerData.phoneArea,
            number: customerData.phoneNumber,
            type: "MOBILE",
          },
        ],
      },
      items: [
        {
          reference_id: `plano-${planId}`,
          name: getPlanName(planId),
          quantity: 1,
          unit_amount: amount,
        },
      ],
      qr_codes: [
        {
          amount: {
            value: amount,
          },
          expiration_date: getExpirationDate(),
          payment_method: {
            type: "CREDIT_CARD",
            installments: 1,
            capture: true,
          },
        },
      ],
      notification_urls: [`${API_KEYS.BASE_URL}/api/pagbank/webhook`],
      charges: [
        {
          reference_id: `charge-${Date.now()}`,
          description: `Assinatura do plano ${getPlanName(planId)}`,
          amount: {
            value: amount,
            currency: "BRL",
          },
          payment_method: {
            type: "CREDIT_CARD",
            installments: 1,
            capture: true,
            card: {
              security_code: customerData.cardCvv,
              holder: {
                name: customerData.cardHolder,
              },
              store: false,
            },
          },
        },
      ],
    }

    // Cria o pedido no PagBank
    const order = await createOrder(orderData)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: order.links.find((link: any) => link.rel === "PAY")?.href || null,
    })
  } catch (error) {
    console.error("Erro ao processar pagamento:", error)
    return NextResponse.json({ error: "Erro ao processar pagamento. Por favor, tente novamente." }, { status: 500 })
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

// Função para obter a data de expiração (30 dias a partir de hoje)
function getExpirationDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString()
}

// Rota para webhook do PagBank
export async function GET(request: Request) {
  // Esta rota será usada pelo PagBank para notificações
  return NextResponse.json({ success: true })
}
