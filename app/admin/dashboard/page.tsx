"use client"

import { useState, useEffect } from "react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ChartContainer } from "@/components/dashboard/chart-container"
import { LineChart } from "@/components/dashboard/line-chart"
import { BarChart } from "@/components/dashboard/bar-chart"
import { DataTable } from "@/components/dashboard/data-table"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { apiClient } from "@/lib/api-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, AlertTriangle, Clock, Users } from "lucide-react"
import { format } from "date-fns"

export default function ApiDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      let url = "/api/admin/metrics"
      const params = new URLSearchParams()

      if (startDate) {
        params.append("startDate", startDate.toISOString())
      }

      if (endDate) {
        params.append("endDate", endDate.toISOString())
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const data = await apiClient(url)
      setMetrics(data)
      setError(null)
    } catch (err) {
      console.error("Erro ao buscar métricas:", err)
      setError("Falha ao carregar métricas. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [startDate, endDate])

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start)
    setEndDate(end)
  }

  if (loading && !metrics) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-lg">Carregando métricas...</p>
        </div>
      </div>
    )
  }

  if (error && !metrics) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold">Erro ao carregar métricas</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={fetchMetrics}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  // Preparar dados para gráficos
  const requestsChartData = {
    labels: metrics.dailyMetrics.map((d: any) => d.date),
    datasets: [
      {
        label: "Total de Requisições",
        data: metrics.dailyMetrics.map((d: any) => d.requests),
        borderColor: "#8e2de2",
        backgroundColor: "rgba(142, 45, 226, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Erros",
        data: metrics.dailyMetrics.map((d: any) => d.errors),
        borderColor: "#e11d48",
        backgroundColor: "rgba(225, 29, 72, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const responseTimeChartData = {
    labels: metrics.dailyMetrics.map((d: any) => d.date),
    datasets: [
      {
        label: "Tempo Médio de Resposta (ms)",
        data: metrics.dailyMetrics.map((d: any) => d.avgResponseTime),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const endpointChartData = {
    labels: metrics.endpointMetrics.map((e: any) => e.endpoint.replace("/api/", "")),
    datasets: [
      {
        label: "Requisições por Endpoint",
        data: metrics.endpointMetrics.map((e: any) => e.requests),
        backgroundColor: [
          "rgba(142, 45, 226, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(225, 29, 72, 0.7)",
        ],
      },
    ],
  }

  const serviceChartData = {
    labels: metrics.serviceMetrics.map((s: any) => s.serviceId),
    datasets: [
      {
        label: "Requisições por Serviço",
        data: metrics.serviceMetrics.map((s: any) => s.requests),
        backgroundColor: [
          "rgba(142, 45, 226, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(16, 185, 129, 0.7)",
        ],
      },
    ],
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard da API</h1>
          <p className="text-muted-foreground">Monitore o desempenho e uso da API da Caixa Oracle</p>
        </div>
        <DateRangePicker startDate={startDate} endDate={endDate} onRangeChange={handleDateRangeChange} />
      </div>

      {/* Cards de métricas */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Requisições"
          value={metrics.summary.totalRequests.toLocaleString()}
          icon={<Activity />}
        />
        <MetricCard
          title="Taxa de Erro"
          value={`${metrics.summary.errorRate.toFixed(2)}%`}
          icon={<AlertTriangle />}
          className={metrics.summary.errorRate > 5 ? "border-red-500" : ""}
        />
        <MetricCard
          title="Tempo Médio de Resposta"
          value={`${metrics.summary.avgResponseTime.toFixed(2)} ms`}
          icon={<Clock />}
        />
        <MetricCard title="Serviços Ativos" value={metrics.serviceMetrics.length} icon={<Users />} />
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="requests">Requisições</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer title="Requisições ao Longo do Tempo">
              <LineChart data={requestsChartData} height={300} />
            </ChartContainer>
            <ChartContainer title="Tempo de Resposta ao Longo do Tempo">
              <LineChart data={responseTimeChartData} height={300} />
            </ChartContainer>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer title="Requisições por Endpoint">
              <BarChart data={endpointChartData} height={300} />
            </ChartContainer>
            <ChartContainer title="Requisições por Serviço">
              <BarChart data={serviceChartData} height={300} />
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="endpoints">
          <DataTable
            data={metrics.endpointMetrics}
            columns={[
              {
                key: "endpoint",
                header: "Endpoint",
                sortable: true,
              },
              {
                key: "requests",
                header: "Requisições",
                sortable: true,
              },
              {
                key: "errors",
                header: "Erros",
                sortable: true,
              },
              {
                key: "errorRate",
                header: "Taxa de Erro",
                cell: (item) => `${item.errorRate.toFixed(2)}%`,
                sortable: true,
              },
              {
                key: "avgResponseTime",
                header: "Tempo Médio (ms)",
                cell: (item) => item.avgResponseTime.toFixed(2),
                sortable: true,
              },
            ]}
            searchable
            searchKeys={["endpoint"]}
            pagination
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="services">
          <DataTable
            data={metrics.serviceMetrics}
            columns={[
              {
                key: "serviceId",
                header: "Serviço",
                sortable: true,
              },
              {
                key: "requests",
                header: "Requisições",
                sortable: true,
              },
              {
                key: "errors",
                header: "Erros",
                sortable: true,
              },
              {
                key: "errorRate",
                header: "Taxa de Erro",
                cell: (item) => `${item.errorRate.toFixed(2)}%`,
                sortable: true,
              },
            ]}
            searchable
            searchKeys={["serviceId"]}
            pagination
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="requests">
          <DataTable
            data={metrics.recentRequests}
            columns={[
              {
                key: "timestamp",
                header: "Data/Hora",
                cell: (item) => format(new Date(item.timestamp), "dd/MM/yyyy HH:mm:ss"),
                sortable: true,
              },
              {
                key: "method",
                header: "Método",
                sortable: true,
              },
              {
                key: "endpoint",
                header: "Endpoint",
                sortable: true,
              },
              {
                key: "statusCode",
                header: "Status",
                cell: (item) => (
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                      item.statusCode >= 200 && item.statusCode < 300
                        ? "bg-green-100 text-green-800"
                        : item.statusCode >= 400
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.statusCode}
                  </span>
                ),
                sortable: true,
              },
              {
                key: "responseTime",
                header: "Tempo (ms)",
                cell: (item) => item.responseTime.toFixed(2),
                sortable: true,
              },
              {
                key: "serviceId",
                header: "Serviço",
                sortable: true,
              },
            ]}
            searchable
            searchKeys={["endpoint", "serviceId", "method"]}
            pagination
            pageSize={20}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
