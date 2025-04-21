import { NextResponse } from "next/server"
import { getMetrics } from "@/middleware/api-metrics"
import { isValidApiKey } from "@/lib/api-config"

export async function GET(request: Request) {
  // Verificar autenticação
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "") || ""

  if (!isValidApiKey(apiKey)) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 })
  }

  // Obter parâmetros de consulta
  const url = new URL(request.url)
  const endpoint = url.searchParams.get("endpoint")
  const method = url.searchParams.get("method")
  const startDate = url.searchParams.get("startDate")
  const endDate = url.searchParams.get("endDate")
  const serviceId = url.searchParams.get("serviceId")

  // Construir filtros
  const filters: any = {}
  if (endpoint) filters.endpoint = endpoint
  if (method) filters.method = method
  if (serviceId) filters.serviceId = serviceId

  // Filtrar por data
  let metrics = getMetrics(filters)

  if (startDate) {
    const startTimestamp = new Date(startDate).toISOString()
    metrics = metrics.filter((m) => m.timestamp >= startTimestamp)
  }

  if (endDate) {
    const endTimestamp = new Date(endDate).toISOString()
    metrics = metrics.filter((m) => m.timestamp <= endTimestamp)
  }

  // Calcular estatísticas
  const totalRequests = metrics.length
  const successRequests = metrics.filter((m) => m.statusCode >= 200 && m.statusCode < 300).length
  const errorRequests = metrics.filter((m) => m.statusCode >= 400).length
  const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / (totalRequests || 1)

  // Agrupar por endpoint
  const endpointStats = metrics.reduce((acc: any, m) => {
    acc[m.endpoint] = acc[m.endpoint] || { count: 0, errors: 0, totalTime: 0 }
    acc[m.endpoint].count++
    if (m.statusCode >= 400) acc[m.endpoint].errors++
    acc[m.endpoint].totalTime += m.responseTime
    return acc
  }, {})

  // Calcular estatísticas por endpoint
  const endpointMetrics = Object.entries(endpointStats).map(([endpoint, stats]: [string, any]) => ({
    endpoint,
    requests: stats.count,
    errors: stats.errors,
    avgResponseTime: stats.totalTime / stats.count,
    errorRate: (stats.errors / stats.count) * 100,
  }))

  // Agrupar por dia para gráficos de tendência
  const dailyStats = metrics.reduce((acc: any, m) => {
    const date = m.timestamp.split("T")[0]
    acc[date] = acc[date] || { count: 0, errors: 0, totalTime: 0 }
    acc[date].count++
    if (m.statusCode >= 400) acc[date].errors++
    acc[date].totalTime += m.responseTime
    return acc
  }, {})

  // Formatar dados diários para gráficos
  const dailyMetrics = Object.entries(dailyStats)
    .map(([date, stats]: [string, any]) => ({
      date,
      requests: stats.count,
      errors: stats.errors,
      avgResponseTime: stats.totalTime / stats.count,
      errorRate: (stats.errors / stats.count) * 100,
    }))
    .sort((a: any, b: any) => a.date.localeCompare(b.date))

  // Agrupar por serviço
  const serviceStats = metrics.reduce((acc: any, m) => {
    acc[m.serviceId] = acc[m.serviceId] || { count: 0, errors: 0 }
    acc[m.serviceId].count++
    if (m.statusCode >= 400) acc[m.serviceId].errors++
    return acc
  }, {})

  // Formatar estatísticas por serviço
  const serviceMetrics = Object.entries(serviceStats).map(([serviceId, stats]: [string, any]) => ({
    serviceId,
    requests: stats.count,
    errors: stats.errors,
    errorRate: (stats.errors / stats.count) * 100,
  }))

  // Retornar dados
  return NextResponse.json({
    summary: {
      totalRequests,
      successRequests,
      errorRequests,
      errorRate: (errorRequests / totalRequests) * 100,
      avgResponseTime,
    },
    endpointMetrics,
    dailyMetrics,
    serviceMetrics,
    recentRequests: metrics.slice(-20).reverse(), // Últimas 20 requisições
  })
}
