"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()
  
  const pathSegments = React.useMemo(() => {
    if (!pathname) return []
    return pathname.split("/").filter((segment) => segment !== "")
  }, [pathname])

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground/80">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`
        const isLast = index === pathSegments.length - 1
        const formattedName = segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3 w-3 text-muted-foreground/45 flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
                {formattedName}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-none"
              >
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
