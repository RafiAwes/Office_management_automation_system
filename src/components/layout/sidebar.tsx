"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { navigationConfig, NavItem } from "@/config/navigation"
import { ChevronLeft, ChevronRight, LogOut, ShieldAlert } from "lucide-react"

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuthStore()

  // Helper component to filter list items by permissions
  const FilteredNavItem = ({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) => {
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
          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="truncate"
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    )
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col h-screen sticky top-0 border-r border-border bg-card shadow-sm z-30 select-none overflow-hidden"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4.5 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent shadow-sm text-primary-foreground font-black text-lg">
            G
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              GlowHaat
            </motion.span>
          )}
        </Link>

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3.5 py-6 space-y-6 scrollbar-thin">
        {navigationConfig.map((group, gIndex) => {
          // Check if any items inside the group are visible to current user
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
              {!isCollapsed && (
                <motion.h5
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3.5 mb-2"
                >
                  {group.groupName}
                </motion.h5>
              )}
              <div className="space-y-1">
                {group.items.map((item, iIndex) => (
                  <FilteredNavItem key={iIndex} item={item} isCollapsed={isCollapsed} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer / Toggles */}
      <div className="p-3.5 border-t border-border/50 space-y-2 bg-muted/10">
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={() => logout()}
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-danger hover:bg-danger/10 w-full transition-all duration-200",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </motion.aside>
  )
}
