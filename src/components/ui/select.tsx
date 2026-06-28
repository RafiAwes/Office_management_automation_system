import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { ChevronDown } from "lucide-react"

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    RbacProps {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      requiredPermissions,
      requiredRoles,
      fallbackAction = "hidden",
      label,
      error,
      helperText,
      disabled,
      ...props
    },
    ref
  ) => {
    const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

    if (action === "hidden") return null

    const isDisabled = disabled || action === "disabled"
    const isReadOnly = action === "read-only"

    // Find the label of the currently selected option for read-only view
    const selectedOption = options.find((opt) => opt.value === (props.value || props.defaultValue))
    const displayValue = selectedOption ? selectedOption.label : "None selected"

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        
        {isReadOnly ? (
          // In read-only mode, render a clean, styled text box instead of an active dropdown
          <div className="flex h-9 w-full items-center rounded-md border border-dashed border-input bg-muted/30 px-3 py-1 text-sm text-foreground/80 cursor-default select-none">
            {displayValue}
          </div>
        ) : (
          <div className="relative">
            <select
              className={cn(
                "flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 pr-10 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
                className
              )}
              ref={ref}
              disabled={isDisabled}
              {...props}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background text-foreground">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 pointer-events-none text-muted-foreground/70" />
          </div>
        )}

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
Select.displayName = "Select"

export { Select }
