"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRbac, RbacProps } from "@/hooks/use-rbac"
import { X } from "lucide-react"

export interface ModalProps extends RbacProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Modal({
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
}: ModalProps) {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg flex flex-col max-h-[85vh]",
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

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto text-sm text-foreground/80">
            {children}
          </div>

          {/* Footer (only show if not read-only or customizable) */}
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
