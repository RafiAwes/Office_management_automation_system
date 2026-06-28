"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { X } from "lucide-react"

export interface DrawerProps extends RbacProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  position?: "right" | "left"
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  requiredPermissions,
  requiredRoles,
  fallbackAction = "hidden",
  className,
  position = "right",
}: DrawerProps) {
  const { action } = useRbac({ requiredPermissions, requiredRoles, fallbackAction })

  // Lock scroll on open
  React.useEffect(() => {
    if (isOpen && action !== "hidden") {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, action])

  if (action === "hidden" || !isOpen) return null

  const isDisabled = action === "disabled"
  const isReadOnly = action === "read-only"

  const drawerVariants = {
    hidden: { x: position === "right" ? "100%" : "-100%" },
    visible: { x: 0 },
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Drawer Slide Panel */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={drawerVariants}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "relative z-10 w-full max-w-md h-full bg-card border-l border-border text-card-foreground shadow-2xl flex flex-col justify-between",
            position === "left" && "border-r border-l-0 mr-auto",
            isDisabled && "opacity-60 pointer-events-none select-none",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border/50">
            <div className="space-y-1">
              {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 hover:bg-muted text-muted-foreground/75 hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 p-6 overflow-y-auto text-sm text-foreground/80">
            {children}
          </div>

          {/* Footer (only if not read-only) */}
          {footer && !isReadOnly && (
            <div className="flex items-center justify-end gap-2 p-6 border-t border-border/50 bg-muted/20">
              {footer}
            </div>
          )}

          {isReadOnly && (
            <div className="p-3 text-center text-xs bg-muted/30 border-t border-dashed text-muted-foreground">
              Viewing in Read-Only Mode. Submissions are disabled.
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
