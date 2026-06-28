"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLES } from "@/lib/rbac/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Activity,
  ArrowRight
} from "lucide-react"

interface Message {
  sender: "user" | "copilot"
  text: string
  timestamp: string
}

export default function AiCopilotPage() {
  const { user } = useAuthStore()

  // Role Checks
  const isCeo = user?.role === ROLES.CEO || user?.role === ROLES.SUPER_ADMIN
  const isHr = user?.role === ROLES.HR_MANAGER
  const isFinance = user?.role === ROLES.FINANCE_MANAGER
  const isPm = user?.role === ROLES.PROJECT_MANAGER
  const isEmployee = user?.role === ROLES.EMPLOYEE

  // Initial role-based suggestions
  const roleSuggestions = React.useMemo(() => {
    if (isCeo) {
      return {
        title: "CEO: Business Growth Insights",
        insights: [
          { text: "Expand Singapore APAC Node capacity to capture +15% regional margins.", type: "revenue" as const },
          { text: "Consolidate EU suppliers list to save $6,500 monthly opex costs.", type: "cost" as const },
        ],
        chips: ["Forecast Q3 Growth", "Risk Analysis APAC Node", "Optimize EU Logistics"],
      }
    }
    if (isHr) {
      return {
        title: "HR Manager: Workforce Insights",
        insights: [
          { text: "David Miller (Senior Dev) holds 85% task workload. Highly recommended to delegate.", type: "workload" as const },
          { text: "Timesheet attendance rate averages 96%. Tardy check-ins are within optimal SLA.", type: "attendance" as const },
        ],
        chips: ["Delegate Tasks", "Attendance Compliance Report", "Leaves Approvals Status"],
      }
    }
    if (isFinance) {
      return {
        title: "Finance Manager: Financial Insights",
        insights: [
          { text: "Inventory procurement budget is slightly over by $1,300 (+5.2%).", type: "risk" as const },
          { text: "Billed SaaS licenses settled at 100%. Accrued ledger stands at $12,500.", type: "revenue" as const },
        ],
        chips: ["Check COGS Splits", "Outstanding Invoices Audit", "Download Q2 Statement"],
      }
    }
    if (isPm) {
      return {
        title: "Project Manager: Project Risk Insights",
        insights: [
          { text: "OAuth Gateway API Integration milestone is currently In Dev (Due in 3 days).", type: "risk" as const },
          { text: "Kanban Done column contains 60% of current sprint tasks.", type: "progress" as const },
        ],
        chips: ["Audit Sprint Scope", "OAuth API Staging", "Reschedule Milestones"],
      }
    }
    // Employee Fallback
    return {
      title: "Employee: Productivity & Tasks Assistant",
      insights: [
        { text: "You have 3 pending tasks for the OAuth Integration Gateway project.", type: "workload" as const },
        { text: "Leave balance is optimal: 14 Annual PTO days remaining.", type: "leaves" as const },
      ],
      chips: ["My Assigned Tasks", "Clock In Status Check", "Submit PTO Request"],
    }
  }, [isCeo, isHr, isFinance, isPm, isEmployee])

  // Chat State
  const [messages, setMessages] = React.useState<Message[]>([
    {
      sender: "copilot",
      text: `Hello ${user?.name || "there"}, I am your GlowHaat AI Business Copilot. How can I help you analyze operations today?`,
      timestamp: "12:00 PM",
    },
  ])
  const [inputVal, setInputVal] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: timeStr,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputVal("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      let replyText = ""
      const q = textToSend.toLowerCase()

      if (q.includes("growth") || q.includes("forecast") || q.includes("q3")) {
        replyText = "Based on current trailing performance indicators, Q3 projected revenue is **$154,000** (+18% growth) with an estimated net operating surplus of **$56,000**. Key driver: SaaS integration launches."
      } else if (q.includes("risk") || q.includes("bottleneck") || q.includes("warehouse")) {
        replyText = "Risk Detected: APAC storage pod utilization stands at **45%**. Recommendation: Consolidate outbound logistics from EU West directly to Singapore to capture shipping discounts."
      } else if (q.includes("attendance") || q.includes("compliance") || q.includes("staff")) {
        replyText = "Workforce Compliance: Current presence rate is **96%**. David Miller logged one tardy check-in this sprint, but remains within target SLA guidelines."
      } else if (q.includes("cogs") || q.includes("budget") || q.includes("expenses")) {
        replyText = "Financial Alert: Inventory procurement has exceeded allocated thresholds by **$1,300** (+5.2%). We recommend holding additional purchase orders until the next billing cycle."
      } else if (q.includes("tasks") || q.includes("assigned") || q.includes("work")) {
        replyText = "Task Checklist: You are staffed on the **OAuth Integration Gateway** project with 3 pending tasks. Database schema is completed; API integration is currently In Dev."
      } else {
        replyText = `I've analyzed your query regarding "${textToSend}". Let's schedule an audit of the GlowHaat operations directory to review these details.`
      }

      const copilotMsg: Message = {
        sender: "copilot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, copilotMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 min-h-[calc(100vh-180px)]">
      {/* Left Pane: Role-Based AI Suggestions & Alerts */}
      <div className="lg:col-span-1 space-y-6 flex flex-col">
        <Card className="border-primary/20 bg-primary/5 flex-grow">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">{roleSuggestions.title}</CardTitle>
            </div>
            <CardDescription className="text-[10px]">Real-time recommendations generated for your corporate role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {roleSuggestions.insights.map((ins, idx) => (
              <div key={idx} className="p-3 bg-card border border-border/40 rounded-xl space-y-2">
                <span className="font-bold text-[10px] uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                  {ins.type === "risk" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                  ) : ins.type === "revenue" ? (
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Lightbulb className="h-3.5 w-3.5 text-primary" />
                  )}
                  {ins.type} Alert
                </span>
                <p className="text-foreground leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Pane: AI Chat Interface */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="flex flex-col h-full border-border/60">
          <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">GlowHaat Business Copilot Chat</CardTitle>
              <CardDescription className="text-xs">Chat directly with the business intelligence agent.</CardDescription>
            </div>
            <div className="h-2 w-2 rounded-full bg-success animate-ping" />
          </CardHeader>
          
          {/* Scrollable messages area */}
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[400px] min-h-[300px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] text-xs ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center font-bold border ${
                    msg.sender === "user"
                      ? "bg-secondary text-foreground border-border"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-secondary/40 text-foreground border border-border"
                      : "bg-primary/5 text-foreground border border-primary/10"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-muted-foreground/60 block mt-1.5 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] text-xs">
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary border-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 bg-primary/5 text-muted-foreground border border-primary/10 rounded-xl animate-pulse">
                  Copilot is typing...
                </div>
              </div>
            )}
          </CardContent>

          {/* Quick suggestions chips */}
          <div className="px-4 pb-2 pt-3 border-t border-border/40 flex flex-wrap gap-2 text-[10px]">
            {roleSuggestions.chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-full border border-border transition-colors flex items-center gap-1"
              >
                {chip}
                <ArrowRight className="h-3 w-3" />
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-4 border-t border-border/40 flex gap-2">
            <Input
              placeholder="Ask a question about GlowHaat forecasts, project risks, or workloads..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputVal)}
              className="flex-grow text-xs"
            />
            <Button onClick={() => handleSendMessage(inputVal)} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
