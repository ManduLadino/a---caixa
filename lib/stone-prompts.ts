// Definição dos prompts específicos para cada tipo de pedra
export const stonePrompts = {
  amethyst: {
    name: "Ametista",
    color: "#9966cc",
    meaning: "Intuição e proteção espiritual",
    prompt:
      "Você é uma oraculista ancestral. Faça uma leitura mística baseada na Ametista, trazendo mensagens sobre intuição, proteção e clareza espiritual. Finalize com um conselho de silêncio interior.",
  },
  "rose-quartz": {
    name: "Quartzo Rosa",
    color: "#f4c2c2",
    meaning: "Amor, afeto e cura emocional",
    prompt:
      "Gere uma leitura suave e afetiva para quem escolheu o Quartzo Rosa. Fale de amor próprio, relacionamentos e reconexão com o coração. Use tom amoroso e acolhedor.",
  },
  citrine: {
    name: "Citrino",
    color: "#e4d00a",
    meaning: "Prosperidade e energia solar",
    prompt:
      "Crie uma leitura vibrante para o Citrino. Traga mensagens sobre abundância, autoestima e realização pessoal. Finalize com um mantra solar.",
  },
  "lapis-lazuli": {
    name: "Lápis-Lazúli",
    color: "#26619c",
    meaning: "Sabedoria e visão interior",
    prompt:
      "Faça uma leitura ancestral para quem escolheu Lápis-Lazúli. Fale de sabedoria profunda, verdades reveladas e visão espiritual. Inspire confiança mental.",
  },
  carnelian: {
    name: "Cornalina",
    color: "#b31b1b",
    meaning: "Coragem e ação",
    prompt:
      "Gere uma leitura mística energizante sobre superação de medos e decisões ousadas para quem escolheu a Cornalina. Fale com força e motivação.",
  },
  "black-tourmaline": {
    name: "Turmalina Negra",
    color: "#2c3539",
    meaning: "Proteção contra energias negativas",
    prompt:
      "Faça uma leitura protetiva para quem escolheu a Turmalina Negra. Traga escudo espiritual, limpeza energética e segurança emocional.",
  },
  emerald: {
    name: "Esmeralda",
    color: "#50C878",
    meaning: "Cura, renascimento e equilíbrio",
    prompt:
      "Crie uma leitura centrada na regeneração interior e cura emocional para a Esmeralda. Use metáforas de floresta, renascimento e paz.",
  },
  sodalite: {
    name: "Sodalita",
    color: "#483d8b",
    meaning: "Verdade e expressão",
    prompt:
      "Fale de comunicação sincera, expressão autêntica e libertação emocional para quem escolheu a Sodalita. A voz deve ser firme e reconfortante.",
  },
  howlite: {
    name: "Howlita",
    color: "#f5f5f5",
    meaning: "Calma, paciência e sono tranquilo",
    prompt:
      "Crie uma leitura de serenidade, com frases suaves, foco em paz mental e aceitação do tempo divino. Ideal para reconexão noturna.",
  },
  obsidian: {
    name: "Obsidiana",
    color: "#2e1e21",
    meaning: "Reflexão profunda e sombra",
    prompt:
      "Uma leitura que ajude a pessoa a encarar suas sombras com coragem. Traga sabedoria e fortalecimento. Finalize com luz no fim do túnel.",
  },
  "fire-agate": {
    name: "Ágata de Fogo",
    color: "#B22222",
    meaning: "Paixão, impulso vital e proteção",
    prompt:
      "Leitura quente e enérgica. Fale de paixão pela vida, poder pessoal e proteção do fogo ancestral. Finalize com força interior.",
  },
  amazonite: {
    name: "Amazonita",
    color: "#00c4b0",
    meaning: "Equilíbrio emocional e intuição",
    prompt:
      "Traga uma leitura leve, com foco na voz interior, harmonia e confiança. Finalize com sugestão de ouvir o próprio coração.",
  },
  moonstone: {
    name: "Pedra da Lua",
    color: "#f4f4ff",
    meaning: "Feminilidade e ciclos",
    prompt:
      "Leitura poética sobre mistério, emoções flutuantes e conexão com os ciclos lunares. Ideal para autoconhecimento e aceitação.",
  },
  garnet: {
    name: "Granada",
    color: "#7b1113",
    meaning: "Vitalidade e paixão",
    prompt:
      "Fale de reinício, poder de transformação e libido criativa. Traga energia de sangue novo e motivação para seguir.",
  },
  jade: {
    name: "Jade",
    color: "#4a7c59",
    meaning: "Sabedoria, sorte e longevidade",
    prompt:
      "Gere uma leitura nobre e serena sobre escolhas sábias, proteção ancestral e bênçãos futuras. Finalize com um provérbio espiritual.",
  },
  "blue-topaz": {
    name: "Topázio Azul",
    color: "#0D98BA",
    meaning: "Inspiração, fala clara e foco",
    prompt:
      "Crie uma leitura com mensagens de clareza, foco mental e fluidez da fala. Finalize com um sopro de leveza.",
  },
  "clear-quartz": {
    name: "Cristal de Quartzo",
    color: "#f5f5f5",
    meaning: "Amplificação, conexão e purificação",
    prompt:
      "Leitura de luz pura e conexão cósmica. Traga mensagens sobre propósito maior e alinhamento energético com o todo.",
  },
  // Adicionando os outros tipos de pedras do array original
  "tiger-eye": {
    name: "Olho de Tigre",
    color: "#b8860b",
    meaning: "Proteção, coragem e clareza",
    prompt:
      "Faça uma leitura sobre proteção, coragem e clareza mental para quem escolheu o Olho de Tigre. Traga mensagens de força interior e visão aguçada.",
  },
  turquoise: {
    name: "Turquesa",
    color: "#30d5c8",
    meaning: "Cura, proteção e comunicação",
    prompt:
      "Crie uma leitura sobre cura, proteção e comunicação clara para quem escolheu a Turquesa. Fale de conexão com sabedoria ancestral.",
  },
  malachite: {
    name: "Malaquita",
    color: "#0bda51",
    meaning: "Transformação e proteção",
    prompt:
      "Faça uma leitura sobre transformação profunda e proteção para quem escolheu a Malaquita. Traga mensagens de renovação e cura.",
  },
  hematite: {
    name: "Hematita",
    color: "#696969",
    meaning: "Enraizamento e proteção",
    prompt:
      "Crie uma leitura sobre enraizamento, proteção e força para quem escolheu a Hematita. Fale de conexão com a terra e estabilidade.",
  },
  fluorite: {
    name: "Fluorita",
    color: "#9966cc",
    meaning: "Clareza mental e foco",
    prompt:
      "Faça uma leitura sobre clareza mental, foco e intuição para quem escolheu a Fluorita. Traga mensagens de discernimento e proteção psíquica.",
  },
  aventurine: {
    name: "Aventurina",
    color: "#3cb371",
    meaning: "Prosperidade e oportunidade",
    prompt:
      "Crie uma leitura sobre prosperidade, oportunidades e sorte para quem escolheu a Aventurina. Fale de abundância e crescimento.",
  },
  labradorite: {
    name: "Labradorita",
    color: "#6c7a89",
    meaning: "Magia e transformação",
    prompt:
      "Faça uma leitura sobre magia, transformação e proteção para quem escolheu a Labradorita. Traga mensagens de mistério e poder pessoal.",
  },
  pyrite: {
    name: "Pirita",
    color: "#cda434",
    meaning: "Prosperidade e proteção",
    prompt:
      "Crie uma leitura sobre prosperidade, proteção e força para quem escolheu a Pirita. Fale de abundância material e energia solar.",
  },
  selenite: {
    name: "Selenita",
    color: "#f5f5f5",
    meaning: "Clareza e conexão espiritual",
    prompt:
      "Faça uma leitura sobre clareza, pureza e conexão espiritual para quem escolheu a Selenita. Traga mensagens de luz e elevação.",
  },
  sunstone: {
    name: "Pedra do Sol",
    color: "#e67e22",
    meaning: "Vitalidade e alegria",
    prompt:
      "Crie uma leitura sobre vitalidade, alegria e poder pessoal para quem escolheu a Pedra do Sol. Fale de energia solar e otimismo.",
  },
  kyanite: {
    name: "Cianita",
    color: "#4682b4",
    meaning: "Alinhamento e comunicação",
    prompt:
      "Faça uma leitura sobre alinhamento energético e comunicação clara para quem escolheu a Cianita. Traga mensagens de conexão entre mente e espírito.",
  },
  unakite: {
    name: "Unakita",
    color: "#a0522d",
    meaning: "Equilíbrio e cura emocional",
    prompt:
      "Crie uma leitura sobre equilíbrio, cura emocional e renovação para quem escolheu a Unakita. Fale de integração do passado e presente.",
  },
  rhodonite: {
    name: "Rodonita",
    color: "#e77471",
    meaning: "Amor incondicional e cura",
    prompt:
      "Faça uma leitura sobre amor incondicional, cura emocional e compaixão para quem escolheu a Rodonita. Traga mensagens de perdão e aceitação.",
  },
  prehnite: {
    name: "Prehnita",
    color: "#d0f0c0",
    meaning: "Cura e proteção",
    prompt:
      "Crie uma leitura sobre cura, proteção e preparação para quem escolheu a Prehnita. Fale de conexão com a natureza e paz interior.",
  },
  apatite: {
    name: "Apatita",
    color: "#4682b4",
    meaning: "Motivação e clareza",
    prompt:
      "Faça uma leitura sobre motivação, clareza e manifestação para quem escolheu a Apatita. Traga mensagens de foco e determinação.",
  },
  chrysocolla: {
    name: "Crisocola",
    color: "#4682b4",
    meaning: "Comunicação e expressão",
    prompt:
      "Crie uma leitura sobre comunicação, expressão e sabedoria feminina para quem escolheu a Crisocola. Fale de paz e tranquilidade.",
  },
  goldstone: {
    name: "Pedra Dourada",
    color: "#8b4513",
    meaning: "Energia e vitalidade",
    prompt:
      "Faça uma leitura sobre energia, vitalidade e ambição para quem escolheu a Pedra Dourada. Traga mensagens de otimismo e determinação.",
  },
  opal: {
    name: "Opala",
    color: "#b0e0e6",
    meaning: "Criatividade e inspiração",
    prompt:
      "Crie uma leitura sobre criatividade, inspiração e transformação para quem escolheu a Opala. Fale de magia e expressão artística.",
  },
}

