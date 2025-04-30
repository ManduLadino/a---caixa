import { NextResponse } from "next/server"
import { BBPAY_API_URL, getAuthHeader } from "@/lib/bbpay-config"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "ID do pedido não fornecido" }, { status: 400 })
    }

    // Tentar obter o status do pedido na API BBPay
    try {
      // Verificar se a URL da API está definida
      if (!BBPAY_API_URL) {
        throw new Error("URL da API BBPay não configurada")
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos de timeout

      const response = await fetch(`${BBPAY_API_URL}/orders/${orderId}`, {
        method: "GET",
        headers: getAuthHeader(),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro ao obter status do pedido: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error("Erro ao verificar status na API BBPay, usando resposta simulada:", error)

      // Em caso de falha na API, simular uma resposta para desenvolvimento
      if (process.env.NODE_ENV !== "production") {
        // Simular uma chance de 30% do pagamento estar aprovado
        const isApproved = Math.random() < 0.3

        return NextResponse.json({
          id: orderId,
          status: isApproved ? "approved" : "pending",
          updated_at: new Date().toISOString(),
        })
      } else {
        throw error // Em produção, propagar o erro
      }
    }
  } catch (error: any) {
    console.error("Erro ao verificar status do pagamento:", error)
    return NextResponse.json({ error: error.message || "Erro ao verificar status do pagamento" }, { status: 500 })
  }
}
