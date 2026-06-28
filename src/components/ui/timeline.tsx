import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { Check, Loader2 } from "lucide-react"

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  time: string
  status?: "completed" | "in-progress" | "pending" | "failed"
}

export interface TimelineProps extends RbacProps {
  events: TimelineEvent[]
  className?: string
}

export function Timeline({
  events,
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: TimelineProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

  if (action === "hidden") return null

  const isDisabled = action === "disabled"

  const statusIcons = {
    completed: (
      <div className="h-6 w-6 rounded-full bg-success/15 dark:bg-success/20 border border-success flex items-center justify-center text-success">
        <Check className="h-3.5 w-3.5" />
      </div>
    ),
    "in-progress": (
      <div className="h-6 w-6 rounded-full bg-info/15 dark:bg-info/20 border border-info flex items-center justify-center text-info">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      </div>
    ),
    pending: (
      <div className="h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
        <div className="h-2 w-2 bg-muted-foreground/60 rounded-full" />
      </div>
    ),
    failed: (
      <div className="h-6 w-6 rounded-full bg-danger/15 dark:bg-danger/20 border border-danger flex items-center justify-center text-danger">
        <span className="text-xs font-bold font-sans">!</span>
      </div>
    ),
  }

  return (
    <div
      className={cn(
        "relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60",
        isDisabled && "opacity-50 pointer-events-none select-none",
        className
      )}
    >
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={event.id || index} className="relative">
            {/* Timeline Icon Node */}
            <div className="absolute -left-[30px] top-0 bg-background rounded-full">
              {statusIcons[event.status || "pending"]}
            </div>

            {/* Event Description Card */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                <span className="text-xs text-muted-foreground/80">{event.time}</span>
              </div>
              {event.description && (
                <p className="text-xs text-muted-foreground/90">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
