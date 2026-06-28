"use client"

import { useRouter } from "next/navigation"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background/50 text-foreground selection:bg-primary/20 px-6">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="mx-auto rounded-full p-4 bg-danger/10 text-danger border border-danger/20 w-16 h-16 flex items-center justify-center animate-bounce">
          <ShieldAlert className="h-8 w-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight uppercase text-foreground/90">
            Access Restricted
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your current operational profile does not hold the permissions or roles required to access this resource. Please contact your system administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto"
          >
            <Home className="mr-1.5 h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
