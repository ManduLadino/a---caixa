"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"

export default function MobileRedirect() {
  const isMobile = useMobile()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Se for um dispositivo móvel e não estiver já na versão mobile
    if (isMobile && !pathname.startsWith("/mobile")) {
      router.push("/mobile")
    }

    // Se não for um dispositivo móvel e estiver na versão mobile
    if (!isMobile && pathname.startsWith("/mobile")) {
      router.push("/")
    }
  }, [isMobile, pathname, router])

  return null
}
