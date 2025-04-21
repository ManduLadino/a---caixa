import { NextResponse } from "next/server"
import OpenAI from "openai"
import { getMultiStonePrompt } from "@/lib/stone-prompts"

// Inicializa o cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Leitura padrão para fallback
const defaultReading = `
# Leitura Mística das Pedras

## Passado
As pedras revelam um caminho de aprendizado e crescimento. Você passou por desafios que fortaleceram sua essência espiritual. As energias das pedras mostram que você carrega sabedoria de experiências passadas.

## Presente
Neste momento, você está em um período de transformação. As pedras indicam que há energias positivas ao seu redor, apoiando suas decisões. É um momento para confiar em sua intuição e seguir em frente com confiança.

## Futuro
O futuro se mostra promissor, com novas oportunidades surgindo em seu caminho. As pedras sugerem que mantendo o equilíbrio entre mente, corpo e espírito, você encontrará harmonia e realização em sua jornada.

Lembre-se que você é o criador do seu próprio destino, e as pedras apenas iluminam o caminho que você escolher seguir.
`

export async function POST(request: Request) {
  try {
    // Parse the request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ reply: defaultReading })
    }

    const { question, name, birthDate, stoneTypes, stonePositions, audioQuestion, customPrompt, timestamp, uniqueId } =
      body

    // Usar a pergunta de áudio se disponível, caso contrário usar a pergunta de texto
    const userQuestion = audioQuestion || question || "O que as pedras revelam sobre meu caminho?"

    // Gerar um prompt personalizado baseado nos tipos de pedras
    let prompt = ""

    // Adicionar elementos de aleatoriedade para garantir leituras únicas
    const randomSeed = Math.random().toString(36).substring(2, 15)
    const currentTime = new Date().toISOString()
    const uniqueIdentifier = uniqueId || `${Date.now()}-${randomSeed}`

    if (stoneTypes && stoneTypes.length > 0) {
      // Usar o prompt personalizado baseado nas pedras
      prompt = getMultiStonePrompt(stoneTypes)

      // Adicionar informações do usuário
      prompt += `\n\nDados do usuário:
- Nome: ${name || "Consulente"}
- Data de nascimento: ${birthDate || "Não informada"}
- Pergunta: "${userQuestion}"
- Timestamp: ${timestamp || Date.now()}
- ID único: ${uniqueIdentifier}
- Momento da consulta: ${currentTime}`

      // Adicionar informações sobre as posições das pedras se disponíveis
      if (stonePositions && stonePositions.length > 0) {
        prompt += `\n\nDisposição das pedras:
- Total de pedras: ${stonePositions.length}
- Padrão: ${stonePositions.length > 20 ? "Complexo" : "Simples"}
- Distribuição: ${stonePositions.some((p) => p.x < 100) ? "Concentrada à esquerda" : stonePositions.some((p) => p.x > 300) ? "Concentrada à direita" : "Centralizada"}
- Alinhamento: ${stonePositions.some((p) => p.y < 100) ? "Superior" : stonePositions.some((p) => p.y > 300) ? "Inferior" : "Central"}`
      }

      // Adicionar instruções para garantir leituras únicas
      prompt += `\n\nInstruções para leitura:
1. Cada leitura deve ser COMPLETAMENTE ÚNICA e personalizada. Nunca repita padrões ou frases de leituras anteriores.
2. Use a combinação específica de pedras para criar uma narrativa única e profunda.
3. Inclua detalhes específicos sobre as pedras escolhidas e suas interações energéticas.
4. Crie uma leitura estruturada com seções para passado, presente e futuro.
5. Use linguagem poética e metafórica, mas mantenha clareza na mensagem.
6. Inclua pelo menos uma frase ou insight que nunca tenha sido usado antes.
7. Adapte o tom da leitura ao tipo de pergunta feita pelo consulente.
8. Inclua referências sutis à disposição física das pedras na caixa.
9. Adicione um elemento de surpresa ou revelação inesperada na leitura.
10. Conclua com uma mensagem de esperança ou orientação prática.`
    } else {
      // Prompt padrão se não houver pedras específicas
      prompt = `Você é um oráculo místico. Faça uma leitura COMPLETAMENTE ÚNICA e personalizada para ${name || "o consulente"} 
que nasceu em ${birthDate || "uma data não informada"} e perguntou: "${userQuestion}".
Crie uma leitura estruturada com seções para passado, presente e futuro.
Timestamp para garantir unicidade: ${timestamp || Date.now()}
ID único: ${uniqueIdentifier}
Momento da consulta: ${currentTime}

IMPORTANTE: Esta leitura deve ser totalmente diferente de qualquer outra que você já tenha feito. Use linguagem poética e metafórica única, insights originais, e uma estrutura que se adapte especificamente à pergunta do consulente.`
    }

    try {
      // Call the OpenAI API with the custom prompt
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Você é um oráculo místico especializado em leituras de pedras. Cada leitura que você faz é única, mesmo para perguntas similares. Nunca repita padrões ou frases de leituras anteriores.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 1.0, // Temperatura máxima para mais variação
        max_tokens: 1000,
        frequency_penalty: 0.8, // Penalidade para repetição de frases
        presence_penalty: 0.6, // Penalidade para repetição de tópicos
      })

      const reply = response.choices[0].message.content || defaultReading
      return NextResponse.json({ reply })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)
      // Return a fallback reading if the API call fails
      return NextResponse.json({ reply: defaultReading }, { status: 200 })
    }
  } catch (error) {
    console.error("Error in API route:", error)
    // Return a fallback reading with a 200 status to avoid breaking the client
    return NextResponse.json({ reply: defaultReading }, { status: 200 })
  }
}
