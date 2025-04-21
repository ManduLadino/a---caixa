import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Interface para os dados de métricas
export interface ApiMetric {
  id: string
  timestamp: string
  endpoint: string
  method: string
  statusCode: number
  responseTime: number
  apiKey: string
  serviceId: string
  userAgent: string
  ipAddress: string
  errorMessage?: string
}

// Armazenamento temporário de métricas (em produção, use um banco de dados)
let apiMetrics: ApiMetric[] = []

// Função para salvar métricas
export function saveMetric(metric: ApiMetric) {
  // Em produção, salve no banco de dados
  apiMetrics.push(metric)

  // Mantenha apenas os últimos 1000 registros em memória
  if (apiMetrics.length > 1000) {
    apiMetrics = apiMetrics.slice(-1000)
  }
}

// Função para obter métricas
export function getMetrics(filters: Partial<ApiMetric> = {}) {
  // Filtra as métricas com base nos filtros fornecidos
  return apiMetrics.filter((metric) => {
    return Object.entries(filters).every(([key, value]) => {
      return metric[key as keyof ApiMetric] === value
    })
  })
}

// Middleware para registrar métricas de API
export function apiMetricsMiddleware(req: NextRequest) {
  // Verifica se a requisição é para a API
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  // Extrai informações da requisição
  const endpoint = req.nextUrl.pathname
  const method = req.method
  const apiKey = req.headers.get("authorization")?.replace("Bearer ", "") || "anonymous"
  const serviceId = req.headers.get("x-service-id") || "unknown"
  const userAgent = req.headers.get("user-agent") || "unknown"
  const ipAddress = req.headers.get("x-forwarded-for") || req.ip || "unknown"

  // Processa a requisição
  const response = NextResponse.next()

  // Registra a métrica após a resposta
  response.headers.set("X-Request-ID", requestId)

  // Em um ambiente real, você usaria um evento ou hook para capturar o final da requisição
  // Aqui estamos simulando isso com um valor aproximado
  const responseTime = Date.now() - startTime
  const statusCode = response.status

  // Salva a métrica
  saveMetric({
    id: requestId,
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    statusCode,
    responseTime,
    apiKey,
    serviceId,
    userAgent,
    ipAddress,
    errorMessage: statusCode >= 400 ? "Erro na requisição" : undefined,
  })

  return response
}

// Função para gerar métricas de exemplo para demonstração
export function generateSampleMetrics(count = 100) {
  const endpoints = [
    "/api/protected",
    "/api/analyze-stones",
    "/api/generate-mandala",
    "/api/pagbank",
    "/api/generate-audio",
  ]
  const methods = ["GET", "POST", "PUT", "DELETE"]
  const statusCodes = [200, 200, 200, 200, 400, 401, 403, 404, 500]
  const serviceIds = ["ibnergra", "partner1", "partner2", "unknown"]

  const now = Date.now()
  const dayInMs = 24 * 60 * 60 * 1000

  for (let i = 0; i < count; i++) {
    const isError = Math.random() > 0.8
    const statusCode = isError ? statusCodes[Math.floor(Math.random() * statusCodes.length)] : 200
    const timestamp = new Date(now - Math.random() * 30 * dayInMs).toISOString()
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
    const method = methods[Math.floor(Math.random() * methods.length)]
    const responseTime = Math.floor(Math.random() * 500) + 20 // 20-520ms
    const serviceId = serviceIds[Math.floor(Math.random() * serviceIds.length)]

    saveMetric({
      id: crypto.randomUUID(),
      timestamp,
      endpoint,
      method,
      statusCode,
      responseTime,
      apiKey: "c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",
      serviceId,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      errorMessage: isError ? "Erro simulado para demonstração" : undefined,
    })
  }
}

// Gera dados de exemplo para o dashboard
generateSampleMetrics(500)
