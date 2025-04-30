import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Cinzel } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AppContextProvider } from "@/contexts/app-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Cartomente - A CAIXA",
  description: "Descubra os mistérios do seu destino através das pedras místicas e da sabedoria ancestral",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AppContextProvider>{children}</AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
