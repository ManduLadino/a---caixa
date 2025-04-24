import type { ReactNode } from "react"
import MobileNavbar from "@/components/mobile-navbar"
import MobileFooter from "@/components/mobile-footer"

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MobileNavbar />
      <main className="flex-grow">{children}</main>
      <MobileFooter />
    </div>
  )
}
