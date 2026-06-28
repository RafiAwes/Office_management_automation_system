"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { SlidersHorizontal } from "lucide-react"

export interface AnalyticsCardProps extends RbacProps {
  title: string
  description?: string
  filterOptions?: string[]
  onFilterChange?: (filter: string) => void
  children: React.ReactNode
  className?: string
}

export function AnalyticsCard({
  title,
  description,
  filterOptions = [],
  onFilterChange,
  children,
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: AnalyticsCardProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })
  const [selectedFilter, setSelectedFilter] = React.useState(filterOptions[0] || "")

  if (action === "hidden") return null

  const isDisabled = action === "disabled"
  const isReadOnly = action === "read-only"

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDisabled || isReadOnly) return
    const val = e.target.value
    setSelectedFilter(val)
    onFilterChange?.(val)
  }

  return (
    <Card
      className={cn(
        "flex flex-col shadow-sm transition-all duration-200",
        isDisabled && "opacity-50 pointer-events-none select-none",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>

        {filterOptions.length > 0 && (
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/60" />
            <select
              value={selectedFilter}
              onChange={handleFilterChange}
              disabled={isDisabled || isReadOnly}
              className={cn(
                "rounded border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50",
                isReadOnly && "pointer-events-none bg-muted/20 border-dashed"
              )}
            >
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        {children}
      </CardContent>
      {isReadOnly && (
        <div className="text-center py-1.5 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground/70 bg-muted/20 border-t border-dashed">
          Analytical data restricted to read-only views
        </div>
      )}
    </Card>
  )
}
