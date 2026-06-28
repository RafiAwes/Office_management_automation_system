"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { KpiCard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { 
  Wallet, 
  DollarSign, 
  FileText, 
  Download, 
  CheckCircle,
  HelpCircle,
  Activity
} from "lucide-react"

interface Payslip {
  id: string
  name: string
  month: string
  basicSalary: number
  allowance: number
  tax: number
  netSalary: number
  status: "Draft" | "Processed" | "Disbursed"
}

export default function HrmPayrollPage() {
  const { user } = useAuthStore()

  // Role Checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isHr = user?.role === ROLES.HR_MANAGER || user?.role === ROLES.SUPER_ADMIN
  const isHrOrCeo = user?.role === ROLES.HR_MANAGER || user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN

  // Mock global payslip logs
  const [payslips, setPayslips] = React.useState<Payslip[]>([
    { id: "PS-701", name: "Marcus Chen", month: "June 2026", basicSalary: 8500, allowance: 1000, tax: 950, netSalary: 8550, status: "Disbursed" },
    { id: "PS-702", name: "Sarah Jenkins", month: "June 2026", basicSalary: 7200, allowance: 700, tax: 790, netSalary: 7110, status: "Disbursed" },
    { id: "PS-703", name: "David Miller", month: "June 2026", basicSalary: 9500, allowance: 1000, tax: 1050, netSalary: 9450, status: "Processed" },
    { id: "PS-704", name: "Alice Johnson", month: "June 2026", basicSalary: 6000, allowance: 500, tax: 650, netSalary: 5850, status: "Draft" },
  ])

  // Employee personal payslip logs
  const [personalPayslips, setPersonalPayslips] = React.useState<Payslip[]>([
    { id: "PPS-01", name: user?.name || "Employee Staff", month: "June 2026", basicSalary: 4500, allowance: 500, tax: 500, netSalary: 4500, status: "Disbursed" },
    { id: "PPS-02", name: user?.name || "Employee Staff", month: "May 2026", basicSalary: 4500, allowance: 500, tax: 500, netSalary: 4500, status: "Disbursed" },
    { id: "PPS-03", name: user?.name || "Employee Staff", month: "April 2026", basicSalary: 4500, allowance: 500, tax: 500, netSalary: 4500, status: "Disbursed" },
  ])

  // Calculations for HR Manager
  const totalPayout = payslips.reduce((sum, p) => sum + p.netSalary, 0)
  const totalTaxes = payslips.reduce((sum, p) => sum + p.tax, 0)
  const totalDraftCount = payslips.filter((p) => p.status === "Draft").length

  const handleProcessPayroll = () => {
    if (!isHr) return
    const updated = payslips.map((p) => {
      if (p.status === "Draft") {
        return { ...p, status: "Processed" as const }
      }
      return p
    })
    setPayslips(updated)
    alert("Draft payslips processed successfully!")
  }

  const handleDisbursePayroll = () => {
    if (!isHr) return
    const updated = payslips.map((p) => {
      if (p.status === "Processed") {
        return { ...p, status: "Disbursed" as const }
      }
      return p
    })
    setPayslips(updated)
    alert("Processed payslips disbursed to staff accounts!")
  }

  const columns = [
    { header: "Staff Member", accessorKey: "name" },
    { header: "Payroll Cycle", accessorKey: "month" },
    {
      header: "Basic Salary",
      accessorKey: "basicSalary",
      render: (row: Payslip) => `$${row.basicSalary.toLocaleString()}`,
    },
    {
      header: "Taxes / Deductions",
      accessorKey: "tax",
      render: (row: Payslip) => `$${row.tax.toLocaleString()}`,
    },
    {
      header: "Net Disbursed",
      accessorKey: "netSalary",
      render: (row: Payslip) => `$${row.netSalary.toLocaleString()}`,
    },
    { header: "Payout Status", accessorKey: "status" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Payroll Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversee corporate salaries, dispatch personal payslips, and review tax allocations.
          </p>
        </div>

        {isHr && (
          <div className="flex gap-2">
            <Button onClick={handleProcessPayroll} size="sm" variant="outline" disabled={totalDraftCount === 0}>
              Process Drafts
            </Button>
            <Button onClick={handleDisbursePayroll} size="sm">
              Disburse Payslips
            </Button>
          </div>
        )}
      </div>

      {isEmployee ? (
        // EMPLOYEE VIEW (Personal payslips download)
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">My Payslip History</CardTitle>
            <CardDescription className="text-xs">Download or inspect monthly disbursement vouchers.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={personalPayslips}
              pageSize={5}
              actions={(row) => (
                <Button 
                  size="xs" 
                  variant="outline" 
                  onClick={() => alert(`Downloading GlowHaat Payslip PDF for ${row.month} - Net: $${row.netSalary}`)}
                >
                  <Download className="mr-1 h-3.5 w-3.5" />
                  PDF Payslip
                </Button>
              )}
            />
          </CardContent>
        </Card>
      ) : (
        // HR / CEO VIEW (Enterprise summaries)
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <KpiCard
              title="Total Monthly Net Payouts"
              value={`$${totalPayout.toLocaleString()}`}
              icon={Wallet}
              status="success"
            />
            <KpiCard
              title="Withheld Taxes (Est)"
              value={`$${totalTaxes.toLocaleString()}`}
              icon={DollarSign}
              status="default"
            />
            <KpiCard
              title="Draft Payslips Waiting"
              value={`${totalDraftCount} Profiles`}
              icon={FileText}
              status={totalDraftCount > 0 ? "warning" : "success"}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Staff Monthly Disbursements</CardTitle>
              <CardDescription className="text-xs">Processed payslips records.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={payslips}
                pageSize={5}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
