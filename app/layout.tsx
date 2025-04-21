import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/contexts/app-context"
import MobileRedirect from "@/components/mobile-redirect"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "A CAIXA – Oráculo Digital com IA",
  description: "Um oráculo digital que une misticismo ancestral à inteligência artificial",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AppProvider>
            <MobileRedirect />
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
