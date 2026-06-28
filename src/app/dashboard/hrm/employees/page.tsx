"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Drawer } from "@/components/ui/drawer"
import { 
  Users, 
  Plus, 
  Eye, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar,
  Network,
  ChevronRight,
  TrendingUp,
  UserCheck
} from "lucide-react"

interface EmployeeProfile {
  id: string
  name: string
  role: string
  email: string
  phone: string
  location: string
  joinedDate: string
  manager: string
  department: string
  salary: number
}

export default function HrmEmployeesPage() {
  const { user } = useAuthStore()

  // Role Checks
  const isHr = user?.role === ROLES.HR_MANAGER || user?.role === ROLES.SUPER_ADMIN
  const isCeo = user?.role === ROLES.CEO
  const isEmployee = user?.role === ROLES.EMPLOYEE

  // Mock employee data
  const [employees, setEmployees] = React.useState<EmployeeProfile[]>([
    {
      id: "EMP-101",
      name: "Marcus Chen",
      role: "Finance Manager",
      email: "marcus@glowhaat.com",
      phone: "+1 (555) 203-1940",
      location: "San Francisco, CA",
      joinedDate: "2024-02-15",
      manager: "GlowHaat CEO",
      department: "Finance",
      salary: 115000,
    },
    {
      id: "EMP-102",
      name: "Sarah Jenkins",
      role: "HR Manager",
      email: "sarah@glowhaat.com",
      phone: "+1 (555) 892-0492",
      location: "Chicago, IL",
      joinedDate: "2023-11-01",
      manager: "GlowHaat CEO",
      department: "Human Resources",
      salary: 95000,
    },
    {
      id: "EMP-103",
      name: "David Miller",
      role: "Senior Developer",
      email: "david@glowhaat.com",
      phone: "+1 (555) 304-9811",
      location: "Remote, Austin",
      joinedDate: "2025-01-10",
      manager: "Operations Manager",
      department: "Engineering",
      salary: 125000,
    },
    {
      id: "EMP-104",
      name: "Alice Johnson",
      role: "Sales Rep",
      email: "alice@glowhaat.com",
      phone: "+1 (555) 773-1029",
      location: "New York, NY",
      joinedDate: "2025-03-01",
      manager: "Sales Manager",
      department: "Sales",
      salary: 80000,
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedEmp, setSelectedEmp] = React.useState<EmployeeProfile | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"directory" | "orgChart">("directory")

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "Remote",
    manager: "",
    department: "",
    salary: 0,
  })

  // Filtered employees
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Employee-specific profile record
  const employeeProfile = React.useMemo(() => {
    if (!isEmployee) return null
    // If the logged in user is standard Employee, match or return Alice Johnson as mock profile
    return employees.find((e) => e.email === user?.email) || {
      id: "EMP-202",
      name: user?.name || "John Doe",
      role: "Employee Staff",
      email: user?.email || "employee@glowhaat.com",
      phone: "+1 (555) 998-1022",
      location: "San Francisco Office",
      joinedDate: "2025-05-12",
      manager: "Sarah Jenkins (HR)",
      department: "Administration",
      salary: 60000,
    }
  }, [isEmployee, user, employees])

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isHr) return

    const newEmp: EmployeeProfile = {
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      joinedDate: new Date().toISOString().split("T")[0],
      manager: formData.manager || "Sarah Jenkins",
      department: formData.department,
      salary: Number(formData.salary) || 0,
    }

    setEmployees([...employees, newEmp])
    setIsCreateOpen(false)
    setFormData({ name: "", role: "", email: "", phone: "", location: "Remote", manager: "", department: "", salary: 0 })
  }

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Full Name", accessorKey: "name" },
    { header: "Role Designation", accessorKey: "role" },
    { header: "Department", accessorKey: "department" },
    { header: "Office Location", accessorKey: "location" },
    { header: "Start Date", accessorKey: "joinedDate" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Employees Directory</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer staff rosters, update contract profiles, and review corporate hierarchies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab selector */}
          <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm text-xs">
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                activeTab === "directory" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Roster View
            </button>
            <button
              onClick={() => setActiveTab("orgChart")}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                activeTab === "orgChart" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Org Chart
            </button>
          </div>

          {/* Add Button */}
          {isHr && activeTab === "directory" && (
            <Button onClick={() => setIsCreateOpen(true)} size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Main Panel */}
      {activeTab === "orgChart" ? (
        // ORG CHART VIEW (Visible to all)
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">GlowHaat Corporate Hierarchy</CardTitle>
            <CardDescription className="text-xs">Tree chart mapping organizational reporting chains.</CardDescription>
          </CardHeader>
          <CardContent className="py-8 flex flex-col items-center">
            {/* CEO */}
            <div className="flex flex-col items-center">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center max-w-xs shadow-sm">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Executive Board</span>
                <p className="font-bold text-sm text-foreground">GlowHaat CEO</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Business Owner / Director</p>
              </div>

              {/* Vertical line connector */}
              <div className="h-8 w-[1px] bg-border/60" />

              {/* Managers Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 relative before:absolute before:top-0 before:left-12 before:right-12 before:h-[1px] before:bg-border/60">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-[1px] bg-border/60" />
                  <div className="rounded-xl border border-border bg-card p-3 text-center max-w-[160px] shadow-sm">
                    <p className="font-bold text-xs text-foreground">Sarah Jenkins</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">HR Manager</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-4 w-[1px] bg-border/60" />
                  <div className="rounded-xl border border-border bg-card p-3 text-center max-w-[160px] shadow-sm">
                    <p className="font-bold text-xs text-foreground">Marcus Chen</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Finance Manager</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-4 w-[1px] bg-border/60" />
                  <div className="rounded-xl border border-border bg-card p-3 text-center max-w-[160px] shadow-sm">
                    <p className="font-bold text-xs text-foreground">Sales Manager</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Sales Division</p>
                  </div>
                  <div className="h-6 w-[1px] bg-border/60" />
                  <div className="rounded-xl border border-dashed border-border bg-card p-2 text-center max-w-[140px]">
                    <p className="font-semibold text-[11px] text-foreground">Alice Johnson</p>
                    <p className="text-[9px] text-muted-foreground">Sales Representative</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-4 w-[1px] bg-border/60" />
                  <div className="rounded-xl border border-border bg-card p-3 text-center max-w-[160px] shadow-sm">
                    <p className="font-bold text-xs text-foreground">Operations Manager</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Ops Division</p>
                  </div>
                  <div className="h-6 w-[1px] bg-border/60" />
                  <div className="rounded-xl border border-dashed border-border bg-card p-2 text-center max-w-[140px]">
                    <p className="font-semibold text-[11px] text-foreground">David Miller</p>
                    <p className="text-[9px] text-muted-foreground">Senior Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isEmployee && employeeProfile ? (
        // EMPLOYEE VIEW (My Profile Only)
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-2xl">
                {employeeProfile.name[0]}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{employeeProfile.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {employeeProfile.role}
                </p>
              </div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground bg-card px-2.5 py-1 rounded border border-border">
                Employee Profile Active
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">My Personal Roster Details</CardTitle>
              <CardDescription className="text-xs">Contract and deployment logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </p>
                  <p className="font-bold text-foreground">{employeeProfile.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Contact Phone
                  </p>
                  <p className="font-bold text-foreground">{employeeProfile.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Base Location
                  </p>
                  <p className="font-bold text-foreground">{employeeProfile.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Joining Date
                  </p>
                  <p className="font-bold text-foreground">{employeeProfile.joinedDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Department Segment</p>
                  <p className="font-bold text-foreground">{employeeProfile.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Reports Directly To</p>
                  <p className="font-bold text-foreground">{employeeProfile.manager}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // HR / CEO VIEW (Full Directory Roster)
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">Active Staff Roster</CardTitle>
                <CardDescription className="text-xs">Click row to open detailed profile information.</CardDescription>
              </div>
              <SearchBar
                placeholder="Search staff directory..."
                onSearch={(val) => setSearchQuery(val)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredEmployees}
              pageSize={5}
              onRowClick={(row) => setSelectedEmp(row)}
              actions={(row) => (
                <Button size="xs" variant="outline" onClick={() => setSelectedEmp(row)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Details Drawer */}
      <Drawer
        isOpen={!!selectedEmp}
        onClose={() => setSelectedEmp(null)}
        title={selectedEmp?.name}
        description={selectedEmp?.role}
      >
        {selectedEmp && (
          <div className="space-y-6 text-xs leading-normal">
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Contact Records</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedEmp.email}`} className="text-foreground hover:underline">
                    {selectedEmp.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedEmp.phone}`} className="text-foreground hover:underline">
                    {selectedEmp.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedEmp.location}</span>
                </div>
              </div>
            </div>

            {/* Employment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Department</p>
                <p className="font-bold text-foreground">{selectedEmp.department}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Line Manager</p>
                <p className="font-bold text-foreground">{selectedEmp.manager}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Joined Date</p>
                <p className="font-bold text-foreground">{selectedEmp.joinedDate}</p>
              </div>
              {isHr && (
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">Base Salary</p>
                  <p className="font-bold text-foreground text-sm">${selectedEmp.salary.toLocaleString()}/yr</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add New Employee Profile</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <Input
                label="Full Name"
                placeholder="e.g. Michael Scott"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Role Designation"
                  placeholder="e.g. Developer"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <Input
                  label="Department"
                  placeholder="e.g. Engineering"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  placeholder="user@glowhaat.com"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Annual Salary ($)"
                  type="number"
                  required
                  value={formData.salary || ""}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                />
                <Input
                  label="Reports To"
                  placeholder="e.g. Operations Manager"
                  required
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
