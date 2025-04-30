"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppContext } from "@/contexts/app-context"
import { Loader2, CreditCard, CheckCircle, QrCode, FileText, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

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
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "PIX" | "BOLETO">("CREDIT_CARD")
  const [paymentResponse, setPaymentResponse] = useState<any>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

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
  const [installments, setInstallments] = useState(1)

  // Estados para endereço (necessário para boleto)
  const [address, setAddress] = useState({
    street: "",
    number: "",
    locality: "",
    city: "",
    region: "",
    regionCode: "",
    postalCode: "",
  })

  // Verificar conexão com a internet
  useEffect(() => {
    const checkConnection = () => {
      setIsOfflineMode(!navigator.onLine)
    }

    window.addEventListener("online", checkConnection)
    window.addEventListener("offline", checkConnection)
    checkConnection()

    return () => {
      window.removeEventListener("online", checkConnection)
      window.removeEventListener("offline", checkConnection)
    }
  }, [])

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

  // Formatar CEP
  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validações básicas
      if (!name || !email || !cpf || !phoneArea || !phoneNumber) {
        throw new Error("Todos os campos pessoais são obrigatórios")
      }

      // Validações específicas por método de pagamento
      if (paymentMethod === "CREDIT_CARD" && (!cardNumber || !cardHolder || !cardExpiry || !cardCvv)) {
        throw new Error("Todos os campos do cartão são obrigatórios")
      }

      if (paymentMethod === "BOLETO" && (!address.street || !address.city || !address.postalCode)) {
        throw new Error("Endereço completo é obrigatório para pagamento com boleto")
      }

      // Formatar os dados para enviar à API
      const customerData: any = {
        name,
        email,
        cpf: cpf.replace(/\D/g, ""),
        phoneArea,
        phoneNumber: phoneNumber.replace(/\D/g, ""),
      }

      // Adicionar dados específicos por método de pagamento
      if (paymentMethod === "CREDIT_CARD") {
        customerData.cardNumber = cardNumber.replace(/\D/g, "")
        customerData.cardHolder = cardHolder
        customerData.cardExpiry = cardExpiry
        customerData.cardCvv = cardCvv
        customerData.installments = installments
      } else if (paymentMethod === "BOLETO") {
        customerData.address = address
      }

      // Se estiver no modo offline ou em desenvolvimento, simular o pagamento
      if (isOfflineMode || process.env.NODE_ENV === "development") {
        console.log("Modo offline ou desenvolvimento, simulando pagamento")

        // Simular uma resposta de pagamento
        const mockResponse = {
          success: true,
          orderId: `order_${Date.now()}`,
          status: paymentMethod === "CREDIT_CARD" ? "approved" : "pending",
        }

        if (paymentMethod === "PIX") {
          mockResponse.qrCodeImage = "https://placeholder.svg?height=200&width=200&query=QR%20Code%20PIX"
          mockResponse.qrCodeText =
            "00020101021226880014br.gov.bcb.pix2566qrcodes-pix.correiobraziliense.com.br/v2/5204000053039865802BR5925EMPRESA%20SIMULADA%20LTDA6008BRASILIA62070503***6304E2CA"
          mockResponse.expirationDate = new Date(Date.now() + 3600000).toISOString() // 1 hora
        } else if (paymentMethod === "BOLETO") {
          mockResponse.boletoUrl = "https://example.com/boleto"
          mockResponse.barCode = "23793.38128 60007.827136 95000.063305 9 84660000370000"
          mockResponse.dueDate = new Date(Date.now() + 259200000).toISOString() // 3 dias
        }

        setPaymentResponse(mockResponse)

        // Para cartão de crédito, aprovar imediatamente
        if (paymentMethod === "CREDIT_CARD") {
          upgradeSubscription(planId as "free" | "basic" | "premium")
          setIsSuccess(true)
          setTimeout(() => {
            onSuccess()
          }, 2000)
        } else {
          setIsLoading(false)
        }

        return
      }

      // Chamar a API para processar o pagamento
      const response = await fetch("/api/bbpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          customerData,
          amount,
          paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao processar pagamento")
      }

      const data = await response.json()
      setPaymentResponse(data)

      // Para cartão de crédito, podemos considerar aprovado imediatamente (em ambiente de teste)
      if (paymentMethod === "CREDIT_CARD" && data.status === "approved") {
        // Atualizar o status da assinatura
        upgradeSubscription(planId as "free" | "basic" | "premium")

        setIsSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
      // Para PIX e Boleto, mostramos as instruções de pagamento
      else {
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error("Erro no checkout:", error)
      setError(error.message || "Ocorreu um erro ao processar o pagamento")
      setIsLoading(false)
    }
  }

  // Verificar status do pagamento PIX
  const checkPixPaymentStatus = async () => {
    setIsLoading(true)

    try {
      // Se estiver no modo offline ou em desenvolvimento, simular a aprovação
      if (isOfflineMode || process.env.NODE_ENV === "development") {
        console.log("Modo offline ou desenvolvimento, simulando aprovação de pagamento")

        // Simular um atraso para parecer real
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Atualizar o status da assinatura
        upgradeSubscription(planId as "free" | "basic" | "premium")
        setIsSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)

        return
      }

      // Verificar o status do pagamento na API
      if (paymentResponse && paymentResponse.orderId) {
        const response = await fetch(`/api/bbpay/status?orderId=${paymentResponse.orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Erro ao verificar status do pagamento")
        }

        const data = await response.json()

        if (data.status === "approved") {
          // Atualizar o status da assinatura
          upgradeSubscription(planId as "free" | "basic" | "premium")
          setIsSuccess(true)
          setTimeout(() => {
            onSuccess()
          }, 2000)
        } else {
          setError("Pagamento ainda não confirmado. Tente novamente em alguns instantes.")
          setIsLoading(false)
        }
      } else {
        throw new Error("ID do pedido não encontrado")
      }
    } catch (error: any) {
      console.error("Erro ao verificar status:", error)
      setError(error.message || "Erro ao verificar status do pagamento")
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

  // Mostrar aviso de modo offline
  if (isOfflineMode) {
    return (
      <div className="p-4">
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-md mb-6 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Modo Offline Ativado</p>
            <p className="text-sm">Você está no modo offline. O pagamento será simulado para fins de demonstração.</p>
          </div>
        </div>

        {/* Continuar com o formulário normal */}
        {renderCheckoutForm()}
      </div>
    )
  }

  // Mostrar instruções de pagamento para PIX
  if (paymentResponse && paymentMethod === "PIX" && !isSuccess) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Pagamento via PIX</h2>
        <p className="mb-4">Escaneie o QR Code abaixo ou copie o código PIX para realizar o pagamento:</p>

        {paymentResponse.qrCodeImage && (
          <div className="mb-4 flex justify-center">
            <div className="bg-white p-4 rounded-lg inline-block">
              <Image
                src={paymentResponse.qrCodeImage || "/placeholder.svg"}
                alt="QR Code PIX"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
          </div>
        )}

        {paymentResponse.qrCodeText && (
          <div className="mb-6">
            <p className="text-sm mb-2">Código PIX Copia e Cola:</p>
            <div className="bg-white/10 p-3 rounded-lg text-xs break-all relative">
              {paymentResponse.qrCodeText}
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-2"
                onClick={() => {
                  navigator.clipboard.writeText(paymentResponse.qrCodeText)
                  alert("Código PIX copiado!")
                }}
              >
                Copiar
              </Button>
            </div>
          </div>
        )}

        <p className="text-sm mb-4">
          O QR Code expira em:{" "}
          {paymentResponse.expirationDate ? new Date(paymentResponse.expirationDate).toLocaleString() : "60 minutos"}
        </p>

        <div className="flex gap-3 justify-center mt-6">
          <Button
            onClick={checkPixPaymentStatus}
            disabled={isLoading}
            className="bg-[#8e2de2] hover:bg-[#a100f5] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando...
              </>
            ) : (
              "Já realizei o pagamento"
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Mostrar instruções de pagamento para Boleto
  if (paymentResponse && paymentMethod === "BOLETO" && !isSuccess) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Pagamento via Boleto</h2>
        <p className="mb-4">Utilize o boleto abaixo para realizar o pagamento:</p>

        {paymentResponse.barCode && (
          <div className="mb-4">
            <p className="text-sm mb-2">Código de Barras:</p>
            <div className="bg-white/10 p-3 rounded-lg text-xs break-all relative">
              {paymentResponse.barCode}
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-2"
                onClick={() => {
                  navigator.clipboard.writeText(paymentResponse.barCode)
                  alert("Código de barras copiado!")
                }}
              >
                Copiar
              </Button>
            </div>
          </div>
        )}

        {paymentResponse.boletoUrl && (
          <div className="mb-6">
            <Button
              onClick={() => window.open(paymentResponse.boletoUrl, "_blank")}
              className="bg-[#8e2de2] hover:bg-[#a100f5] text-white"
            >
              <FileText className="w-4 h-4 mr-2" /> Abrir Boleto
            </Button>
          </div>
        )}

        <p className="text-sm mb-4">
          Vencimento:{" "}
          {paymentResponse.dueDate ? new Date(paymentResponse.dueDate).toLocaleDateString() : "3 dias após a emissão"}
        </p>

        <p className="text-sm mb-6">
          Após o pagamento, pode levar até 3 dias úteis para a confirmação. Sua assinatura será ativada automaticamente
          após a confirmação do pagamento.
        </p>

        <Button onClick={onCancel} variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
          Voltar
        </Button>
      </div>
    )
  }

  // Função para renderizar o formulário de checkout
  function renderCheckoutForm() {
    return (
      <>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-[#ff9be2]" /> Checkout - {planName}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-4">{error}</div>
        )}

        {/* Seleção de método de pagamento */}
        <div className="mb-6">
          <Label className="mb-2 block">Método de Pagamento</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              onClick={() => setPaymentMethod("CREDIT_CARD")}
              className={`flex flex-col items-center justify-center p-3 h-auto ${
                paymentMethod === "CREDIT_CARD"
                  ? "bg-[#8e2de2] text-white"
                  : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
            >
              <CreditCard className="h-6 w-6 mb-1" />
              <span className="text-xs">Cartão</span>
            </Button>
            <Button
              type="button"
              onClick={() => setPaymentMethod("PIX")}
              className={`flex flex-col items-center justify-center p-3 h-auto ${
                paymentMethod === "PIX" ? "bg-[#8e2de2] text-white" : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
            >
              <QrCode className="h-6 w-6 mb-1" />
              <span className="text-xs">PIX</span>
            </Button>
            <Button
              type="button"
              onClick={() => setPaymentMethod("BOLETO")}
              className={`flex flex-col items-center justify-center p-3 h-auto ${
                paymentMethod === "BOLETO" ? "bg-[#8e2de2] text-white" : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
            >
              <FileText className="h-6 w-6 mb-1" />
              <span className="text-xs">Boleto</span>
            </Button>
          </div>
        </div>

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

          {/* Campos específicos para Cartão de Crédito */}
          {paymentMethod === "CREDIT_CARD" && (
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
                <div className="md:col-span-2">
                  <Label htmlFor="installments">Parcelas</Label>
                  <select
                    id="installments"
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full bg-white/10 border-white/20 rounded-md p-2"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}x de R$ {(amount / 100 / (i + 1)).toFixed(2).replace(".", ",")}
                        {i === 0 ? " (sem juros)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Campos específicos para Boleto */}
          {paymentMethod === "BOLETO" && (
            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-3">Endereço para Boleto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">CEP</Label>
                  <Input
                    id="postalCode"
                    value={address.postalCode}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        postalCode: formatCep(e.target.value),
                      })
                    }
                    placeholder="00000-000"
                    maxLength={9}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Nome da rua"
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={address.number}
                    onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    placeholder="123"
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="locality">Bairro</Label>
                  <Input
                    id="locality"
                    value={address.locality}
                    onChange={(e) => setAddress({ ...address, locality: e.target.value })}
                    placeholder="Seu bairro"
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Sua cidade"
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Estado</Label>
                  <Input
                    id="region"
                    value={address.region}
                    onChange={(e) => setAddress({ ...address, region: e.target.value })}
                    placeholder="Seu estado"
                    className="bg-white/10 border-white/20"
                  />
                </div>
              </div>
            </div>
          )}

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
      </>
    )
  }

  return <div className="p-4">{renderCheckoutForm()}</div>
}
