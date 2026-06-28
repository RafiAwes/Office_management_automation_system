"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { navigationConfig, NavItem } from "@/config/navigation"
import { X, LogOut } from "lucide-react"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { logout, user } = useAuthStore()

  // Close nav on pathname changes
  React.useEffect(() => {
    onClose()
  }, [pathname])

  const FilteredNavItem = ({ item }: { item: NavItem }) => {
    const { isAllowed } = useRbac({
      requiredPermissions: item.requiredPermissions,
      requiredRoles: item.requiredRoles,
    })

    if (!isAllowed) return null

    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span>{item.title}</span>
      </Link>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-start select-none">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Nav Drawer Slide Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-xs h-full bg-card border-r border-border shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-5 border-b border-border/50">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent shadow-sm text-primary-foreground font-black text-lg">
                  G
                </div>
                <span className="text-lg font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  GlowHaat
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-1 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {navigationConfig.map((group, gIndex) => {
                const visibleItems = group.items.map((item) => {
                  const { isAllowed } = useRbac({
                    requiredPermissions: item.requiredPermissions,
                    requiredRoles: item.requiredRoles,
                  })
                  return isAllowed
                })

                const hasVisibleItems = visibleItems.some((visible) => visible === true)

                if (!hasVisibleItems) return null

                return (
                  <div key={gIndex} className="space-y-1.5">
                    <h5 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-4 mb-2">
                      {group.groupName}
                    </h5>
                    <div className="space-y-1">
                      {group.items.map((item, iIndex) => (
                        <FilteredNavItem key={iIndex} item={item} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 bg-muted/10 space-y-2">
              <div className="px-4 py-2 border border-border rounded-xl bg-card flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm uppercase">
                  {user?.name.slice(0, 2)}
                </div>
                <div className="text-left truncate">
                  <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase truncate">{user?.role.replace("_", " ")}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-danger hover:bg-danger/10 w-full transition-all duration-200"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
