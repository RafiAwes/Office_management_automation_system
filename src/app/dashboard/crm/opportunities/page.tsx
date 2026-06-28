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
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Eye, 
  FileText,
  BadgeAlert
} from "lucide-react"

interface Opportunity {
  id: string
  name: string
  client: string
  value: number
  stage: "Qualification" | "Demo Scheduled" | "Proposal Sent" | "Negotiation" | "Closed Won" | "Closed Lost"
  probability: number // 0-100
  closeDate: string
  assignedSalesperson: string
}

export default function CrmOpportunitiesPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_VIEW] })
  const { isAllowed: canCreate } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_CREATE] })
  const { isAllowed: canUpdate } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_UPDATE] })

  // State
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([
    {
      id: "OPP-501",
      name: "Saber Corp Cloud Expansion",
      client: "Saber Corp",
      value: 88000,
      stage: "Negotiation",
      probability: 80,
      closeDate: "2026-07-15",
      assignedSalesperson: "Marcus Chen",
    },
    {
      id: "OPP-502",
      name: "Acme Web Security Package",
      client: "Acme Corp Ltd",
      value: 45000,
      stage: "Proposal Sent",
      probability: 60,
      closeDate: "2026-07-22",
      assignedSalesperson: "Sarah Jenkins",
    },
    {
      id: "OPP-503",
      name: "Dunder Mifflin Server Setup",
      client: "Dunder Mifflin",
      value: 15800,
      stage: "Demo Scheduled",
      probability: 40,
      closeDate: "2026-08-01",
      assignedSalesperson: "Marcus Chen",
    },
    {
      id: "OPP-504",
      name: "Wayne Corp Tech Suite",
      client: "Wayne Enterprises",
      value: 350000,
      stage: "Qualification",
      probability: 20,
      closeDate: "2026-09-12",
      assignedSalesperson: "Sarah Jenkins",
    },
    {
      id: "OPP-505",
      name: "Initech Integration Deal",
      client: "Initech LLC",
      value: 65000,
      stage: "Closed Won",
      probability: 100,
      closeDate: "2026-06-25",
      assignedSalesperson: "Marcus Chen",
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  
  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    client: "",
    value: 0,
    stage: "Qualification" as Opportunity["stage"],
    probability: 20,
    closeDate: "",
    assignedSalesperson: "",
  })

  // Enforce Route Protection
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filtered
  const filteredOpps = opportunities.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.stage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculations
  const totalPipeline = opportunities
    .filter((o) => o.stage !== "Closed Won" && o.stage !== "Closed Lost")
    .reduce((sum, o) => sum + o.value, 0)
  
  const weightedPipeline = opportunities
    .filter((o) => o.stage !== "Closed Won" && o.stage !== "Closed Lost")
    .reduce((sum, o) => sum + (o.value * o.probability) / 100, 0)

  const closedWonTotal = opportunities
    .filter((o) => o.stage === "Closed Won")
    .reduce((sum, o) => sum + o.value, 0)

  // Create action
  const handleCreateOpp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return

    const newOpp: Opportunity = {
      id: `OPP-${Math.floor(600 + Math.random() * 300)}`,
      name: formData.name,
      client: formData.client,
      value: Number(formData.value) || 0,
      stage: formData.stage,
      probability: Number(formData.probability) || 20,
      closeDate: formData.closeDate || new Date().toISOString().split("T")[0],
      assignedSalesperson: formData.assignedSalesperson || user?.name || "System Rep",
    }

    setOpportunities([newOpp, ...opportunities])
    setIsCreateOpen(false)
    setFormData({ name: "", client: "", value: 0, stage: "Qualification", probability: 20, closeDate: "", assignedSalesperson: "" })
  }

  const columns = [
    { header: "Opportunity", accessorKey: "name" },
    { header: "Client", accessorKey: "client" },
    {
      header: "Value Target",
      accessorKey: "value",
      render: (row: Opportunity) => `$${row.value.toLocaleString()}`,
    },
    { header: "Pipeline Stage", accessorKey: "stage" },
    {
      header: "Win Probability",
      accessorKey: "probability",
      render: (row: Opportunity) => (
        <span className="font-semibold text-foreground/80">{row.probability}%</span>
      ),
    },
    { header: "Target Close", accessorKey: "closeDate" },
    { header: "Owner", accessorKey: "assignedSalesperson" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Opportunities Tracker</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Identify deal stages, win probabilities, and pipeline revenue milestones.
          </p>
        </div>

        {canCreate && (
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add CRM Opportunity
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard
          title="Active Pipeline Value"
          value={`$${totalPipeline.toLocaleString()}`}
          icon={DollarSign}
          status="info"
        />
        <KpiCard
          title="Weighted Pipeline Value"
          value={`$${Math.round(weightedPipeline).toLocaleString()}`}
          icon={Percent}
          status="success"
        />
        <KpiCard
          title="Q2 Deals Won Value"
          value={`$${closedWonTotal.toLocaleString()}`}
          icon={TrendingUp}
          status="success"
        />
      </div>

      {/* Opportunities List Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Active Opportunities Ledger</CardTitle>
              <CardDescription className="text-xs">Monitored deals pipelines list.</CardDescription>
            </div>
            <SearchBar
              placeholder="Search opportunities..."
              onSearch={(val) => setSearchQuery(val)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredOpps}
            pageSize={5}
            onRowClick={(row) => alert(`Reviewing opportunity ${row.id} - ${row.name}`)}
          />
        </CardContent>
      </Card>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add CRM Opportunity Deal</h3>
            <form onSubmit={handleCreateOpp} className="space-y-4 text-xs">
              <Input
                label="Opportunity Name"
                placeholder="e.g. Acme Web Security Upgrade"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Client Name"
                placeholder="e.g. Acme Corp Ltd"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Target Value ($)"
                  placeholder="50000"
                  type="number"
                  required
                  value={formData.value || ""}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                />
                <Select
                  label="Deal Stage"
                  options={[
                    { label: "Qualification", value: "Qualification" },
                    { label: "Demo Scheduled", value: "Demo Scheduled" },
                    { label: "Proposal Sent", value: "Proposal Sent" },
                    { label: "Negotiation", value: "Negotiation" },
                  ]}
                  value={formData.stage}
                  onChange={(e: any) => setFormData({ ...formData, stage: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Win Probability (%)"
                  placeholder="20"
                  type="number"
                  required
                  value={formData.probability || ""}
                  onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                />
                <Input
                  label="Target Close Date"
                  type="date"
                  required
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                />
              </div>
              <Input
                label="Assigned Salesperson"
                placeholder="e.g. Sarah Jenkins"
                value={formData.assignedSalesperson}
                onChange={(e) => setFormData({ ...formData, assignedSalesperson: e.target.value })}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Opportunity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
