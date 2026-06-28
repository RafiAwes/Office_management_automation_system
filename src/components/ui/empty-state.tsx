import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { Button } from "./button"
import { FolderOpen, LucideIcon } from "lucide-react"

export interface EmptyStateProps extends RbacProps {
  title: string
  description: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: EmptyStateProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

  if (action === "hidden") return null

  const isDisabled = action === "disabled"
  const isReadOnly = action === "read-only"

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-card/30 max-w-md mx-auto my-6 shadow-sm",
        isDisabled && "opacity-50 pointer-events-none select-none",
        className
      )}
    >
      <div className="rounded-full p-4 bg-muted/40 text-muted-foreground/80 mb-4 border border-border/50">
        <Icon className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-[280px]">
        {description}
      </p>

      {actionLabel && onAction && !isReadOnly && (
        <Button
          onClick={onAction}
          disabled={isDisabled}
          className="mt-5"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}

      {isReadOnly && (
        <span className="text-xs text-muted-foreground/75 mt-5 italic">
          No records found. Creating new entries is disabled.
        </span>
      )}
    </div>
  )
}
