import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default mandala parameters as fallback
const defaultMandalaParams = {
  colors: ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"],
  layers: 5,
  shape: "circle",
  complexity: 7,
  symbols: ["estrela", "espiral", "lua"],
}

// Lista de cores para variação
const colorPalettes = [
  ["#8e2de2", "#ff9be2", "#6a1fc7", "#36005d", "#c774f0"], // Roxo e rosa
  ["#2de28e", "#9be2ff", "#1fc76a", "#005d36", "#74f0c7"], // Verde e azul
  ["#e28e2d", "#ffbe9b", "#c76a1f", "#5d3600", "#f0c774"], // Laranja e amarelo
  ["#2d8ee2", "#9bffbe", "#1f6ac7", "#00365d", "#74c7f0"], // Azul e verde
  ["#e22d8e", "#ff9bbe", "#c71f6a", "#5d0036", "#f074c7"], // Rosa e roxo
]

export async function POST(request: Request) {
  try {
    // Parse the request body
    let reading = ""
    let timestamp = Date.now()

    try {
      const body = await request.json()
      reading = body.reading || ""
      timestamp = body.timestamp || Date.now()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      // Return default parameters with some randomness if we can't parse the request
      return NextResponse.json({
        params: {
          ...defaultMandalaParams,
          colors: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
          layers: Math.floor(Math.random() * 5) + 3, // 3-7 layers
          complexity: Math.floor(Math.random() * 10) + 1, // 1-10 complexity
        },
      })
    }

    if (!reading) {
      // Return default parameters with some randomness
      return NextResponse.json({
        params: {
          ...defaultMandalaParams,
          colors: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
          layers: Math.floor(Math.random() * 5) + 3, // 3-7 layers
          complexity: Math.floor(Math.random() * 10) + 1, // 1-10 complexity
        },
      })
    }

    try {
      // Try to call the OpenAI API
      const mandalaResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em criar parâmetros para gerar mandalas personalizadas. Com base em uma leitura mística, você deve extrair elementos-chave e convertê-los em parâmetros visuais. Cada mandala deve ser única.",
          },
          {
            role: "user",
            content: `Com base nesta leitura mística: "${reading}", gere parâmetros para uma mandala personalizada. Forneça: 1) Cores principais (em hex), 2) Número de camadas (3-7), 3) Forma predominante (círculo, triângulo, etc.), 4) Nível de complexidade (1-10), 5) Elementos simbólicos a incluir. Responda apenas com um objeto JSON. Timestamp para garantir unicidade: ${timestamp}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8, // Aumentar a temperatura para mais variação
        max_tokens: 500,
      })

      const mandalaParamsText = mandalaResponse.choices[0].message.content || "{}"
      let mandalaParams

      try {
        mandalaParams = JSON.parse(mandalaParamsText)
      } catch (e) {
        console.error("Error parsing OpenAI response:", e)
        // Return default parameters with some randomness
        mandalaParams = {
          ...defaultMandalaParams,
          colors: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
          layers: Math.floor(Math.random() * 5) + 3, // 3-7 layers
          complexity: Math.floor(Math.random() * 10) + 1, // 1-10 complexity
        }
      }

      return NextResponse.json({ params: mandalaParams })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)
      // Return default parameters with some randomness if the API call fails
      return NextResponse.json({
        params: {
          ...defaultMandalaParams,
          colors: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
          layers: Math.floor(Math.random() * 5) + 3, // 3-7 layers
          complexity: Math.floor(Math.random() * 10) + 1, // 1-10 complexity
        },
      })
    }
  } catch (error) {
    console.error("Error in API route:", error)
    // Return default parameters with a 200 status to avoid breaking the client
    return NextResponse.json(
      {
        params: {
          ...defaultMandalaParams,
          colors: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
          layers: Math.floor(Math.random() * 5) + 3, // 3-7 layers
          complexity: Math.floor(Math.random() * 10) + 1, // 1-10 complexity
        },
      },
      { status: 200 },
    )
  }
}