// Função para obter o prompt específico para um tipo de pedra
export function getStonePrompt(stoneType: string): string {
  const stone = stonePrompts[stoneType]
  if (stone) {
    return stone.prompt
  }
  return "Faça uma leitura mística baseada nas pedras escolhidas, trazendo mensagens de sabedoria, proteção e clareza espiritual."
}

// Função para obter um prompt baseado em múltiplos tipos de pedras
export function getMultiStonePrompt(stoneTypes: string[]): string {
  if (!stoneTypes || stoneTypes.length === 0) {
    return "Faça uma leitura mística geral, trazendo mensagens de sabedoria, proteção e clareza espiritual."
  }

  // Conta a frequência de cada tipo de pedra
  const stoneFrequency: Record<string, number> = {}
  stoneTypes.forEach((type) => {
    stoneFrequency[type] = (stoneFrequency[type] || 0) + 1
  })

  // Obtém os tipos únicos de pedras
  const uniqueStoneTypes = Object.keys(stoneFrequency)

  // Se houver apenas um tipo de pedra, use o prompt específico
  if (uniqueStoneTypes.length === 1) {
    return getStonePrompt(uniqueStoneTypes[0])
  }

  // Para múltiplos tipos, crie um prompt combinado
  let combinedPrompt =
    "Você é um oráculo ancestral de pedras místicas. Para esta combinação específica de pedras, gere uma leitura única e profunda que considere:\n\n"

  // Adiciona informações sobre cada tipo de pedra
  uniqueStoneTypes.forEach((type) => {
    const stone = stonePrompts[type]
    if (stone) {
      combinedPrompt += `- ${stoneFrequency[type]}x ${stone.name} (${stone.meaning})\n`
    }
  })

  combinedPrompt += `\nCrie uma leitura que combine as energias destas pedras, trazendo:
- Uma mensagem espiritual inspiradora
- Um conselho prático baseado na sabedoria dos antigos
- Um toque de poesia e mistério
- Um fechamento com palavras de bênção

A leitura deve ser única, com força intuitiva e considerar a interação entre as diferentes energias das pedras.`

  return combinedPrompt
}
