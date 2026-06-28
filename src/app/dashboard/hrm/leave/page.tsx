"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { KpiCard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  HeartHandshake, 
  Plus, 
  Eye, 
  Check, 
  X,
  Calendar,
  Layers,
  UserCheck
} from "lucide-react"

interface LeaveRequest {
  id: string
  name: string
  type: string
  dates: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
}

export default function HrmLeavePage() {
  const { user } = useAuthStore()

  // Role checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isHr = user?.role === ROLES.HR_MANAGER || user?.role === ROLES.SUPER_ADMIN
  const isCeo = user?.role === ROLES.CEO

  // Mock global leave requests
  const [requests, setRequests] = React.useState<LeaveRequest[]>([
    { id: "LR-101", name: "David Miller", type: "Annual PTO", dates: "2026-06-28 - 2026-06-30", reason: "Family trip", status: "Approved" },
    { id: "LR-102", name: "Marcus Chen", type: "Sick Leave", dates: "2026-07-05 - 2026-07-06", reason: "Medical procedure", status: "Pending" },
    { id: "LR-103", name: "Alice Johnson", type: "Personal Leave", dates: "2026-07-12 - 2026-07-13", reason: "Relocation move", status: "Pending" },
  ])

  // Employee personal leave balances
  const [balances] = React.useState({
    annual: 14,
    sick: 8,
    casual: 4,
  })

  const [personalRequests, setPersonalRequests] = React.useState<LeaveRequest[]>([
    { id: "PR-01", name: user?.name || "Employee Staff", type: "Annual PTO", dates: "2026-06-28 - 2026-06-30", reason: "Family trip", status: "Approved" },
  ])

  const [isSubmitOpen, setIsSubmitOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [formData, setFormData] = React.useState({
    type: "Annual PTO",
    startDate: "",
    endDate: "",
    reason: "",
  })

  // Action: Submit request
  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmployee) return

    const newReq: LeaveRequest = {
      id: `PR-${Math.floor(100 + Math.random() * 900)}`,
      name: user?.name || "Employee Staff",
      type: formData.type,
      dates: `${formData.startDate} - ${formData.endDate}`,
      reason: formData.reason,
      status: "Pending",
    }

    setPersonalRequests([newReq, ...personalRequests])
    setRequests([newReq, ...requests])
    setIsSubmitOpen(false)
    setFormData({ type: "Annual PTO", startDate: "", endDate: "", reason: "" })
  }

  // Action: Approve/Reject (HR Manager only)
  const handleReviewRequest = (id: string, nextStatus: "Approved" | "Rejected") => {
    if (!isHr) return

    // Update global list
    setRequests(
      requests.map((r) => {
        if (r.id === id) {
          return { ...r, status: nextStatus }
        }
        return r
      })
    )

    // Update personal lists if applicable
    setPersonalRequests(
      personalRequests.map((r) => {
        if (r.id === id) {
          return { ...r, status: nextStatus }
        }
        return r
      })
    )
  }

  const columns = [
    { header: "Staff Member", accessorKey: "name" },
    { header: "Leave Category", accessorKey: "type" },
    { header: "Requested Dates", accessorKey: "dates" },
    { header: "Reason Description", accessorKey: "reason" },
    { header: "Status", accessorKey: "status" },
  ]

  const filteredRequests = requests.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Leave Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer times-off, approve staff leaves requests, and track balances.
          </p>
        </div>

        {isEmployee && (
          <Button onClick={() => setIsSubmitOpen(true)} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Request Time Off
          </Button>
        )}
      </div>

      {isEmployee ? (
        // EMPLOYEE VIEW (Personal balance cards + leave history)
        <div className="space-y-6">
          {/* Balance Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <KpiCard
              title="Annual PTO Balance"
              value={`${balances.annual} Days`}
              icon={Calendar}
              status="success"
            />
            <KpiCard
              title="Sick Leave Balance"
              value={`${balances.sick} Days`}
              icon={HeartHandshake}
              status="info"
            />
            <KpiCard
              title="Casual Leave Balance"
              value={`${balances.casual} Days`}
              icon={UserCheck}
              status="default"
            />
          </div>

          {/* Personal requests list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">My Time-Off Requests</CardTitle>
              <CardDescription className="text-xs">Logs of my submitted leave requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={personalRequests}
                pageSize={5}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        // HR / CEO VIEW (Approvals dashboard)
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">Staff Leaves Approvals Queue</CardTitle>
                <CardDescription className="text-xs">Review pending time-off requests.</CardDescription>
              </div>
              <SearchBar
                placeholder="Search requests by staff..."
                onSearch={(val) => setSearchQuery(val)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredRequests}
              pageSize={5}
              actions={(row) => (
                <div className="flex items-center gap-1.5 justify-end">
                  {isHr && row.status === "Pending" && (
                    <>
                      <Button size="xs" onClick={() => handleReviewRequest(row.id, "Approved")}>
                        <Check className="mr-1 h-3.5 w-3.5 text-success" />
                        Approve
                      </Button>
                      <Button size="xs" variant="destructive" onClick={() => handleReviewRequest(row.id, "Rejected")}>
                        <X className="mr-1 h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Submit Request Modal */}
      {isSubmitOpen && isEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSubmitOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-foreground">Submit Time-Off Request</h3>
            <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
              <Select
                label="Leave Category"
                options={[
                  { label: "Annual PTO", value: "Annual PTO" },
                  { label: "Sick Leave", value: "Sick Leave" },
                  { label: "Casual Leave", value: "Casual Leave" },
                ]}
                value={formData.type}
                onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
                <Input
                  label="End Date"
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <Input
                label="Reason / Purpose"
                placeholder="Brief reason for time-off..."
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsSubmitOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
