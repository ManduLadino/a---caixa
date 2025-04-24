"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { cn } from "@/lib/utils"

// Registrar componentes do Chart.js
Chart.register(...registerables)

interface BarChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
    }[]
  }
  options?: any
  className?: string
  height?: number
}

export function BarChart({ data, options = {}, className, height = 300 }: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destruir gráfico existente
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Criar novo gráfico
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                boxWidth: 6,
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
          },
          ...options,
        },
      })
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, options])

  return (
    <div className={cn("w-full", className)} style={{ height: `${height}px` }}>
      <canvas ref={chartRef} />
    </div>
  )
}
