import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react"

export interface KpiCardProps extends RbacProps {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  trend?: {
    value: number
    label?: string
    isPositive?: boolean
  }
  status?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  status = "default",
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: KpiCardProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

  if (action === "hidden") return null

  const isDisabled = action === "disabled"
  const isReadOnly = action === "read-only"

  const statusColors = {
    default: "text-primary border-border",
    success: "text-success border-success/30 bg-success/5 dark:bg-success/10",
    warning: "text-warning border-warning/30 bg-warning/5 dark:bg-warning/10",
    danger: "text-danger border-danger/30 bg-danger/5 dark:bg-danger/10",
    info: "text-info border-info/30 bg-info/5 dark:bg-info/10",
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-200",
        statusColors[status],
        isDisabled && "opacity-50 pointer-events-none select-none",
        isReadOnly && "border-dashed",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={cn(
            "rounded-lg p-2 bg-muted/40",
            status !== "default" && "bg-background/80"
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
      </div>

      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold rounded px-1.5 py-0.5",
                trend.isPositive
                  ? "bg-success/10 text-success dark:bg-success/20"
                  : "bg-danger/10 text-danger dark:bg-danger/20"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}%
            </span>
          )}
          {description && <span className="text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  )
}
