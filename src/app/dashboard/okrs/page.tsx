"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OkrsLegacyRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/okr/dashboard")
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center text-xs text-muted-foreground">
      Redirecting to OKR Dashboard...
    </div>
  )
}
