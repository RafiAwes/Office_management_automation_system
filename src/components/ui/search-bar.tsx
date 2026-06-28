"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { Search, SlidersHorizontal, X } from "lucide-react"

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    RbacProps {
  onSearch?: (value: string) => void
  onToggleFilters?: () => void
  showFilterButton?: boolean
}

export function SearchBar({
  className,
  onSearch,
  onToggleFilters,
  showFilterButton = false,
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  disabled,
  placeholder = "Search records...",
  ...props
}: SearchBarProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })
  const [value, setValue] = React.useState("")

  if (action === "hidden") return null

  const isDisabled = disabled || action === "disabled"
  const isReadOnly = action === "read-only"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)
    onSearch?.(val)
  }

  const handleClear = () => {
    if (isDisabled || isReadOnly) return
    setValue("")
    onSearch?.("")
  }

  return (
    <div className={cn("relative flex items-center gap-2 w-full max-w-md", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/75" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={isDisabled}
          readOnly={isReadOnly}
          placeholder={isReadOnly ? "Search is disabled in read-only mode..." : placeholder}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-9 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            isReadOnly && "bg-muted/30 border-dashed cursor-default focus-visible:ring-0 focus-visible:border-input",
          )}
          {...props}
        />
        {value && !isDisabled && !isReadOnly && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-2.5 hover:text-foreground text-muted-foreground/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showFilterButton && (
        <button
          type="button"
          onClick={onToggleFilters}
          disabled={isDisabled || isReadOnly}
          className={cn(
            "flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm",
            isReadOnly && "opacity-50 pointer-events-none"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      )}
    </div>
  )
}
