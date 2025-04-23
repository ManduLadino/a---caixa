export function Header() {
  return (
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
      <p className="text-xl text-white">Formulário de Cadastro e Renovação de Pacientes (TFD/CERAC)</p>
    </div>
  )
}
