import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ChartContainer({ title, description, children, className }: ChartContainerProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}
