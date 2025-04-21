"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

const CodeBlock = ({ code, language = "bash", title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative mt-4 rounded-md bg-gray-900 text-white">
      {title && <div className="border-b border-gray-800 px-4 py-2 text-xs font-semibold text-gray-400">{title}</div>}
      <pre className="overflow-x-auto p-4 text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-gray-800 p-0 text-gray-400 hover:bg-gray-700 hover:text-white"
        onClick={copyToClipboard}
      >
        {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      </Button>
    </div>
  )
}

interface EndpointProps {
  method: string
  path: string
  description: string
  authentication?: boolean
  request?: {
    headers?: Record<string, string>
    body?: Record<string, any>
    params?: Record<string, string>
  }
  response?: {
    success?: Record<string, any>
    error?: Record<string, any>
  }
}

const Endpoint = ({ method, path, description, authentication = true, request, response }: EndpointProps) => {
  const methodColors = {
    GET: "bg-blue-600",
    POST: "bg-green-600",
    PUT: "bg-yellow-600",
    DELETE: "bg-red-600",
    PATCH: "bg-purple-600",
  }

  const methodColor = methodColors[method as keyof typeof methodColors] || "bg-gray-600"

  return (
    <Card className="mb-6 overflow-hidden border-gray-200">
      <CardHeader className="bg-gray-50 pb-2">
        <div className="flex items-center">
          <span className={`mr-2 rounded px-2 py-1 text-xs font-bold text-white ${methodColor}`}>{method}</span>
          <code className="text-sm font-semibold">{path}</code>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
        {authentication && (
          <div className="mt-2 text-xs text-amber-600">
            <span className="font-semibold">Requer autenticação</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="request">
          <TabsList className="mb-4">
            <TabsTrigger value="request">Requisição</TabsTrigger>
            <TabsTrigger value="response">Resposta</TabsTrigger>
          </TabsList>
          <TabsContent value="request">
            {request?.headers && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold">Headers</h4>
                <CodeBlock language="json" code={JSON.stringify(request.headers, null, 2)} />
              </div>
            )}
            {request?.params && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold">Parâmetros</h4>
                <CodeBlock language="json" code={JSON.stringify(request.params, null, 2)} />
              </div>
            )}
            {request?.body && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold">Body</h4>
                <CodeBlock language="json" code={JSON.stringify(request.body, null, 2)} />
              </div>
            )}
            {!request?.headers && !request?.params && !request?.body && (
              <p className="text-sm text-gray-500">Nenhum parâmetro necessário.</p>
            )}
          </TabsContent>
          <TabsContent value="response">
            {response?.success && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold">Sucesso (200 OK)</h4>
                <CodeBlock language="json" code={JSON.stringify(response.success, null, 2)} />
              </div>
            )}
            {response?.error && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold">Erro</h4>
                <CodeBlock language="json" code={JSON.stringify(response.error, null, 2)} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export function ApiDocs() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Documentação da API - A Caixa Oracle</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Visão Geral</h2>
        <p className="mb-4">
          A API da Caixa Oracle permite que desenvolvedores e parceiros integrem as funcionalidades de leitura de
          pedras, geração de mandalas e gerenciamento de assinaturas em suas próprias aplicações.
        </p>
        <p className="mb-2">
          URL Base: <code className="rounded bg-gray-100 px-2 py-1">{"{BASE_URL}"}/api</code>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Autenticação</h2>
        <p className="mb-4">Todas as requisições à API devem incluir os seguintes cabeçalhos de autenticação:</p>
        <CodeBlock
          language="json"
          title="Headers"
          code={JSON.stringify(
            {
              Authorization:
                "Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",
              "X-Service-ID": "ibnergra",
            },
            null,
            2,
          )}
        />
        <div className="mt-4 rounded-md bg-amber-50 p-4 text-amber-800">
          <h4 className="mb-2 font-semibold">⚠️ Importante</h4>
          <p className="text-sm">
            Mantenha sua chave de API segura. Não compartilhe ou exponha a chave em código do lado do cliente. Todas as
            chamadas à API devem ser feitas a partir do seu servidor.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Endpoints</h2>

        <h3 className="mb-4 text-xl font-semibold">API Protegida</h3>

        <Endpoint
          method="GET"
          path="/api/protected"
          description="Verifica se a autenticação está funcionando corretamente."
          request={{
            headers: {
              Authorization:
                "Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",
              "X-Service-ID": "ibnergra",
            },
          }}
          response={{
            success: {
              success: true,
              message: "Acesso autorizado à API protegida",
              timestamp: "2023-06-15T12:34:56.789Z",
              serviceId: "ibnergra",
            },
            error: {
              error: "Acesso não autorizado",
            },
          }}
        />

        <Endpoint
          method="POST"
          path="/api/protected"
          description="Envia dados para processamento na API protegida."
          request={{
            headers: {
              Authorization:
                "Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",
              "X-Service-ID": "ibnergra",
              "Content-Type": "application/json",
            },
            body: {
              data: "Exemplo de dados",
              options: {
                processType: "standard",
              },
            },
          }}
          response={{
            success: {
              success: true,
              message: "Dados recebidos com sucesso",
              receivedData: {
                data: "Exemplo de dados",
                options: {
                  processType: "standard",
                },
              },
              timestamp: "2023-06-15T12:34:56.789Z",
            },
            error: {
              error: "Erro ao processar a requisição",
            },
          }}
        />

        <h3 className="mb-4 mt-8 text-xl font-semibold">Análise de Pedras</h3>

        <Endpoint
          method="POST"
          path="/api/analyze-stones"
          description="Analisa a disposição das pedras e gera uma interpretação."
          request={{
            headers: {
              Authorization:
                "Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",
              "X-Service-ID": "ibnergra",
              "Content-Type": "application/json",
            },
            body: {
              stonePositions: [
                { id: 1, type: "ametista", x: 0.2, y: 0.3 },
                { id: 2, type: "quartzo", x: 0.5, y: 0.6 },
                { id: 3, type: "jade", x: 0.8, y: 0.4 },
              ],
              question: "Qual o caminho para minha realização pessoal?",
            },
          }}
          response={{
            success: {
              success: true,
              reading: {
                interpretation: "A disposição das pedras indica...",
                energies: ["transformação", "clareza", "equilíbrio"],
                guidance: "Você está em um momento de transição...",
              },
            },
            error: {
              error: "Erro ao analisar as pedras",
              details: "Parâmetros inválidos ou insuficientes",
            },
          }}
        />

        <h3 className="mb-4 mt-8 text-xl font-semibold">Geração de Mandala</h3>

        <Endpoint
          method="POST"
          path="/api/generate-mandala"
          description="Gera uma mandala personalizada com base na leitura das pedras."
          request={{
            headers: {
              Authorization:
                "Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",
              "X-Service-ID": "ibnergra",
              "Content-Type": "application/json",
            },
            body: {
              reading: {
                interpretation: "A disposição das pedras indica...",
                energies: ["transformação", "clareza", "equilíbrio"],
              },
              colors: ["#8A2BE2", "#48D1CC", "#32CD32"],
              complexity: 5,
            },
          }}
          response={{
            success: {
              success: true,
              mandala: {
                imageUrl: "https://example.com/mandalas/12345.png",
                svgData: "<svg>...</svg>",
              },
            },
            error: {
              error: "Erro ao gerar mandala",
              details: "Parâmetros inválidos ou serviço indisponível",
            },
          }}
        />

        <h3 className="mb-4 mt-8 text-xl font-semibold">Pagamentos (PagBank)</h3>

        <Endpoint
          method="POST"
          path="/api/pagbank"
          description="Cria uma nova transação de pagamento via PagBank."
          request={{
            headers: {
              Authorization:
                "Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",
              "X-Service-ID": "ibnergra",
              "Content-Type": "application/json",
            },
            body: {
              customer: {
                name: "João Silva",
                email: "joao@example.com",
                tax_id: "12345678909",
                phones: [
                  {
                    country: "55",
                    area: "11",
                    number: "999999999",
                  },
                ],
              },
              items: [
                {
                  reference_id: "plano-mensal",
                  name: "Plano Mensal",
                  quantity: 1,
                  unit_amount: 2990,
                },
              ],
              payment_method: "credit_card",
              card_data: {
                number: "4111111111111111",
                holder: "João Silva",
                exp_month: "12",
                exp_year: "2025",
                security_code: "123",
              },
            },
          }}
          response={{
            success: {
              success: true,
              transaction: {
                id: "TRANS_123456789",
                status: "APPROVED",
                created_at: "2023-06-15T12:34:56.789Z",
                amount: {
                  value: 2990,
                  currency: "BRL",
                },
              },
            },
            error: {
              error: "Erro ao processar pagamento",
              details: "Cartão recusado ou dados inválidos",
            },
          }}
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Códigos de Status</h2>
        <div className="overflow-hidden rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Descrição
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">200</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">OK</td>
                <td className="px-6 py-4 text-sm text-gray-500">A requisição foi bem-sucedida.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">400</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Bad Request</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  A requisição contém parâmetros inválidos ou está mal formatada.
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">401</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Unauthorized</td>
                <td className="px-6 py-4 text-sm text-gray-500">Autenticação falhou ou não foi fornecida.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">403</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Forbidden</td>
                <td className="px-6 py-4 text-sm text-gray-500">O cliente não tem permissão para acessar o recurso.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">404</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Not Found</td>
                <td className="px-6 py-4 text-sm text-gray-500">O recurso solicitado não foi encontrado.</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">429</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Too Many Requests</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  O cliente enviou muitas requisições em um determinado período.
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">500</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Internal Server Error</td>
                <td className="px-6 py-4 text-sm text-gray-500">Ocorreu um erro interno no servidor.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Exemplos de Uso</h2>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Exemplo com cURL</h3>
          <CodeBlock
            language="bash"
            code={`curl -X POST \\
  "${"{BASE_URL}"}/api/analyze-stones" \\
  -H "Authorization: Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d" \\
  -H "X-Service-ID: ibnergra" \\
  -H "Content-Type: application/json" \\
  -d '{
  "stonePositions": [
    { "id": 1, "type": "ametista", "x": 0.2, "y": 0.3 },
    { "id": 2, "type": "quartzo", "x": 0.5, "y": 0.6 },
    { "id": 3, "type": "jade", "x": 0.8, "y": 0.4 }
  ],
  "question": "Qual o caminho para minha realização pessoal?"
}'`}
          />
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Exemplo com JavaScript (Node.js)</h3>
          <CodeBlock
            language="javascript"
            code={`const fetch = require('node-fetch');

async function analyzeStones() {
  const response = await fetch('${"{BASE_URL}"}/api/analyze-stones', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d',
      'X-Service-ID': 'ibnergra',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      stonePositions: [
        { id: 1, type: 'ametista', x: 0.2, y: 0.3 },
        { id: 2, type: 'quartzo', x: 0.5, y: 0.6 },
        { id: 3, type: 'jade', x: 0.8, y: 0.4 }
      ],
      question: 'Qual o caminho para minha realização pessoal?'
    })
  });
  
  const data = await response.json();
  console.log(data);
}

analyzeStones();`}
          />
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Exemplo com Python</h3>
          <CodeBlock
            language="python"
            code={`import requests
import json

url = "${"{BASE_URL}"}/api/analyze-stones"
headers = {
    "Authorization": "Bearer c46c4db7-a69a-434b-8270-9c26a9ebe5eb336f6c6b400bb9def9de8394f051a5f6c750-b367-415c-8302-9a704834704d",
    "X-Service-ID": "ibnergra",
    "Content-Type": "application/json"
}
payload = {
    "stonePositions": [
        {"id": 1, "type": "ametista", "x": 0.2, "y": 0.3},
        {"id": 2, "type": "quartzo", "x": 0.5, "y": 0.6},
        {"id": 3, "type": "jade", "x": 0.8, "y": 0.4}
    ],
    "question": "Qual o caminho para minha realização pessoal?"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()
print(data)`}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Limitações e Boas Práticas</h2>

        <div className="mb-4 rounded-md bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-semibold">Limites de Taxa</h3>
          <p className="text-sm text-gray-700">
            Para garantir a disponibilidade do serviço para todos os usuários, aplicamos os seguintes limites:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            <li>Máximo de 100 requisições por minuto por chave de API</li>
            <li>Máximo de 5.000 requisições por dia por chave de API</li>
            <li>Máximo de 10 requisições simultâneas por chave de API</li>
          </ul>
        </div>

        <div className="mb-4 rounded-md bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-semibold">Boas Práticas</h3>
          <ul className="list-inside list-disc text-sm text-gray-700">
            <li>Implemente cache do lado do cliente para reduzir o número de requisições</li>
            <li>Utilize compressão gzip para reduzir o tamanho das requisições e respostas</li>
            <li>Implemente retry com backoff exponencial para lidar com falhas temporárias</li>
            <li>Monitore o uso da API para evitar atingir os limites de taxa</li>
            <li>Mantenha sua chave de API segura e não a exponha no código do lado do cliente</li>
          </ul>
        </div>

        <div className="mb-4 rounded-md bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-semibold">Segurança</h3>
          <ul className="list-inside list-disc text-sm text-gray-700">
            <li>Todas as requisições devem ser feitas via HTTPS</li>
            <li>Nunca armazene dados sensíveis de usuários em logs ou caches</li>
            <li>Implemente validação de entrada para prevenir injeção de código</li>
            <li>Considere implementar CORS para restringir o acesso à API</li>
            <li>Rotacione suas chaves de API periodicamente</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Suporte</h2>
        <p className="mb-4">
          Se você encontrar problemas ou tiver dúvidas sobre a API, entre em contato com nossa equipe de suporte:
        </p>
        <ul className="list-inside list-disc text-gray-700">
          <li>Email: api-support@acaixaoracle.com</li>
          <li>Horário de atendimento: Segunda a Sexta, 9h às 18h (Horário de Brasília)</li>
        </ul>
      </section>
    </div>
  )
}
