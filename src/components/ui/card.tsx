import * as React from "react"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    RbacProps {
  hoverable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      requiredPermissions,
      requiredRoles,
      fallbackAction = "hidden",
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

    if (action === "hidden") return null

    const isDisabled = action === "disabled"
    const isReadOnly = action === "read-only"

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200",
          hoverable && !isDisabled && "hover:shadow-md hover:border-muted-foreground/30",
          isDisabled && "opacity-50 pointer-events-none cursor-not-allowed select-none",
          isReadOnly && "pointer-events-none border-dashed",
          className
        )}
        {...props}
      >
        {/* If disabled, add a subtle overlay to communicate locked status */}
        {isDisabled && (
          <div className="absolute inset-0 z-10 bg-background/20 backdrop-blur-[0.5px]" />
        )}
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground/90",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-border/50 mt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
