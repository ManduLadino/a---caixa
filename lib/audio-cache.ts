// Definição da interface para os itens do cache
interface CacheItem {
  audioHash: string
  text: string
  timestamp: number
}

// Configurações do cache
const CACHE_KEY = "audio-transcription-cache"
const MAX_CACHE_SIZE = 20 // Número máximo de itens no cache
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 dias em milissegundos

/**
 * Gera um hash simples para o conteúdo do áudio
 * Nota: Este é um hash básico para fins de cache, não para segurança
 */
export async function generateAudioHash(audioBlob: Blob): Promise<string> {
  // Pega uma amostra do áudio para gerar um hash
  // Para arquivos grandes, usamos apenas os primeiros e últimos bytes
  const MAX_SAMPLE_SIZE = 1024 * 10 // 10KB de amostra

  let arrayBuffer: ArrayBuffer

  if (audioBlob.size <= MAX_SAMPLE_SIZE) {
    arrayBuffer = await audioBlob.arrayBuffer()
  } else {
    // Para arquivos grandes, pegamos o início e o fim
    const headBlob = audioBlob.slice(0, MAX_SAMPLE_SIZE / 2)
    const tailBlob = audioBlob.slice(audioBlob.size - MAX_SAMPLE_SIZE / 2)

    const headBuffer = await headBlob.arrayBuffer()
    const tailBuffer = await tailBlob.arrayBuffer()

    // Concatena os buffers
    const combinedArray = new Uint8Array(MAX_SAMPLE_SIZE)
    combinedArray.set(new Uint8Array(headBuffer), 0)
    combinedArray.set(new Uint8Array(tailBuffer), MAX_SAMPLE_SIZE / 2)

    arrayBuffer = combinedArray.buffer
  }

  // Converte o buffer em uma string de bytes para hash
  const byteArray = new Uint8Array(arrayBuffer)
  let hashString = ""

  // Pega bytes em intervalos regulares para criar uma "impressão digital" do áudio
  const step = Math.max(1, Math.floor(byteArray.length / 100))
  for (let i = 0; i < byteArray.length; i += step) {
    hashString += byteArray[i].toString(16).padStart(2, "0")
  }

  // Adiciona o tamanho do arquivo ao hash para diferenciar arquivos similares
  hashString += `-${audioBlob.size}`

  return hashString
}

/**
 * Obtém o cache atual do localStorage
 */
export function getCache(): CacheItem[] {
  try {
    const cacheData = localStorage.getItem(CACHE_KEY)
    if (!cacheData) return []

    return JSON.parse(cacheData)
  } catch (error) {
    console.error("Erro ao ler cache de áudio:", error)
    return []
  }
}

/**
 * Salva o cache no localStorage
 */
export function saveCache(cache: CacheItem[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.error("Erro ao salvar cache de áudio:", error)
  }
}

/**
 * Limpa itens expirados do cache
 */
export function cleanExpiredCache(): void {
  const cache = getCache()
  const now = Date.now()

  const validCache = cache.filter((item) => {
    return now - item.timestamp < CACHE_EXPIRY
  })

  if (validCache.length !== cache.length) {
    saveCache(validCache)
  }
}

/**
 * Busca uma transcrição no cache
 */
export function findTranscriptionInCache(audioHash: string): string | null {
  cleanExpiredCache()

  const cache = getCache()
  const cacheItem = cache.find((item) => item.audioHash === audioHash)

  return cacheItem ? cacheItem.text : null
}

/**
 * Adiciona uma transcrição ao cache
 */
export function addTranscriptionToCache(audioHash: string, text: string): void {
  const cache = getCache()

  // Remove o item existente com o mesmo hash, se houver
  const filteredCache = cache.filter((item) => item.audioHash !== audioHash)

  // Adiciona o novo item
  filteredCache.unshift({
    audioHash,
    text,
    timestamp: Date.now(),
  })

  // Limita o tamanho do cache
  if (filteredCache.length > MAX_CACHE_SIZE) {
    filteredCache.length = MAX_CACHE_SIZE
  }

  saveCache(filteredCache)
}

/**
 * Limpa todo o cache
 */
export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY)
}
