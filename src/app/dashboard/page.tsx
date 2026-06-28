"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES, Role } from "@/lib/rbac/roles"
import { Permission, PERMISSIONS } from "@/lib/rbac/permissions"
import { useTheme } from "next-themes"

// Import dashboards
import { SuperAdminDashboard } from "@/features/dashboards/components/super-admin-dashboard"
import { CeoDashboard } from "@/features/dashboards/components/ceo-dashboard"
import { OperationsDashboard } from "@/features/dashboards/components/operations-dashboard"
import { HrDashboard } from "@/features/dashboards/components/hr-dashboard"
import { FinanceDashboard } from "@/features/dashboards/components/finance-dashboard"
import { SalesDashboard } from "@/features/dashboards/components/sales-dashboard"
import { ProjectDashboard } from "@/features/dashboards/components/project-dashboard"
import { EmployeeDashboard } from "@/features/dashboards/components/employee-dashboard"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, login } = useAuthStore()
  const { theme, setTheme } = useTheme()

  // Setup initial mock admin user if not present (helps preview showcase immediately)
  React.useEffect(() => {
    if (!user) {
      handleRoleSwitch(ROLES.SUPER_ADMIN)
    }
  }, [user])

  // Quick switch role utility
  const handleRoleSwitch = (newRole: Role) => {
    // Determine permissions for the selected role
    let perms: Permission[] = [PERMISSIONS.DASHBOARD_VIEW]

    if (newRole === ROLES.SUPER_ADMIN) {
      perms = Object.values(PERMISSIONS)
    } else if (newRole === ROLES.CEO) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.CRM_VIEW,
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.HR_VIEW,
        PERMISSIONS.FINANCE_VIEW,
        PERMISSIONS.PROJECT_VIEW,
        PERMISSIONS.OKR_VIEW,
      ]
    } else if (newRole === ROLES.FINANCE_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.FINANCE_VIEW,
        PERMISSIONS.FINANCE_MANAGE,
      ]
    } else if (newRole === ROLES.HR_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.HR_VIEW,
        PERMISSIONS.HR_MANAGE,
      ]
    } else if (newRole === ROLES.OPERATIONS_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.CRM_VIEW,
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_MANAGE,
        PERMISSIONS.PROJECT_VIEW,
        PERMISSIONS.PROJECT_MANAGE,
        PERMISSIONS.OKR_VIEW,
        PERMISSIONS.OKR_MANAGE,
      ]
    } else if (newRole === ROLES.SALES_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.CRM_VIEW,
        PERMISSIONS.CRM_CREATE,
        PERMISSIONS.CRM_UPDATE,
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.SALES_CREATE,
      ]
    } else if (newRole === ROLES.PROJECT_MANAGER) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.PROJECT_VIEW,
        PERMISSIONS.PROJECT_MANAGE,
        PERMISSIONS.OKR_VIEW,
      ]
    } else if (newRole === ROLES.EMPLOYEE) {
      perms = [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.PROJECT_VIEW,
      ]
    }

    login(
      {
        id: "1",
        name: `GlowHaat ${newRole.replace("_", " ")}`,
        email: `${newRole.toLowerCase()}@glowhaat.com`,
        role: newRole,
        permissions: perms,
      },
      "active-mock-session-token"
    )
  }

  const renderActiveDashboard = () => {
    if (!user) return null

    switch (user.role) {
      case ROLES.SUPER_ADMIN:
        return <SuperAdminDashboard />
      case ROLES.CEO:
        return <CeoDashboard />
      case ROLES.OPERATIONS_MANAGER:
        return <OperationsDashboard />
      case ROLES.HR_MANAGER:
        return <HrDashboard />
      case ROLES.FINANCE_MANAGER:
        return <FinanceDashboard />
      case ROLES.SALES_MANAGER:
        return <SalesDashboard />
      case ROLES.PROJECT_MANAGER:
        return <ProjectDashboard />
      case ROLES.EMPLOYEE:
      default:
        return <EmployeeDashboard />
    }
  }

  if (!user) return null

  const formattedRoleName = user.role.replace(/_/g, " ")

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header & Preview Switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
            {formattedRoleName} Workspace
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Role-Based GlowHaat Business Operations Dashboard.
          </p>
        </div>

        {/* Action switch controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1.5 shadow-sm">
            <span className="text-[10px] font-bold px-1.5 text-muted-foreground uppercase">Preview Role:</span>
            <select
              value={user.role}
              onChange={(e) => handleRoleSwitch(e.target.value as Role)}
              className="text-xs font-semibold bg-transparent focus:outline-none cursor-pointer pr-1 text-foreground"
            >
              <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
              <option value={ROLES.CEO}>CEO / Business Owner</option>
              <option value={ROLES.OPERATIONS_MANAGER}>Operations Manager</option>
              <option value={ROLES.HR_MANAGER}>HR Manager</option>
              <option value={ROLES.FINANCE_MANAGER}>Finance Manager</option>
              <option value={ROLES.SALES_MANAGER}>Sales Manager</option>
              <option value={ROLES.PROJECT_MANAGER}>Project Manager</option>
              <option value={ROLES.EMPLOYEE}>Employee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security profile indicator */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <span className="font-semibold text-foreground">User Session: </span>
                <span className="text-muted-foreground">{user.name} ({user.email})</span>
              </div>
            </div>
            <div className="text-muted-foreground sm:text-right">
              <span className="font-semibold">Security Token: </span>
              <span className="font-mono bg-background/50 px-1 py-0.5 rounded text-[11px] text-foreground">
                active-mock-session-token
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main active sub-dashboard element */}
      <div className="min-h-[50vh]">
        {renderActiveDashboard()}
      </div>
    </div>
  )
}
