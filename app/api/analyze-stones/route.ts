import { NextResponse } from "next/server"
import OpenAI from "openai"

// Inicializa o cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const name = formData.get("name") as string
    const birthdate = formData.get("birthdate") as string
    const question = formData.get("question") as string

    if (!imageFile || !name || !birthdate || !question) {
      return NextResponse.json(
        { error: "Imagem, nome, data de nascimento e pergunta são obrigatórios" },
        { status: 400 },
      )
    }

    // Converte o arquivo para base64
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")
    const dataURI = `data:${imageFile.type};base64,${base64Image}`

    // Analisa a imagem com a API Vision da OpenAI
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em análise de pedras místicas. Analise a disposição das pedras na imagem, identificando padrões, cores, agrupamentos e posições. Forneça uma análise detalhada que possa ser usada para uma leitura esotérica.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de pedras místicas. O usuário se chama ${name}, nasceu em ${birthdate} e perguntou: "${question}". Identifique os tipos de pedras, suas posições, agrupamentos e padrões energéticos.`,
            },
            {
              type: "image_url",
              image_url: {
                url: dataURI,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    })

    const stoneAnalysis = visionResponse.choices[0].message.content || ""

    // Gera a leitura mística baseada na análise das pedras
    const readingResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Você é um oráculo místico que interpreta padrões de pedras para revelar insights profundos sobre o passado, presente e futuro. Use linguagem poética, simbólica e espiritual, mas mantenha um tom respeitoso e inspirador.",
        },
        {
          role: "user",
          content: `Com base nesta análise de pedras: "${stoneAnalysis}", crie uma leitura mística profunda para ${name}, nascido(a) em ${birthdate}, que perguntou: "${question}". A leitura deve abordar passado, presente e futuro, e incluir orientações espirituais. Divida a resposta em seções claras.`,
        },
      ],
      max_tokens: 1500,
    })

    const mysticReading = readingResponse.choices[0].message.content || ""

    // Gera os parâmetros para a mandala baseados na leitura
    const mandalaResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em criar parâmetros para gerar mandalas personalizadas. Com base em uma leitura mística, você deve extrair elementos-chave e convertê-los em parâmetros visuais.",
        },
        {
          role: "user",
          content: `Com base nesta leitura mística: "${mysticReading}", gere parâmetros para uma mandala personalizada. Forneça: 1) Cores principais (em hex), 2) Número de camadas (3-7), 3) Forma predominante (círculo, triângulo, etc.), 4) Nível de complexidade (1-10), 5) Elementos simbólicos a incluir. Responda apenas com um objeto JSON.`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    })

    const mandalaParams = JSON.parse(mandalaResponse.choices[0].message.content || "{}")

    // Retorna todos os dados processados
    return NextResponse.json({
      analysis: stoneAnalysis,
      reading: mysticReading,
      mandalaParams,
    })
  } catch (error) {
    console.error("Erro ao processar a imagem:", error)
    return NextResponse.json({ error: "Erro ao processar a imagem. Tente novamente mais tarde." }, { status: 500 })
  }
}
