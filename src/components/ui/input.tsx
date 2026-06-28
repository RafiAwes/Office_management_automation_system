import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    RbacProps {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      requiredPermissions,
      requiredRoles,
      fallbackAction = "hidden",
      label,
      error,
      helperText,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

    if (action === "hidden") return null

    const isDisabled = disabled || action === "disabled"
    const isReadOnly = readOnly || action === "read-only"

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
              isReadOnly && "bg-muted/30 border-dashed focus-visible:ring-0 focus-visible:border-input cursor-default",
              error && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
              className
            )}
            ref={ref}
            disabled={isDisabled}
            readOnly={isReadOnly}
            {...props}
          />
        </div>
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
