"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function Footer3D() {
  return (
    <motion.footer
      className="bg-black/80 backdrop-blur-md text-amber-100 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-amber-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/gabinete-3d" className="text-sm hover:text-amber-400 transition-colors">
                  Gabinete 3D
                </Link>
              </li>
              <li>
                <Link href="/caixa-mistica" className="text-sm hover:text-amber-400 transition-colors">
                  Caixa Mística
                </Link>
              </li>
              <li>
                <Link href="/historico" className="text-sm hover:text-amber-400 transition-colors">
                  Histórico
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Contato</h3>
            <p className="text-sm mb-2">Tem dúvidas sobre sua leitura?</p>
            <Link
              href="/contato"
              className="inline-block px-4 py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 rounded-md text-sm transition-colors"
            >
              Entre em contato
            </Link>
            <p className="text-xs text-amber-100/50 mt-4">
              &copy; {new Date().getFullYear()} A CAIXA - Oráculo Místico. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex justify-end items-center">
            <div className="relative h-32 w-32">
              <Image
                src="/images/a-caixa-logo.png"
                alt="A CAIXA - Oráculo Místico"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
