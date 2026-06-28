"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Drawer } from "@/components/ui/drawer"
import { 
  Shield, 
  Plus, 
  Eye, 
  Trash2,
  Lock,
  Award
} from "lucide-react"

interface RoleProfile {
  name: string
  description: string
  level: number
  usersCount: number
}

export default function RoleConfigurationsPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Gating Check
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN

  React.useEffect(() => {
    if (!isSuperAdmin && user) {
      router.push("/unauthorized")
    }
  }, [isSuperAdmin, user])

  // Mock roles listing
  const [roles, setRoles] = React.useState<RoleProfile[]>([
    { name: ROLES.SUPER_ADMIN, description: "Full system administrative access, IAM controls, and security policy edits.", level: 10, usersCount: 1 },
    { name: ROLES.CEO, description: "Complete visual tracking access to all corporate and department modules (View-Only).", level: 9, usersCount: 1 },
    { name: ROLES.OPERATIONS_MANAGER, description: "Manage workflows, warehouse capacities, and supplier logistics channels.", level: 8, usersCount: 1 },
    { name: ROLES.HR_MANAGER, description: "Manage staff directory rosters, approve leaves, and disburse payroll packs.", level: 8, usersCount: 1 },
    { name: ROLES.FINANCE_MANAGER, description: "Record cash inflows/outflows, process invoices, and audit financial reports.", level: 8, usersCount: 1 },
    { name: ROLES.SALES_MANAGER, description: "Full access to leads pipelines, customer sheets, and quotations.", level: 8, usersCount: 1 },
    { name: ROLES.PROJECT_MANAGER, description: "Assign task boards, schedule milestones, and update team workloads.", level: 8, usersCount: 1 },
    { name: ROLES.EMPLOYEE, description: "Limited personal access to log timesheets, request leaves, and inspect personal tasks.", level: 5, usersCount: 2 },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRole, setSelectedRole] = React.useState<RoleProfile | null>(null)
  const [isAddOpen, setIsAddOpen] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    level: 5,
  })

  if (!isSuperAdmin) return null

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault()

    const newRole: RoleProfile = {
      name: formData.name,
      description: formData.description,
      level: Number(formData.level) || 5,
      usersCount: 0,
    }

    setRoles([...roles, newRole])
    setIsAddOpen(false)
    setFormData({ name: "", description: "", level: 5 })
  }

  const columns = [
    { header: "Role Designation Name", accessorKey: "name" },
    { header: "Policy Description", accessorKey: "description" },
    { header: "Security Tier Level", accessorKey: "level" },
    { header: "Active Users Count", accessorKey: "usersCount" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Security Role Configurations</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit standard GlowHaat user roles, verify operational permissions thresholds, and draft new role classifications.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Role Class
        </Button>
      </div>

      {/* Roles List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">GlowHaat Role Registry</CardTitle>
            <SearchBar
              placeholder="Search roles..."
              onSearch={(val) => setSearchQuery(val)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={roles.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            pageSize={10}
            onRowClick={(row) => setSelectedRole(row)}
            actions={(row) => (
              <Button size="xs" variant="outline" onClick={() => setSelectedRole(row)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Role Details Drawer */}
      <Drawer
        isOpen={!!selectedRole}
        onClose={() => setSelectedRole(null)}
        title={selectedRole?.name}
        description={`Security Tier: Level ${selectedRole?.level}`}
      >
        {selectedRole && (
          <div className="space-y-6 text-xs leading-normal">
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Access Scope Description</span>
              <p className="text-foreground leading-relaxed">{selectedRole.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <p className="text-muted-foreground font-semibold">Hierarchy level</p>
                <p className="font-bold text-foreground text-sm">Tier {selectedRole.level}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground font-semibold">Assigned Staff Count</p>
                <p className="font-bold text-foreground text-sm">{selectedRole.usersCount} users</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Role Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Role Classification</h3>
            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <Input
                label="Role Code Name"
                placeholder="e.g. MARKETING_MANAGER"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Access Tier Level (1-10)"
                type="number"
                required
                value={formData.level || ""}
                onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
              />
              <Input
                label="Policy Description"
                placeholder="Brief summary of operations scope..."
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
