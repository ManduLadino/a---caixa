// Configurações de API para o projeto
export const API_KEYS = {
  // Chave de API principal
  MAIN_API_KEY:
    process.env.MAIN_API_KEY ||
    "c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",

  // Chave do PagBank (existente)
  PAGBANK_TOKEN: process.env.PAGBANK_TOKEN || "",

  // URL base (existente)
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

  // Identificador do serviço
  SERVICE_ID: "ibnergra",
}

// Função para obter o cabeçalho de autorização
export function getAuthHeader() {
  return {
    Authorization: `Bearer ${API_KEYS.MAIN_API_KEY}`,
    "X-Service-ID": API_KEYS.SERVICE_ID,
  }
}

// Função para verificar se a chave de API é válida
export function isValidApiKey(apiKey: string): boolean {
  return apiKey === API_KEYS.MAIN_API_KEY
}
