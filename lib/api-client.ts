import { getAuthHeader } from "./api-config"

// Cliente de API para fazer requisições autenticadas
export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Exemplo de uso:
// const data = await apiClient<YourResponseType>('/api/protected')
