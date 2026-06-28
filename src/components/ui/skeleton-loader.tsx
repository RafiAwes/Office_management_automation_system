import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"

export interface SkeletonLoaderProps extends RbacProps {
  variant?: "text" | "circle" | "card" | "table"
  count?: number
  className?: string
}

export function SkeletonLoader({
  variant = "text",
  count = 1,
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: SkeletonLoaderProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

  if (action === "hidden") return null

  const items = Array.from({ length: count })

  const renderSkeleton = () => {
    switch (variant) {
      case "circle":
        return <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
      case "card":
        return (
          <div className="border border-border rounded-xl p-6 bg-card space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-muted rounded animate-pulse" />
              <div className="h-3.5 w-full bg-muted rounded animate-pulse" />
              <div className="h-3.5 w-2/3 bg-muted rounded animate-pulse" />
            </div>
          </div>
        )
      case "table":
        return (
          <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm space-y-3 p-4">
            <div className="h-8 w-full bg-muted/60 rounded animate-pulse mb-4" />
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="h-3.5 w-[20%] bg-muted rounded animate-pulse" />
                <div className="h-3.5 w-[40%] bg-muted rounded animate-pulse" />
                <div className="h-3.5 w-[15%] bg-muted rounded animate-pulse" />
                <div className="h-3.5 w-[25%] bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        )
      case "text":
      default:
        return <div className="h-4 w-full bg-muted rounded animate-pulse" />
    }
  }

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {items.map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  )
}
