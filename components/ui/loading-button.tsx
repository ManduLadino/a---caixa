import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function LoadingButton({
  isLoading = false,
  loadingText = "Processando...",
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button className={cn(className)} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
