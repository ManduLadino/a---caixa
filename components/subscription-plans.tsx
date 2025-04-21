"use client"

import { useState } from "react"
import { HolographicCard } from "@/components/ui/holographic-card"
import { Button } from "@/components/ui/button"
import { Crown, Check, Star, Sparkles } from "lucide-react"
import { useAppContext } from "@/contexts/app-context"
import { motion } from "framer-motion"

export default function SubscriptionPlans() {
  const { subscriptionTier, upgradeSubscription } = useAppContext()
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Gratuito",
      price: "R$ 0",
      period: "para sempre",
      features: ["3 leituras por mês", "Mandala básica", "Compartilhamento básico"],
      icon: Star,
      color: "#6a1fc7",
    },
    {
      id: "basic",
      name: "Básico",
      price: "R$ 19,90",
      period: "por mês",
      features: [
        "10 leituras por mês",
        "Mandala personalizada",
        "Exportação para PDF",
        "Histórico completo",
        "Sem anúncios",
      ],
      icon: Sparkles,
      color: "#8e2de2",
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$ 39,90",
      period: "por mês",
      features: [
        "Leituras ilimitadas",
        "Mandala premium animada",
        "Geração de imagens temáticas",
        "Áudio em alta qualidade",
        "Leituras especiais exclusivas",
        "Suporte prioritário",
      ],
      icon: Crown,
      color: "#c774f0",
    },
  ]

  const handleUpgrade = async (planId: string) => {
    if (planId === subscriptionTier) return

    setIsProcessing(true)

    try {
      // Simulação de processamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Atualiza a assinatura
      upgradeSubscription(planId as "free" | "basic" | "premium")

      alert(`Parabéns! Você agora é um assinante ${planId === "premium" ? "Premium" : "Básico"} de A CAIXA.`)
    } catch (error) {
      console.error("Erro ao processar assinatura:", error)
      alert("Ocorreu um erro ao processar sua assinatura. Por favor, tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <HolographicCard className="mb-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Crown className="h-5 w-5 text-[#ff9be2]" /> Planos de Assinatura
      </h2>

      <p className="mb-6 text-center">Eleve sua experiência mística com nossos planos especiais</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const PlanIcon = plan.icon
          const isCurrentPlan = subscriptionTier === plan.id
          const isUpgrade =
            (subscriptionTier === "free" && (plan.id === "basic" || plan.id === "premium")) ||
            (subscriptionTier === "basic" && plan.id === "premium")

          return (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.03 }}
              className={`rounded-xl overflow-hidden ${
                isCurrentPlan ? "border-2 border-[#ff9be2] bg-white/10" : "border border-white/10 bg-white/5"
              }`}
            >
              <div className="p-4 text-center text-white" style={{ backgroundColor: plan.color }}>
                <PlanIcon className="h-6 w-6 mx-auto mb-2" />
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-400"> {plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-[#ff9be2]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isProcessing || isCurrentPlan || !isUpgrade}
                  className={`w-full ${
                    isCurrentPlan
                      ? "bg-[#ff9be2] hover:bg-[#ff9be2] text-white"
                      : isUpgrade
                        ? "bg-[#8e2de2] hover:bg-[#a100f5] text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isCurrentPlan
                    ? "Plano Atual"
                    : isProcessing
                      ? "Processando..."
                      : isUpgrade
                        ? "Fazer Upgrade"
                        : "Não Disponível"}
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </HolographicCard>
  )
}
