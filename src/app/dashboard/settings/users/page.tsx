"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Drawer } from "@/components/ui/drawer"
import { 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  CheckCircle,
  Eye,
  UserCheck
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  status: "Active" | "Suspended"
}

interface AuditLog {
  id: string
  timestamp: string
  operator: string
  action: string
  details: string
}

export default function UserManagementPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Gating Check
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN

  React.useEffect(() => {
    if (!isSuperAdmin && user) {
      router.push("/unauthorized")
    }
  }, [isSuperAdmin, user])

  // Mock initial users
  const [users, setUsers] = React.useState<UserProfile[]>([
    { id: "USR-01", name: "Super Admin", email: "admin@glowhaat.com", role: ROLES.SUPER_ADMIN, status: "Active" },
    { id: "USR-02", name: "GlowHaat CEO", email: "ceo@glowhaat.com", role: ROLES.CEO, status: "Active" },
    { id: "USR-03", name: "Sarah Jenkins", email: "sarah@glowhaat.com", role: ROLES.HR_MANAGER, status: "Active" },
    { id: "USR-04", name: "Marcus Chen", email: "marcus@glowhaat.com", role: ROLES.FINANCE_MANAGER, status: "Active" },
    { id: "USR-05", name: "David Miller", email: "david@glowhaat.com", role: ROLES.EMPLOYEE, status: "Active" },
    { id: "USR-06", name: "Alice Johnson", email: "alice@glowhaat.com", role: ROLES.EMPLOYEE, status: "Active" },
  ])

  // Mock initial logs
  const [logs, setLogs] = React.useState<AuditLog[]>([
    { id: "LOG-501", timestamp: "2026-06-28 09:30", operator: "admin@glowhaat.com", action: "User Session Approved", details: "Access token generated for ceo@glowhaat.com" },
    { id: "LOG-502", timestamp: "2026-06-28 10:15", operator: "admin@glowhaat.com", action: "Role Reassignment", details: "David Miller re-assigned to role: Employee" },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(null)
  const [assignedRole, setAssignedRole] = React.useState<string>(ROLES.EMPLOYEE)

  if (!isSuperAdmin) return null

  const handleRoleUpdate = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    // Update role
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, role: assignedRole }
      }
      return u
    })
    setUsers(updated)

    // Add audit log
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(500 + Math.random() * 99)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      operator: user?.email || "admin@glowhaat.com",
      action: "Role Reassignment",
      details: `${targetUser.name} re-assigned to role: ${assignedRole}`,
    }
    setLogs([newLog, ...logs])
    setSelectedUser(null)
  }

  const userColumns = [
    { header: "User ID", accessorKey: "id" },
    { header: "User Name", accessorKey: "name" },
    { header: "Email Address", accessorKey: "email" },
    { header: "Security Role", accessorKey: "role" },
    { header: "Status", accessorKey: "status" },
  ]

  const auditColumns = [
    { header: "Timestamp", accessorKey: "timestamp" },
    { header: "Operator Account", accessorKey: "operator" },
    { header: "Action Executed", accessorKey: "action" },
    { header: "Details summary", accessorKey: "details" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">IAM User Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer active user directories, adjust security role boundaries, and audit identity logs.
          </p>
        </div>
      </div>

      {/* Users grid list */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">User Directory Roster</CardTitle>
              <CardDescription className="text-xs">Select user to reassign roles or audit details.</CardDescription>
            </div>
            <SearchBar
              placeholder="Search users..."
              onSearch={(val) => setSearchQuery(val)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={userColumns}
            data={users.filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            pageSize={5}
            onRowClick={(row) => {
              setSelectedUser(row)
              setAssignedRole(row.role)
            }}
            actions={(row) => (
              <Button size="xs" variant="outline" onClick={() => {
                setSelectedUser(row)
                setAssignedRole(row.role)
              }}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Security Audit Trails</CardTitle>
          <CardDescription className="text-xs">Immutable chronological register of admin operations.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={auditColumns}
            data={logs}
            pageSize={5}
          />
        </CardContent>
      </Card>

      {/* Assignment Drawer */}
      <Drawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name}
        description={`Active Role: ${selectedUser?.role}`}
      >
        {selectedUser && (
          <div className="space-y-6 text-xs leading-normal">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Identity Assignment</span>
              
              <Select
                label="Assign New Role"
                options={[
                  { label: "Super Admin", value: ROLES.SUPER_ADMIN },
                  { label: "CEO / Director", value: ROLES.CEO },
                  { label: "Operations Manager", value: ROLES.OPERATIONS_MANAGER },
                  { label: "HR Manager", value: ROLES.HR_MANAGER },
                  { label: "Finance Manager", value: ROLES.FINANCE_MANAGER },
                  { label: "Sales Manager", value: ROLES.SALES_MANAGER },
                  { label: "Project Manager", value: ROLES.PROJECT_MANAGER },
                  { label: "Employee Staff", value: ROLES.EMPLOYEE },
                ]}
                value={assignedRole}
                onChange={(e: any) => setAssignedRole(e.target.value)}
              />

              <Button onClick={() => handleRoleUpdate(selectedUser.id)} className="w-full mt-2">
                <UserCheck className="mr-1.5 h-4 w-4" />
                Apply Assignment Shift
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
