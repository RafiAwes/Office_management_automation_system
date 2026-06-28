"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Check, 
  X, 
  Save, 
  HelpCircle,
  Activity
} from "lucide-react"

interface MatrixRow {
  permission: string
  description: string
  [ROLES.SUPER_ADMIN]: boolean
  [ROLES.CEO]: boolean
  [ROLES.OPERATIONS_MANAGER]: boolean
  [ROLES.HR_MANAGER]: boolean
  [ROLES.FINANCE_MANAGER]: boolean
  [ROLES.SALES_MANAGER]: boolean
  [ROLES.PROJECT_MANAGER]: boolean
  [ROLES.EMPLOYEE]: boolean
}

export default function PermissionMatrixPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Gating Check
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN

  React.useEffect(() => {
    if (!isSuperAdmin && user) {
      router.push("/unauthorized")
    }
  }, [isSuperAdmin, user])

  // Roles array for headers
  const rolesList = [
    ROLES.SUPER_ADMIN,
    ROLES.CEO,
    ROLES.OPERATIONS_MANAGER,
    ROLES.HR_MANAGER,
    ROLES.FINANCE_MANAGER,
    ROLES.SALES_MANAGER,
    ROLES.PROJECT_MANAGER,
    ROLES.EMPLOYEE,
  ]

  // Permission keys mapping
  const [matrix, setMatrix] = React.useState<MatrixRow[]>([
    {
      permission: PERMISSIONS.DASHBOARD_VIEW,
      description: "Access main landing metrics panel.",
      [ROLES.SUPER_ADMIN]: true,
      [ROLES.CEO]: true,
      [ROLES.OPERATIONS_MANAGER]: true,
      [ROLES.HR_MANAGER]: true,
      [ROLES.FINANCE_MANAGER]: true,
      [ROLES.SALES_MANAGER]: true,
      [ROLES.PROJECT_MANAGER]: true,
      [ROLES.EMPLOYEE]: true,
    },
    {
      permission: PERMISSIONS.CRM_VIEW,
      description: "View leads, customers, and opportunities.",
      [ROLES.SUPER_ADMIN]: true,
      [ROLES.CEO]: true,
      [ROLES.OPERATIONS_MANAGER]: true,
      [ROLES.HR_MANAGER]: false,
      [ROLES.FINANCE_MANAGER]: false,
      [ROLES.SALES_MANAGER]: true,
      [ROLES.PROJECT_MANAGER]: false,
      [ROLES.EMPLOYEE]: false,
    },
    {
      permission: PERMISSIONS.SALES_VIEW,
      description: "Access quotations, orders, and sales funnel reports.",
      [ROLES.SUPER_ADMIN]: true,
      [ROLES.CEO]: true,
      [ROLES.OPERATIONS_MANAGER]: false,
      [ROLES.HR_MANAGER]: false,
      [ROLES.FINANCE_MANAGER]: false,
      [ROLES.SALES_MANAGER]: true,
      [ROLES.PROJECT_MANAGER]: false,
      [ROLES.EMPLOYEE]: false,
    },
    {
      permission: PERMISSIONS.HR_VIEW,
      description: "Inspect employee rosters, clock logs, and check details.",
      [ROLES.SUPER_ADMIN]: true,
      [ROLES.CEO]: true,
      [ROLES.OPERATIONS_MANAGER]: false,
      [ROLES.HR_MANAGER]: true,
      [ROLES.FINANCE_MANAGER]: false,
      [ROLES.SALES_MANAGER]: false,
      [ROLES.PROJECT_MANAGER]: false,
      [ROLES.EMPLOYEE]: false,
    },
    {
      permission: PERMISSIONS.FINANCE_VIEW,
      description: "Review net P&L ledgers and financial reports.",
      [ROLES.SUPER_ADMIN]: true,
      [ROLES.CEO]: true,
      [ROLES.OPERATIONS_MANAGER]: false,
      [ROLES.HR_MANAGER]: false,
      [ROLES.FINANCE_MANAGER]: true,
      [ROLES.SALES_MANAGER]: false,
      [ROLES.PROJECT_MANAGER]: false,
      [ROLES.EMPLOYEE]: false,
    },
    {
      permission: PERMISSIONS.INVENTORY_VIEW,
      description: "Inspect stock levels, warehouses, and purchase orders.",
      [ROLES.SUPER_ADMIN]: true,
      [ROLES.CEO]: true,
      [ROLES.OPERATIONS_MANAGER]: true,
      [ROLES.HR_MANAGER]: false,
      [ROLES.FINANCE_MANAGER]: false,
      [ROLES.SALES_MANAGER]: false,
      [ROLES.PROJECT_MANAGER]: false,
      [ROLES.EMPLOYEE]: false,
    },
    {
      permission: PERMISSIONS.PROJECT_VIEW,
      description: "View project dashboards, milestones, and task check boards.",
      [ROLES.SUPER_ADMIN]: true,
      [ROLES.CEO]: true,
      [ROLES.OPERATIONS_MANAGER]: true,
      [ROLES.HR_MANAGER]: false,
      [ROLES.FINANCE_MANAGER]: false,
      [ROLES.SALES_MANAGER]: false,
      [ROLES.PROJECT_MANAGER]: true,
      [ROLES.EMPLOYEE]: true,
    },
    {
      permission: PERMISSIONS.SETTINGS_MANAGE,
      description: "Access control panels, IAM directories, and roles configuration.",
      [ROLES.SUPER_ADMIN]: true,
      [ROLES.CEO]: false,
      [ROLES.OPERATIONS_MANAGER]: false,
      [ROLES.HR_MANAGER]: false,
      [ROLES.FINANCE_MANAGER]: false,
      [ROLES.SALES_MANAGER]: false,
      [ROLES.PROJECT_MANAGER]: false,
      [ROLES.EMPLOYEE]: false,
    },
  ])

  if (!isSuperAdmin) return null

  const handleToggleCell = (permissionName: string, roleName: string) => {
    // Super Admins shouldn't lose dashboard view or settings manage to prevent lockout
    if (roleName === ROLES.SUPER_ADMIN) return

    const updated = matrix.map((row) => {
      if (row.permission === permissionName) {
        return { ...row, [roleName]: !row[roleName as keyof MatrixRow] } as MatrixRow
      }
      return row
    })
    setMatrix(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Security Permission Matrix</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit standard IAM policies, grant security scopes, and toggle permission matrices for corporate roles.
          </p>
        </div>

        <Button onClick={() => alert("IAM policy matrix changes deployed successfully!")} size="sm">
          <Save className="mr-1.5 h-4 w-4" />
          Deploy Changes
        </Button>
      </div>

      {/* Permission Matrix Grid Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Operational Policy Map</CardTitle>
          <CardDescription className="text-xs font-semibold text-muted-foreground">Click checkboxes to immediately grant or revoke scope permissions for roles.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-3 font-bold text-foreground w-1/4">Scope Permission Key</th>
                {rolesList.map((role) => (
                  <th key={role} className="p-3 font-bold text-foreground text-center truncate max-w-[120px]">
                    {role.replace("_", " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.permission} className="border-b border-border/40 hover:bg-muted/15 transition-colors">
                  <td className="p-3 space-y-0.5">
                    <p className="font-bold text-foreground">{row.permission}</p>
                    <p className="text-[10px] text-muted-foreground leading-normal">{row.description}</p>
                  </td>
                  {rolesList.map((role) => {
                    const isChecked = row[role as keyof MatrixRow] as boolean
                    const isImmutable = role === ROLES.SUPER_ADMIN
                    return (
                      <td key={role} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isImmutable}
                          onChange={() => handleToggleCell(row.permission, role)}
                          className={`h-4 w-4 rounded border-border text-primary focus:ring-primary ${
                            isImmutable ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                          }`}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
