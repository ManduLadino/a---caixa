"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppContext } from "@/contexts/app-context"
import { Loader2, CreditCard, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface CheckoutFormProps {
  planId: string
  planName: string
  amount: number
  onSuccess: () => void
  onCancel: () => void
}

export default function CheckoutForm({ planId, planName, amount, onSuccess, onCancel }: CheckoutFormProps) {
  const { upgradeSubscription } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados para os campos do formulário
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [phoneArea, setPhoneArea] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")

  // Formatar CPF
  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  // Formatar número do cartão
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d+?$)/, "$1")
  }

  // Formatar data de validade
  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2}\/\d{2})\d+?$/, "$1")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validações básicas
      if (
        !name ||
        !email ||
        !cpf ||
        !phoneArea ||
        !phoneNumber ||
        !cardNumber ||
        !cardHolder ||
        !cardExpiry ||
        !cardCvv
      ) {
        throw new Error("Todos os campos são obrigatórios")
      }

      // Formatar os dados para enviar à API
      const customerData = {
        name,
        email,
        cpf: cpf.replace(/\D/g, ""),
        phoneArea,
        phoneNumber: phoneNumber.replace(/\D/g, ""),
        cardNumber: cardNumber.replace(/\D/g, ""),
        cardHolder,
        cardExpiry,
        cardCvv,
      }

      // Chamar a API para processar o pagamento
      const response = await fetch("/api/pagbank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          customerData,
          amount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao processar pagamento")
      }

      const data = await response.json()

      // Simular processamento bem-sucedido (em produção, você redirecionaria para a URL de pagamento)
      setTimeout(() => {
        // Atualizar o status da assinatura
        upgradeSubscription(planId as "free" | "basic" | "premium")

        setIsSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }, 2000)
    } catch (error: any) {
      console.error("Erro no checkout:", error)
      setError(error.message || "Ocorreu um erro ao processar o pagamento")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block mb-4 text-green-500">
          <CheckCircle size={64} />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Pagamento Aprovado!</h2>
        <p className="mb-6">Sua assinatura do {planName} foi ativada com sucesso.</p>
        <Button onClick={onSuccess} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white">
          Continuar
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-[#ff9be2]" /> Checkout - {planName}
      </h2>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white/5 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-3">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-1">
                <Label htmlFor="phoneArea">DDD</Label>
                <Input
                  id="phoneArea"
                  value={phoneArea}
                  onChange={(e) => setPhoneArea(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  placeholder="00"
                  maxLength={2}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="phoneNumber">Telefone</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000000"
                  maxLength={9}
                  className="bg-white/10 border-white/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-3">Dados do Cartão</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="cardHolder">Nome no Cartão</Label>
              <Input
                id="cardHolder"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                placeholder="NOME COMO ESTÁ NO CARTÃO"
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="cardExpiry">Validade</Label>
              <Input
                id="cardExpiry"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                placeholder="MM/AA"
                maxLength={5}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="cardCvv">CVV</Label>
              <Input
                id="cardCvv"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="000"
                maxLength={3}
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-3">Resumo do Pedido</h3>
          <div className="flex justify-between mb-2">
            <span>Plano:</span>
            <span>{planName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Valor:</span>
            <span className="font-bold">R$ {(amount / 100).toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between">
            <span>Período:</span>
            <span>Mensal</span>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="bg-white/5 border-white/20 hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-[#8e2de2] hover:bg-[#a100f5] text-white">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
              </>
            ) : (
              "Finalizar Pagamento"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
