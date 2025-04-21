"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/contexts/app-context"
import { Crown, Calendar, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export default function SubscriptionDetails() {
  const { subscriptionTier, upgradeSubscription } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)

  // Simula a data de expiração da assinatura (30 dias a partir de hoje)
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 30)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getPlanName = () => {
    switch (subscriptionTier) {
      case "premium":
        return "Premium"
      case "basic":
        return "Básico"
      default:
        return "Gratuito"
    }
  }

  const handleCancelSubscription = async () => {
    if (
      confirm(
        "Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium no final do período atual.",
      )
    ) {
      setIsLoading(true)

      try {
        // Simula uma chamada à API para cancelar a assinatura
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Atualiza o status da assinatura para gratuito
        upgradeSubscription("free")

        alert(
          "Sua assinatura foi cancelada com sucesso. Você terá acesso aos recursos premium até o final do período atual.",
        )
      } catch (error) {
        console.error("Erro ao cancelar assinatura:", error)
        alert("Ocorreu um erro ao cancelar sua assinatura. Por favor, tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Crown className="h-5 w-5 text-[#ff9be2]" /> Detalhes da Assinatura
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Plano atual:</span>
          <span className="font-bold">{getPlanName()}</span>
        </div>

        {subscriptionTier !== "free" && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Próxima cobrança:</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {formatDate(expirationDate)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Valor:</span>
              <span className="font-bold">{subscriptionTier === "premium" ? "R$ 39,90" : "R$ 19,90"}</span>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleCancelSubscription}
                disabled={isLoading || subscriptionTier === "free"}
                variant="outline"
                className="w-full bg-white/5 border-white/20 hover:bg-white/10 flex items-center gap-2"
              >
                {isLoading ? (
                  "Processando..."
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-400" /> Cancelar Assinatura
                  </>
                )}
              </Button>
            </div>

            {subscriptionTier === "free" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-sm text-gray-400"
              >
                Você está no plano gratuito. Faça upgrade para acessar mais recursos!
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
