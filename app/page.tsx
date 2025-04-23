import PacienteDataForm from "@/components/paciente-data-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-green-700 text-white py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
            <div className="w-32 h-32 relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d0b8809d7a364909f5ed65f1fcefc0a19b48b154c18f4f797ee94ab08885576d-9rqWDKEk4rBiWmq1ZU8MWHzH2oIPsP.png"
                alt="Produto CBD MANDU"
                className="object-contain"
              />
            </div>
            <div className="w-32 h-32 relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IAMGEM%20EM%20BLAHAGEM-EMSCC.png"
                alt="Logo CBD MANDU"
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Projeto MANDU CANNABINIO</h1>
          <p className="text-xl text-white">Sistema de Gerenciamento de Pacientes</p>
        </div>

        <PacienteDataForm />
      </div>
    </main>
  )
}
