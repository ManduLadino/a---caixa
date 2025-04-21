import { NextResponse } from "next/server"
import { isValidApiKey, API_KEYS } from "@/lib/api-config"

export async function GET(request: Request) {
  // Extrair a chave de API do cabeçalho de autorização
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "") || ""
  const serviceId = request.headers.get("x-service-id") || ""

  // Verificar se a chave de API e o ID do serviço são válidos
  if (!isValidApiKey(apiKey) || serviceId !== API_KEYS.SERVICE_ID) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 })
  }

  // Se a autenticação for bem-sucedida, retornar dados protegidos
  return NextResponse.json({
    success: true,
    message: "Acesso autorizado à API protegida",
    timestamp: new Date().toISOString(),
    serviceId: API_KEYS.SERVICE_ID,
  })
}

export async function POST(request: Request) {
  // Extrair a chave de API do cabeçalho de autorização
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "") || ""
  const serviceId = request.headers.get("x-service-id") || ""

  // Verificar se a chave de API e o ID do serviço são válidos
  if (!isValidApiKey(apiKey) || serviceId !== API_KEYS.SERVICE_ID) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Processar os dados recebidos
    return NextResponse.json({
      success: true,
      message: "Dados recebidos com sucesso",
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar a requisição" }, { status: 400 })
  }
}
