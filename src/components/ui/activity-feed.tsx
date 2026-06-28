import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { LucideIcon } from "lucide-react"

export interface ActivityItem {
  id: string
  user: {
    name: string
    avatar?: string
    role?: string
  }
  action: string
  target?: string
  timestamp: string
  icon?: LucideIcon
  iconBg?: string
  details?: string
}

export interface ActivityFeedProps extends RbacProps {
  items: ActivityItem[]
  onItemAction?: (item: ActivityItem) => void
  actionLabel?: string
  className?: string
}

export function ActivityFeed({
  items,
  onItemAction,
  actionLabel = "Review",
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: ActivityFeedProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

  if (action === "hidden") return null

  const isDisabled = action === "disabled"
  const isReadOnly = action === "read-only"

  return (
    <div className={cn("space-y-6", className)}>
      <ul className={cn(
        "space-y-4",
        isDisabled && "opacity-50 pointer-events-none select-none"
      )}>
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <li key={item.id || index} className="flex gap-4 items-start group">
              {/* Icon Container */}
              <div className={cn(
                "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-border shadow-sm",
                item.iconBg || "bg-muted/50 text-muted-foreground"
              )}>
                {Icon ? <Icon className="h-4 w-4" /> : <div className="h-2 w-2 bg-foreground/60 rounded-full" />}
              </div>

              {/* Content Panel */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm text-foreground/80">
                    <span className="font-semibold text-foreground">{item.user.name}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>{" "}
                    {item.target && <span className="font-medium text-foreground">{item.target}</span>}
                  </p>
                  <span className="text-xs text-muted-foreground/80 whitespace-nowrap">{item.timestamp}</span>
                </div>
                {item.user.role && (
                  <span className="inline-block text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-wider">
                    {item.user.role}
                  </span>
                )}
                {item.details && (
                  <p className="mt-1 text-xs text-muted-foreground/90 bg-muted/20 p-2 rounded-md border border-border/40 font-mono">
                    {item.details}
                  </p>
                )}
              </div>

              {/* Action Button (hidden in read-only mode) */}
              {onItemAction && !isReadOnly && (
                <button
                  type="button"
                  onClick={() => !isDisabled && onItemAction?.(item)}
                  className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-primary hover:underline transition-opacity px-2 py-1 rounded hover:bg-muted/40"
                >
                  {actionLabel}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
