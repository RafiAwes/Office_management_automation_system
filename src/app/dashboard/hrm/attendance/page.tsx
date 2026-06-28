"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { KpiCard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Activity
} from "lucide-react"

interface AttendanceLog {
  id: string
  name: string
  date: string
  clockIn: string
  clockOut: string
  status: "Present" | "Late" | "Absent"
}

export default function HrmAttendancePage() {
  const { user } = useAuthStore()

  // Role Checks
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isHrOrCeo = user?.role === ROLES.HR_MANAGER || user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN

  // Mock global logs
  const [logs, setLogs] = React.useState<AttendanceLog[]>([
    { id: "LOG-01", name: "Marcus Chen", date: "2026-06-27", clockIn: "08:45 AM", clockOut: "05:30 PM", status: "Present" },
    { id: "LOG-02", name: "Sarah Jenkins", date: "2026-06-27", clockIn: "08:55 AM", clockOut: "05:00 PM", status: "Present" },
    { id: "LOG-03", name: "David Miller", date: "2026-06-27", clockIn: "09:15 AM", clockOut: "06:00 PM", status: "Late" },
    { id: "LOG-04", name: "Alice Johnson", date: "2026-06-27", clockIn: "08:50 AM", clockOut: "05:15 PM", status: "Present" },
  ])

  // Employee personal clock-in state
  const [hasClockedIn, setHasClockedIn] = React.useState(false)
  const [clockInTime, setClockInTime] = React.useState<string | null>(null)
  const [clockOutTime, setClockOutTime] = React.useState<string | null>(null)
  const [personalLogs, setPersonalLogs] = React.useState<AttendanceLog[]>([
    { id: "PL-01", name: user?.name || "Employee Staff", date: "2026-06-26", clockIn: "08:52 AM", clockOut: "05:05 PM", status: "Present" },
    { id: "PL-02", name: user?.name || "Employee Staff", date: "2026-06-25", clockIn: "09:08 AM", clockOut: "05:30 PM", status: "Late" },
    { id: "PL-03", name: user?.name || "Employee Staff", date: "2026-06-24", clockIn: "08:45 AM", clockOut: "05:00 PM", status: "Present" },
  ])

  const [searchQuery, setSearchQuery] = React.useState("")

  // Simulation Clock In Action
  const handleClockToggle = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const dateStr = now.toISOString().split("T")[0]

    if (!hasClockedIn) {
      setHasClockedIn(true)
      setClockInTime(timeStr)
      setClockOutTime(null)

      // Add to personal logs
      const newLog: AttendanceLog = {
        id: `PL-${Math.floor(100 + Math.random() * 900)}`,
        name: user?.name || "Employee Staff",
        date: dateStr,
        clockIn: timeStr,
        clockOut: "--",
        status: now.getHours() >= 9 && now.getMinutes() > 0 ? "Late" : "Present",
      }
      setPersonalLogs([newLog, ...personalLogs])
    } else {
      setHasClockedIn(false)
      setClockOutTime(timeStr)

      // Update last log
      const updated = personalLogs.map((log, index) => {
        if (index === 0) {
          return { ...log, clockOut: timeStr }
        }
        return log
      })
      setPersonalLogs(updated)
    }
  }

  // Calculations for HR Manager
  const totalLogs = logs.length
  const presentCount = logs.filter((l) => l.status === "Present" || l.status === "Late").length
  const lateCount = logs.filter((l) => l.status === "Late").length
  const attendanceRate = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 100

  const filteredLogs = logs.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { header: "Staff Member", accessorKey: "name" },
    { header: "Log Date", accessorKey: "date" },
    { header: "Clock In", accessorKey: "clockIn" },
    { header: "Clock Out", accessorKey: "clockOut" },
    { header: "Fulfillment Status", accessorKey: "status" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Attendance Tracker</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit daily checks, monitor check-in logs, and manage scheduling times.
          </p>
        </div>
      </div>

      {isEmployee ? (
        // EMPLOYEE VIEW (Personal Clock-in simulator)
        <div className="grid gap-6 md:grid-cols-3">
          {/* Clock Simulator Panel */}
          <Card className="md:col-span-1 border-primary/20 bg-primary/5">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Simulation clock</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center animate-pulse">
                <Clock className="h-8 w-8 stroke-[1.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">
                  {hasClockedIn ? `Clocked In since ${clockInTime}` : "Not Clocked In"}
                </h3>
                {clockOutTime && !hasClockedIn && (
                  <p className="text-xs text-muted-foreground">Last Clock Out: {clockOutTime}</p>
                )}
              </div>

              <Button 
                onClick={handleClockToggle} 
                className="w-full"
                variant={hasClockedIn ? "outline" : "default"}
              >
                {hasClockedIn ? "Clock Out (End Shift)" : "Clock In (Start Shift)"}
              </Button>
            </CardContent>
          </Card>

          {/* Personal attendance history */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">My Attendance Logs</CardTitle>
              <CardDescription className="text-xs">Recent timesheet logs.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={personalLogs}
                pageSize={5}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        // HR / CEO VIEW (Global stats and directory table)
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <KpiCard
              title="Daily Attendance Rate"
              value={`${attendanceRate}%`}
              icon={Activity}
              status="success"
            />
            <KpiCard
              title="Total Staff Clocked In"
              value={`${presentCount} Present`}
              icon={CheckCircle}
              status="success"
            />
            <KpiCard
              title="Tardy Check-ins"
              value={`${lateCount} Late`}
              icon={AlertTriangle}
              status="warning"
            />
          </div>

          {/* Roster logs */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-semibold">Daily Check-ins Checklist</CardTitle>
                  <CardDescription className="text-xs">Monitored timesheets logs.</CardDescription>
                </div>
                <SearchBar
                  placeholder="Search logs by staff..."
                  onSearch={(val) => setSearchQuery(val)}
                  className="max-w-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredLogs}
                pageSize={5}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
