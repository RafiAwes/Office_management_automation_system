"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Drawer } from "@/components/ui/drawer"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { EmptyState } from "@/components/ui/empty-state"
import { 
  Users, 
  Plus, 
  Trash2, 
  Eye, 
  KanbanSquare, 
  List, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react"

// Types
interface ActivityLog {
  id: string
  action: string
  timestamp: string
}

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  value: number
  status: "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost"
  notes: string[]
  activities: ActivityLog[]
  health: "High" | "Medium" | "Low"
}

export default function CrmLeadsPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // RBAC permissions checks
  const { isAllowed: canView } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_VIEW] })
  const { isAllowed: canCreate } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_CREATE] })
  const { isAllowed: canDelete } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_DELETE] })
  const { isAllowed: canUpdate } = useRbac({ requiredPermissions: [PERMISSIONS.CRM_UPDATE] })

  // State
  const [leads, setLeads] = React.useState<Lead[]>([
    {
      id: "LD-001",
      name: "Alice Johnson",
      company: "Apex Tech Solutions",
      email: "alice@apextech.com",
      phone: "+1 (555) 019-2834",
      value: 45000,
      status: "New",
      notes: ["Initial inquiry received via enterprise webform.", "Expressed interest in Q3 custom cloud setups."],
      activities: [
        { id: "act-1", action: "Lead record initialized", timestamp: "2026-06-25 10:30" },
      ],
      health: "High",
    },
    {
      id: "LD-002",
      name: "David Miller",
      company: "Stark Industries",
      email: "david@stark.com",
      phone: "+1 (555) 014-9988",
      value: 120000,
      status: "Qualified",
      notes: ["Qualified through initial call screening.", "Requires custom Django scaling metrics."],
      activities: [
        { id: "act-2", action: "Lead record initialized", timestamp: "2026-06-24 09:15" },
        { id: "act-3", action: "Qualified screening call completed", timestamp: "2026-06-25 14:00" },
      ],
      health: "High",
    },
    {
      id: "LD-003",
      name: "Emma Watson",
      company: "Hogwarts Media Group",
      email: "emma@hogwarts.co.uk",
      phone: "+44 20 7946 0958",
      value: 35000,
      status: "Contacted",
      notes: ["Attempted follow-up callback. Left voicemail."],
      activities: [
        { id: "act-4", action: "Lead record initialized", timestamp: "2026-06-26 11:00" },
        { id: "act-5", action: "Voicemail follow-up dispatched", timestamp: "2026-06-27 10:00" },
      ],
      health: "Medium",
    },
    {
      id: "LD-004",
      name: "Bruce Wayne",
      company: "Wayne Enterprises",
      email: "bruce@waynecorp.com",
      phone: "+1 (555) 012-1939",
      value: 250000,
      status: "Proposal",
      notes: ["Security assessment proposals dispatched. Awaiting feedback."],
      activities: [
        { id: "act-6", action: "Lead record initialized", timestamp: "2026-06-23 08:00" },
        { id: "act-7", action: "Dispatched Q3 RFP proposal package", timestamp: "2026-06-26 16:30" },
      ],
      health: "High",
    },
  ])

  const [isKanban, setIsKanban] = React.useState(true)
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Note Form State
  const [newNote, setNewNote] = React.useState("")

  // Lead Form Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    value: 0,
    health: "High" as "High" | "Medium" | "Low",
  })

  // Enforce Route Protection
  React.useEffect(() => {
    if (!canView && user) {
      router.push("/unauthorized")
    }
  }, [canView, user])

  if (!canView) return null

  // Filtered Leads
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Kanban Stage configuration
  const stages: Lead["status"][] = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"]

  // Action: Add note to active lead
  const handleAddNote = (leadId: string) => {
    if (!newNote.trim() || !canUpdate) return
    const updated = leads.map((lead) => {
      if (lead.id === leadId) {
        return {
          ...lead,
          notes: [...lead.notes, newNote],
          activities: [
            ...lead.activities,
            {
              id: `act-${Date.now()}`,
              action: `Added note: "${newNote.slice(0, 30)}..."`,
              timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            },
          ],
        }
      }
      return lead
    })
    setLeads(updated)
    const targetLead = updated.find((l) => l.id === leadId)
    if (targetLead) setSelectedLead(targetLead)
    setNewNote("")
  }

  // Action: Advance lead stage
  const handleMoveStage = (leadId: string, nextStatus: Lead["status"]) => {
    if (!canUpdate) return
    const updated = leads.map((lead) => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: nextStatus,
          activities: [
            ...lead.activities,
            {
              id: `act-${Date.now()}`,
              action: `Transitioned stage to: ${nextStatus}`,
              timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            },
          ],
        }
      }
      return lead
    })
    setLeads(updated)
    const targetLead = updated.find((l) => l.id === leadId)
    if (targetLead) setSelectedLead(targetLead)
  }

  // Action: Delete lead
  const handleDeleteLead = (leadId: string) => {
    if (!canDelete) return
    if (confirm("Are you sure you want to delete this lead?")) {
      setLeads(leads.filter((l) => l.id !== leadId))
      setSelectedLead(null)
    }
  }

  // Action: Create lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return

    const newLeadRecord: Lead = {
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      value: Number(formData.value) || 0,
      status: "New",
      notes: [],
      activities: [
        { id: `act-${Date.now()}`, action: "Lead record initialized", timestamp: new Date().toISOString().replace("T", " ").slice(0, 16) }
      ],
      health: formData.health,
    }

    setLeads([newLeadRecord, ...leads])
    setIsCreateOpen(false)
    setFormData({ name: "", company: "", email: "", phone: "", value: 0, health: "High" })
  }

  // Table Config
  const columns = [
    { header: "Lead ID", accessorKey: "id" },
    { header: "Client / Contact", accessorKey: "name" },
    { header: "Company", accessorKey: "company" },
    {
      header: "Value Target",
      accessorKey: "value",
      render: (row: Lead) => `$${row.value.toLocaleString()}`,
    },
    { header: "Pipeline Status", accessorKey: "status" },
    { header: "Lead Health", accessorKey: "health" },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Header options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Leads Pipeline</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor and coordinate corporate client leads progression stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* List/Kanban toggle */}
          <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm">
            <button
              onClick={() => setIsKanban(true)}
              className={`p-1.5 rounded-md transition-colors ${
                isKanban ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Kanban Board"
            >
              <KanbanSquare className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsKanban(false)}
              className={`p-1.5 rounded-md transition-colors ${
                !isKanban ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              title="List Table"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Create Button (Hidden if lacks crm.create) */}
          {canCreate && (
            <Button onClick={() => setIsCreateOpen(true)} size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Add CRM Lead
            </Button>
          )}
        </div>
      </div>

      {/* Searchbar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          placeholder="Filter leads by contact, status, or organization..."
          onSearch={(val) => setSearchQuery(val)}
        />
      </div>

      {/* 2. Main content switch */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          title="No Leads Found"
          description="We couldn't locate any lead profiles matching your query settings."
          actionLabel="Create new lead"
          onAction={() => setIsCreateOpen(true)}
          requiredPermissions={[PERMISSIONS.CRM_CREATE]}
        />
      ) : isKanban ? (
        // KANBAN VIEW
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6 overflow-x-auto pb-4 scrollbar-thin">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage)
            return (
              <div key={stage} className="space-y-4 min-w-[200px] flex flex-col h-full">
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stage}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column cards container */}
                <div className="flex-1 space-y-3 min-h-[400px] rounded-xl bg-muted/20 p-2 border border-dashed border-border/40">
                  {stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      hoverable
                      className="cursor-pointer border-border bg-card shadow-sm active:scale-[0.98] transition-transform"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-foreground truncate">{lead.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-foreground/80">${lead.value.toLocaleString()}</span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              lead.health === "High"
                                ? "bg-success/15 text-success"
                                : lead.health === "Medium"
                                ? "bg-warning/15 text-warning"
                                : "bg-danger/15 text-danger"
                            }`}
                          >
                            {lead.health}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // TABLE LIST VIEW
        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={filteredLeads}
              pageSize={5}
              onRowClick={(row) => setSelectedLead(row)}
              actions={(row) => (
                <div className="flex items-center gap-1.5 justify-end">
                  <Button size="xs" variant="outline" onClick={() => setSelectedLead(row)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  {canDelete && (
                    <Button size="xs" variant="destructive" onClick={() => handleDeleteLead(row.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* 3. Detail Drawer View */}
      <Drawer
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.name}
        description={selectedLead?.company}
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Contact details */}
            <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Contact Records</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href={`mailto:${selectedLead.email}`} className="text-foreground hover:underline truncate">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href={`tel:${selectedLead.phone}`} className="text-foreground hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4 flex-shrink-0" />
                  <span className="text-foreground">{selectedLead.company}</span>
                </div>
              </div>
            </div>

            {/* Pipeline Stage progress */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Pipeline Advancement</span>
              <div className="flex justify-between items-center bg-muted/20 border border-border/40 p-3 rounded-xl">
                <div className="text-xs">
                  <p className="text-muted-foreground">Current Stage</p>
                  <p className="font-bold text-foreground">{selectedLead.status}</p>
                </div>
                
                {canUpdate && (
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleMoveStage(selectedLead.id, e.target.value as Lead["status"])}
                    className="text-xs font-semibold rounded border border-border bg-card p-1 focus:outline-none"
                  >
                    {stages.map((st) => (
                      <option key={st} value={st}>
                        Move to {st}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Note taking */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Lead Notes</span>
              
              {/* Note input form */}
              {canUpdate && (
                <div className="flex gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type new follow-up note..."
                    rows={2}
                    className="flex-1 text-xs p-2 rounded-md border border-border focus:ring-1 focus:ring-primary bg-transparent focus:outline-none"
                  />
                  <Button onClick={() => handleAddNote(selectedLead.id)} size="sm" className="self-end">
                    Save
                  </Button>
                </div>
              )}

              {/* Notes list */}
              {selectedLead.notes.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No follow-up notes logged.</p>
              ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedLead.notes.map((note, index) => (
                    <li key={index} className="text-xs p-2.5 rounded-lg border border-border bg-card/60 leading-normal">
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Activities Timeline */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider block">Audit Activity History</span>
              <ul className="space-y-3 pl-3.5 relative before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-[1px] before:bg-border/60">
                {selectedLead.activities.map((act) => (
                  <li key={act.id} className="relative flex flex-col gap-0.5">
                    <div className="absolute -left-[16px] top-1.5 h-2.5 w-2.5 rounded-full border border-primary bg-background" />
                    <span className="text-xs text-foreground/80 font-medium">{act.action}</span>
                    <span className="text-[10px] text-muted-foreground">{act.timestamp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delete button (Gated by crm.delete) */}
            {canDelete && (
              <div className="pt-4 border-t border-border/50 flex justify-end">
                <Button variant="destructive" onClick={() => handleDeleteLead(selectedLead.id)} size="sm">
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete Lead Profile
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 4. Create Modal (Hidden if lacks crm.create) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Add New CRM Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Organization / Company"
                placeholder="e.g. Dunder Mifflin"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  placeholder="name@company.com"
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
                  label="Target Value ($)"
                  placeholder="50000"
                  type="number"
                  required
                  value={formData.value || ""}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                />
                <Select
                  label="Lead Health"
                  options={[
                    { label: "High Priority", value: "High" },
                    { label: "Medium", value: "Medium" },
                    { label: "Low Priority", value: "Low" },
                  ]}
                  value={formData.health}
                  onChange={(e: any) => setFormData({ ...formData, health: e.target.value })}
                />
              </div>
              
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
