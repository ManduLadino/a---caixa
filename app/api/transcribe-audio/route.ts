import { NextResponse } from "next/server"
import OpenAI from "openai"

// Inicializa o cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Obtém o FormData da requisição
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json(
        { text: "Não foi possível capturar o áudio. Por favor, tente novamente." },
        { status: 400 },
      )
    }

    try {
      // Converte o arquivo para um buffer
      const arrayBuffer = await audioFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Verifica se o buffer tem conteúdo
      if (buffer.length === 0) {
        return NextResponse.json({ text: "Arquivo de áudio vazio. Por favor, tente novamente." }, { status: 400 })
      }

      // Cria um arquivo temporário para enviar à API
      const tempFile = new File([buffer], "audio.webm", { type: audioFile.type })

      // Chama a API de transcrição do OpenAI
      const transcription = await openai.audio.transcriptions.create({
        file: tempFile,
        model: "whisper-1",
        language: "pt",
      })

      // Retorna o texto transcrito
      return NextResponse.json({ text: transcription.text })
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError)

      // Retorna um texto genérico em vez de um erro
      return NextResponse.json(
        {
          text: "Não foi possível transcrever o áudio. Por favor, digite sua pergunta.",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error in API route:", error)

    // Retorna um texto genérico em vez de um erro
    return NextResponse.json(
      {
        text: "Não foi possível processar o áudio. Por favor, digite sua pergunta.",
      },
      { status: 500 },
    )
  }
}
