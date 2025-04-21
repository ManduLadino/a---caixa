import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 })
    }

    // Gera o áudio usando a API TTS da OpenAI
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // Voz feminina suave
      input: text,
    })

    // Converte o áudio para buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())

    // Retorna o áudio como base64 para ser reproduzido no cliente
    return NextResponse.json({
      audio: buffer.toString("base64"),
      format: "mp3",
    })
  } catch (error) {
    console.error("Erro ao gerar áudio:", error)
    return NextResponse.json({ error: "Erro ao gerar áudio. Tente novamente mais tarde." }, { status: 500 })
  }
}
