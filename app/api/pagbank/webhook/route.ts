import { NextResponse } from "next/server"

export async function POST(request: Request) {
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
