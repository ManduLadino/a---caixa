import { NextResponse } from "next/server"
import { isValidApiKey } from "@/lib/api-config"

export async function POST(request: Request) {
  // Verificar a chave de API se fornecida
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "") || ""

  // Se a chave de API for fornecida mas for inválida, retornar erro
  if (apiKey && !isValidApiKey(apiKey)) {
    return NextResponse.json({ error: "Chave de API inválida" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Aqui você processaria a notificação do PagBank
    // Verificando o status do pagamento e atualizando o status da assinatura no seu banco de dados

    console.log("Notificação do PagBank recebida:", body)

    // Exemplo de processamento:
    if (body.charges && body.charges[0]) {
      const charge = body.charges[0]
      const status = charge.status
      const referenceId = body.reference_id

      // Extrair o ID do plano do reference_id
      const planIdMatch = referenceId.match(/plano-(.*)-\d+/)
      const planId = planIdMatch ? planIdMatch[1] : null

      if (planId && status === "PAID") {
        // Atualizar o status da assinatura no banco de dados
        // Exemplo: await updateSubscriptionStatus(planId, 'active')
        console.log(`Assinatura do plano ${planId} ativada com sucesso!`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar webhook do PagBank:", error)
    return NextResponse.json({ error: "Erro ao processar notificação" }, { status: 500 })
  }
}
