"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { Button } from "./button"
import { AlertCircle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"

export interface ErrorStateProps extends RbacProps {
  title?: string
  message: string
  errorDetails?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = "An Error Occurred",
  message,
  errorDetails,
  onRetry,
  retryLabel = "Retry",
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
}: ErrorStateProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })
  const [showDetails, setShowDetails] = React.useState(false)

  if (action === "hidden") return null

  const isDisabled = action === "disabled"
  const isReadOnly = action === "read-only"

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-danger/30 rounded-xl bg-danger/5 max-w-md mx-auto my-6 shadow-sm",
        isDisabled && "opacity-50 pointer-events-none select-none",
        className
      )}
    >
      <div className="rounded-full p-4 bg-danger/10 text-danger mb-4 border border-danger/25">
        <AlertCircle className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-danger">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-[320px]">
        {message}
      </p>

      {errorDetails && (
        <div className="w-full mt-4">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-center gap-1 mx-auto text-xs text-muted-foreground hover:text-foreground font-semibold"
          >
            {showDetails ? (
              <>
                Hide Technical Details <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show Technical Details <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
          {showDetails && (
            <pre className="mt-2 p-3 text-[10px] text-left text-danger/80 bg-danger/5 border border-danger/20 rounded-md overflow-x-auto font-mono max-h-32">
              {errorDetails}
            </pre>
          )}
        </div>
      )}

      {onRetry && !isReadOnly && (
        <Button
          onClick={onRetry}
          disabled={isDisabled}
          className="mt-5 bg-danger hover:bg-danger/90 text-danger-foreground"
          size="sm"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          {retryLabel}
        </Button>
      )}

      {isReadOnly && (
        <span className="text-xs text-muted-foreground/75 mt-5 italic">
          Action requests are locked in read-only mode.
        </span>
      )}
    </div>
  )
}
