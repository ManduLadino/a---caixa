// Atualizando o footer com o novo tema
import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-cartomente-brown-darker/80 border-t border-cartomente-gold/30 text-cartomente-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-cinzel text-xl font-bold mb-4 text-cartomente-gold">Cartomente</h3>
            <p className="text-sm">
              Um oráculo digital que une cartas místicas à inteligência artificial para revelar insights profundos sobre
              seu caminho.
            </p>
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold mb-4 text-cartomente-gold">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-cartomente-gold transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/oraculo" className="hover:text-cartomente-gold transition-colors">
                  Oráculo
                </Link>
              </li>
              <li>
                <Link href="/historico" className="hover:text-cartomente-gold transition-colors">
                  Histórico
                </Link>
              </li>
              <li>
                <Link href="/assinatura" className="hover:text-cartomente-gold transition-colors">
                  Assinatura
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold mb-4 text-cartomente-gold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos" className="hover:text-cartomente-gold transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-cartomente-gold transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-cartomente-gold transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold mb-4 text-cartomente-gold">Contato</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-cartomente-cream hover:text-cartomente-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-cartomente-cream hover:text-cartomente-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-cartomente-cream hover:text-cartomente-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a
                href="mailto:contato@cartomente.com"
                className="text-cartomente-cream hover:text-cartomente-gold transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm">contato@cartomente.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-cartomente-gold/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Cartomente. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
