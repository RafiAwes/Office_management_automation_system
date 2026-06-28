import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { Check, Info, AlertTriangle, X } from "lucide-react"

export interface NotificationItemProps extends RbacProps {
  id: string
  title: string
  message: string
  timestamp: string
  type?: "info" | "success" | "warning" | "danger"
  read?: boolean
  onMarkRead?: (id: string) => void
  onDismiss?: (id: string) => void
  className?: string
}

export function NotificationItem({
  id,
  title,
  message,
  timestamp,
  type = "info",
  read = false,
  onMarkRead,
  onDismiss,
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: NotificationItemProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

  if (action === "hidden") return null

  const isDisabled = action === "disabled"
  const isReadOnly = action === "read-only"

  const typeConfig = {
    info: {
      color: "border-info bg-info/5 dark:bg-info/10 text-info",
      icon: Info,
    },
    success: {
      color: "border-success bg-success/5 dark:bg-success/10 text-success",
      icon: Check,
    },
    warning: {
      color: "border-warning bg-warning/5 dark:bg-warning/10 text-warning",
      icon: AlertTriangle,
    },
    danger: {
      color: "border-danger bg-danger/5 dark:bg-danger/10 text-danger",
      icon: AlertTriangle,
    },
  }

  const { color, icon: Icon } = typeConfig[type]

  return (
    <div
      className={cn(
        "relative flex gap-3.5 items-start p-4 rounded-xl border border-border bg-card shadow-sm transition-all duration-200",
        !read && "border-l-4",
        !read && color.split(" ")[0], // Use border-l-* status color
        isDisabled && "opacity-50 pointer-events-none select-none",
        isReadOnly && "border-dashed",
        className
      )}
    >
      {/* Icon */}
      <div className={cn("rounded-lg p-2 bg-muted/40", color.split(" ").slice(1).join(" "))}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Info details */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <p className="text-xs text-muted-foreground/90">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 self-center">
        {onMarkRead && !read && !isReadOnly && (
          <button
            onClick={() => !isDisabled && onMarkRead?.(id)}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground/80 hover:text-foreground transition-colors"
            title="Mark as Read"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        {onDismiss && !isReadOnly && (
          <button
            onClick={() => !isDisabled && onDismiss?.(id)}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground/80 hover:text-foreground transition-colors"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
