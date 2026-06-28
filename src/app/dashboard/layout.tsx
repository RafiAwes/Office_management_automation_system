"use client"

import * as React from "react"
import { RouteGuard } from "@/components/layout/RouteGuard"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PERMISSIONS } from "@/lib/rbac/permissions"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <RouteGuard requiredPermissions={[PERMISSIONS.DASHBOARD_VIEW]}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Left side collapsible sidebar (desktop only) */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Right side page content */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top header navigation */}
          <Navbar onToggleMobileNav={() => setMobileNavOpen(true)} />

          {/* Page Scrollable Area */}
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-background/50 scrollbar-thin">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Navigation Panel */}
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      </div>
    </RouteGuard>
  )
}
