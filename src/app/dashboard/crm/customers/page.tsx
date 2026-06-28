"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { KpiCard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { 
  Building, 
  Mail, 
  Phone, 
  DollarSign, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  AlertCircle,
  HelpCircle
} from "lucide-react"

interface Customer {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  arr: number
  status: "Active" | "Churned" | "Onboarding"
  healthIndex: number // 0-100
  supportTickets: number
  contractDate: string
  notes: string
}

export default function CrmCustomersPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_VIEW] })
  const { isAllowed: canUpdate } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_UPDATE] })

  // State
  const [customers] = React.useState<Customer[]>([
    {
      id: "CST-001",
      name: "Acme Corp Ltd",
      contactName: "John Smith",
      email: "jsmith@acmecorp.com",
      phone: "+1 (555) 901-2900",
      arr: 180000,
      status: "Active",
      healthIndex: 94,
      supportTickets: 0,
      contractDate: "2024-03-12",
      notes: "High priority accounts. Enterprise SLAs active.",
    },
    {
      id: "CST-002",
      name: "Initech LLC",
      contactName: "Peter Gibbons",
      email: "peter@initech.com",
      phone: "+1 (555) 231-1022",
      arr: 65000,
      status: "Active",
      healthIndex: 82,
      supportTickets: 1,
      contractDate: "2025-01-20",
      notes: "Moving cloud database systems. Active transition phases.",
    },
    {
      id: "CST-003",
      name: "Umbrella Corp",
      contactName: "Albert Wesker",
      email: "wesker@umbrella.com",
      phone: "+1 (555) 666-4920",
      arr: 290000,
      status: "Active",
      healthIndex: 45,
      supportTickets: 4,
      contractDate: "2023-11-05",
      notes: "Severe warning: support backlog spikes. Health Index degraded.",
    },
    {
      id: "CST-004",
      name: "Dunder Mifflin",
      contactName: "Michael Scott",
      email: "mscott@dundermifflin.com",
      phone: "+1 (555) 702-8344",
      arr: 15000,
      status: "Onboarding",
      healthIndex: 98,
      supportTickets: 0,
      contractDate: "2026-06-01",
      notes: "Onboarding pipeline initialized. Setting up accounts profiles.",
    },
  ])

  const [selectedCust, setSelectedCust] = React.useState<Customer | null>(customers[0])
  const [searchQuery, setSearchQuery] = React.useState("")

  // Enforce Route Protection
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filtered list
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculations
  const totalARR = customers.reduce((sum, c) => sum + c.arr, 0)
  const averageHealth = Math.round(customers.reduce((sum, c) => sum + c.healthIndex, 0) / customers.length)

  const columns = [
    { header: "Customer", accessorKey: "name" },
    { header: "Account Contact", accessorKey: "contactName" },
    {
      header: "Annual ARR",
      accessorKey: "arr",
      render: (row: Customer) => `$${row.arr.toLocaleString()}`,
    },
    { header: "Status", accessorKey: "status" },
    {
      header: "Health",
      accessorKey: "healthIndex",
      render: (row: Customer) => (
        <span
          className={`font-semibold ${
            row.healthIndex >= 85
              ? "text-success"
              : row.healthIndex >= 70
              ? "text-warning"
              : "text-danger"
          }`}
        >
          {row.healthIndex}%
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Customer 360 Roster</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Holistic metrics overview of active customer accounts and SLAs.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Total Contract Portfolio (ARR)"
          value={`$${totalARR.toLocaleString()}`}
          icon={DollarSign}
          status="success"
        />
        <KpiCard
          title="Average Health Index"
          value={`${averageHealth}%`}
          icon={UserCheck}
          status={averageHealth >= 80 ? "success" : "warning"}
        />
        <KpiCard
          title="Open Support Tickets"
          value={`${customers.reduce((sum, c) => sum + c.supportTickets, 0)} Tickets`}
          icon={HelpCircle}
          status="default"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customers Table List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">Clients Registry</CardTitle>
                <CardDescription className="text-xs">Click row to open Customer 360 detail card.</CardDescription>
              </div>
              <SearchBar
                placeholder="Search customers..."
                onSearch={(val) => setSearchQuery(val)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredCustomers}
              pageSize={4}
              onRowClick={(row) => setSelectedCust(row)}
            />
          </CardContent>
        </Card>

        {/* Customer 360 View Sidebar Card */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer 360 Profile</h4>
          {selectedCust ? (
            <Card className="border-primary/20">
              <CardHeader className="pb-4 border-b border-border/50 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl p-2 bg-primary/10 text-primary border border-primary/20">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">{selectedCust.name}</CardTitle>
                    <CardDescription className="text-xs">ID: {selectedCust.id}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5 text-xs leading-normal">
                {/* Contract details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Contract ARR</p>
                    <p className="font-bold text-sm text-foreground">${selectedCust.arr.toLocaleString()}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Account Status</p>
                    <p className="font-bold text-sm text-foreground">{selectedCust.status}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Client Health</p>
                    <p className={`font-bold text-sm ${
                      selectedCust.healthIndex >= 85
                        ? "text-success"
                        : selectedCust.healthIndex >= 70
                        ? "text-warning"
                        : "text-danger"
                    }`}>
                      {selectedCust.healthIndex}% Rating
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Signing Date</p>
                    <p className="font-bold text-sm text-foreground">{selectedCust.contractDate}</p>
                  </div>
                </div>

                {/* Primary contact */}
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Account contact</span>
                  <p className="font-semibold text-foreground text-sm">{selectedCust.contactName}</p>
                  <div className="space-y-1.5 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${selectedCust.email}`} className="text-foreground hover:underline truncate">
                        {selectedCust.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <a href={`tel:${selectedCust.phone}`} className="text-foreground hover:underline">
                        {selectedCust.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Support summary */}
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Support Tickets Log</span>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/40 border border-border/40">
                    <span className="text-muted-foreground">Active Open Tickets</span>
                    <span className={`font-bold ${selectedCust.supportTickets > 0 ? "text-danger" : "text-muted-foreground"}`}>
                      {selectedCust.supportTickets} Tickets
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Account Manager Notes</span>
                  <p className="text-muted-foreground italic bg-muted/20 p-2.5 rounded border border-border/40 leading-relaxed text-xs">
                    {selectedCust.notes}
                  </p>
                </div>

                {/* Action button */}
                {canUpdate && (
                  <div className="pt-2">
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={() => alert(`Reviewing SLA contract rules for ${selectedCust.name}`)}
                    >
                      <FileText className="mr-1.5 h-4 w-4" />
                      Edit SLA Guidelines
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-xs italic">
                Select a customer row to view their Customer 360 details.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
