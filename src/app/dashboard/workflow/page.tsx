"use client"

import * as React from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRbac } from "@/hooks/use-rbac"
import { ROLES } from "@/lib/rbac/roles"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { 
  GitFork, 
  Plus, 
  Trash2, 
  Settings, 
  Layers, 
  Activity, 
  Play,
  Save,
  HelpCircle
} from "lucide-react"

interface Node {
  id: string
  label: string
  type: "trigger" | "condition" | "action"
  x: number
  y: number
  config: string
}

interface Edge {
  id: string
  source: string
  target: string
}

export default function WorkflowAutomationPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Gating & RBAC
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const isCeo = user?.role === ROLES.CEO
  const isOpsOrAdmin = user?.role === ROLES.OPERATIONS_MANAGER || user?.role === ROLES.SUPER_ADMIN

  const hasAccess = isCeo || isOpsOrAdmin

  React.useEffect(() => {
    if (isEmployee && user) {
      router.push("/unauthorized")
    }
  }, [isEmployee, user])

  // Mock template states
  const templates: Record<string, { nodes: Node[]; edges: Edge[] }> = {
    onboarding: {
      nodes: [
        { id: "1", label: "Employee Joined", type: "trigger", x: 50, y: 150, config: "Role = Any" },
        { id: "2", label: "Create Email Account", type: "action", x: 250, y: 80, config: "Domain = glowhaat.com" },
        { id: "3", label: "Is Remote Staff?", type: "condition", x: 250, y: 220, config: "Location = Remote" },
        { id: "4", label: "Ship Laptop Package", type: "action", x: 480, y: 220, config: "Hardware = Standard" },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e1-3", source: "1", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
      ],
    },
    purchase: {
      nodes: [
        { id: "1", label: "PO Drafted", type: "trigger", x: 50, y: 150, config: "Status = Draft" },
        { id: "2", label: "Value > $10,000?", type: "condition", x: 250, y: 150, config: "Cost >= 10000" },
        { id: "3", label: "Route to CEO Approval", type: "action", x: 450, y: 80, config: "Approver = CEO" },
        { id: "4", label: "Route to PM Approval", type: "action", x: 450, y: 220, config: "Approver = PM" },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e2-4", source: "2", target: "4" },
      ],
    },
    lead: {
      nodes: [
        { id: "1", label: "Lead Created", type: "trigger", x: 50, y: 150, config: "Source = Any" },
        { id: "2", label: "Industry = Technology?", type: "condition", x: 250, y: 150, config: "Field = Tech" },
        { id: "3", label: "Assign to Sales Manager", type: "action", x: 480, y: 80, config: "Owner = Sales Manager" },
        { id: "4", label: "Assign to Operations", type: "action", x: 480, y: 220, config: "Owner = Ops Team" },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e2-4", source: "2", target: "4" },
      ],
    },
    inventory: {
      nodes: [
        { id: "1", label: "Stock Low Alert", type: "trigger", x: 50, y: 150, config: "Qty <= MinThreshold" },
        { id: "2", label: "Auto Draft PO Request", type: "action", x: 260, y: 150, config: "Supplier = Contracted" },
        { id: "3", label: "Notify Logistics Manager", type: "action", x: 480, y: 150, config: "Channel = Email" },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
      ],
    },
    expense: {
      nodes: [
        { id: "1", label: "Expense Logged", type: "trigger", x: 50, y: 150, config: "Status = Submitted" },
        { id: "2", label: "Value > $5,000?", type: "condition", x: 250, y: 150, config: "Amount > 5000" },
        { id: "3", label: "Route to Finance Manager", type: "action", x: 480, y: 80, config: "Approver = Finance Manager" },
        { id: "4", label: "Auto-Approve Expense", type: "action", x: 480, y: 220, config: "Auto = True" },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e2-4", source: "2", target: "4" },
      ],
    },
  }

  // Active state
  const [nodes, setNodes] = React.useState<Node[]>(templates.onboarding.nodes)
  const [edges, setEdges] = React.useState<Edge[]>(templates.onboarding.edges)
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null)
  const [draggingNodeId, setDraggingNodeId] = React.useState<string | null>(null)
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 })

  const canvasRef = React.useRef<HTMLDivElement>(null)

  if (isEmployee) return null

  // Actions: Load Template
  const handleLoadTemplate = (name: string) => {
    const t = templates[name]
    if (t) {
      setNodes(t.nodes)
      setEdges(t.edges)
      setSelectedNodeId(null)
    }
  }

  // HTML5 Drag-and-Drop simulation handlers
  const handleDragStart = (e: React.DragEvent, type: Node["type"]) => {
    if (!isOpsOrAdmin) return
    e.dataTransfer.setData("nodeType", type)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!isOpsOrAdmin || !canvasRef.current) return
    e.preventDefault()

    const nodeType = e.dataTransfer.getData("nodeType") as Node["type"]
    if (!nodeType) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 60
    const y = e.clientY - rect.top - 30

    const newId = `node-${Math.floor(100 + Math.random() * 900)}`
    const newNode: Node = {
      id: newId,
      label: `New ${nodeType.toUpperCase()}`,
      type: nodeType,
      x: Math.max(10, Math.min(x, rect.width - 150)),
      y: Math.max(10, Math.min(y, rect.height - 80)),
      config: "Default = True",
    }

    setNodes((prev) => [...prev, newNode])
    setSelectedNodeId(newId)
  }

  // Node movement / dragging inside canvas
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    if (!isOpsOrAdmin) return
    e.stopPropagation()
    const node = nodes.find((n) => n.id === id)
    if (!node) return

    setDraggingNodeId(id)
    setSelectedNodeId(id)

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      // Offset relative to node card's top-left corner
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y,
      })
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current || !isOpsOrAdmin) return

    const rect = canvasRef.current.getBoundingClientRect()
    const rawX = e.clientX - rect.left - dragOffset.x
    const rawY = e.clientY - rect.top - dragOffset.y

    // Boundaries check
    const x = Math.max(10, Math.min(rawX, rect.width - 150))
    const y = Math.max(10, Math.min(rawY, rect.height - 80))

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === draggingNodeId) {
          return { ...n, x, y }
        }
        return n
      })
    )
  }

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null)
  }

  // Connection Builder (Add Edge)
  const handleAddEdge = (targetId: string) => {
    if (!isOpsOrAdmin || !selectedNodeId || selectedNodeId === targetId) return

    // Avoid duplicate edges
    const exists = edges.some((e) => e.source === selectedNodeId && e.target === targetId)
    if (exists) return

    const newEdge: Edge = {
      id: `edge-${selectedNodeId}-${targetId}`,
      source: selectedNodeId,
      target: targetId,
    }
    setEdges((prev) => [...prev, newEdge])
  }

  // Delete Node
  const handleDeleteNode = (id: string) => {
    if (!isOpsOrAdmin) return
    setNodes((prev) => prev.filter((n) => n.id !== id))
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id))
    if (selectedNodeId === id) setSelectedNodeId(null)
  }

  // Delete Edge
  const handleDeleteEdge = (id: string) => {
    if (!isOpsOrAdmin) return
    setEdges((prev) => prev.filter((e) => e.id !== id))
  }

  // Selected Node Details
  const selectedNode = React.useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null
  }, [nodes, selectedNodeId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Workflow Automation</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure GlowHaat event trigger pipelines, design routing steps, and deploy automation templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Template dropdown */}
          <Select
            label=""
            options={[
              { label: "Onboarding Template", value: "onboarding" },
              { label: "Purchase Approval Template", value: "purchase" },
              { label: "Lead Assignment Template", value: "lead" },
              { label: "Inventory Reorder Template", value: "inventory" },
              { label: "Expense Approval Template", value: "expense" },
            ]}
            onChange={(e: any) => handleLoadTemplate(e.target.value)}
            className="w-48 text-xs"
          />

          {isOpsOrAdmin && (
            <Button onClick={() => alert("Workflow automation configuration saved!")} size="sm">
              <Save className="mr-1.5 h-4 w-4" />
              Save Pipeline
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Builder Canvas + Left Sidebar Nodes + Right Editor */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Side: Drag and Drop Source Nodes (Operations/Admin only) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Node Library</CardTitle>
              <CardDescription className="text-[10px]">
                {isOpsOrAdmin ? "Drag these elements onto the canvas grid." : "Available automation shapes."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div
                draggable={isOpsOrAdmin}
                onDragStart={(e) => handleDragStart(e, "trigger")}
                className={`p-3 bg-success/15 border border-success/35 text-success rounded-xl font-bold ${
                  isOpsOrAdmin ? "cursor-grab active:cursor-grabbing hover:bg-success/20" : "cursor-not-allowed"
                }`}
              >
                Trigger Event
              </div>

              <div
                draggable={isOpsOrAdmin}
                onDragStart={(e) => handleDragStart(e, "condition")}
                className={`p-3 bg-warning/15 border border-warning/35 text-warning rounded-xl font-bold ${
                  isOpsOrAdmin ? "cursor-grab active:cursor-grabbing hover:bg-warning/20" : "cursor-not-allowed"
                }`}
              >
                Condition Router
              </div>

              <div
                draggable={isOpsOrAdmin}
                onDragStart={(e) => handleDragStart(e, "action")}
                className={`p-3 bg-primary/15 border border-primary/35 text-primary rounded-xl font-bold ${
                  isOpsOrAdmin ? "cursor-grab active:cursor-grabbing hover:bg-primary/20" : "cursor-not-allowed"
                }`}
              >
                Action Dispatch
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Canvas: Drag-and-Drop Grid Board */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-grow min-h-[400px] border-border/60 relative overflow-hidden">
            {/* Custom Dot Grid Background representing React Flow Grid */}
            <div
              ref={canvasRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className="absolute inset-0 select-none bg-card"
              style={{
                backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            >
              {/* SVG Overlays: redrawing bezier paths for edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {edges.map((edge) => {
                  const src = nodes.find((n) => n.id === edge.source)
                  const tgt = nodes.find((n) => n.id === edge.target)
                  if (!src || !tgt) return null

                  // Source right-handle, Target left-handle coordinates
                  const x1 = src.x + 130
                  const y1 = src.y + 35
                  const x2 = tgt.x
                  const y2 = tgt.y + 35

                  // Bezier path curves
                  return (
                    <g key={edge.id}>
                      <path
                        d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="2.5"
                        className="animate-pulse"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Render Nodes cards */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id
                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: 130,
                      height: 70,
                    }}
                    className={`absolute z-10 p-3 bg-card border rounded-xl shadow-sm text-[11px] leading-normal flex flex-col justify-between select-none ${
                      isSelected
                        ? "border-primary ring-1 ring-primary"
                        : node.type === "trigger"
                        ? "border-success/35 bg-success/5"
                        : node.type === "condition"
                        ? "border-warning/35 bg-warning/5"
                        : "border-primary/35 bg-primary/5"
                    } ${isOpsOrAdmin ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                  >
                    {/* Handles circles */}
                    <div className="absolute top-[31px] -left-1.5 h-3 w-3 rounded-full bg-secondary border border-border" />
                    <div className="absolute top-[31px] -right-1.5 h-3 w-3 rounded-full bg-secondary border border-border" />

                    <div>
                      <span className={`text-[8px] font-black uppercase ${
                        node.type === "trigger"
                          ? "text-success"
                          : node.type === "condition"
                          ? "text-warning"
                          : "text-primary"
                      }`}>
                        {node.type}
                      </span>
                      <p className="font-bold text-foreground truncate mt-0.5">{node.label}</p>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-muted-foreground mt-1">
                      <span className="truncate">{node.config}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Editor Side: Node Properties & Edge Managers */}
        <div className="lg:col-span-1 space-y-6">
          {/* Node Editor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Properties Panel</CardTitle>
              <CardDescription className="text-[10px]">Select a node card on the canvas to edit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {selectedNode ? (
                <div className="space-y-3">
                  <Input
                    label="Node Label"
                    value={selectedNode.label}
                    disabled={!isOpsOrAdmin}
                    onChange={(e) =>
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, label: e.target.value } : n))
                      )
                    }
                  />

                  <Input
                    label="Config trigger criteria"
                    value={selectedNode.config}
                    disabled={!isOpsOrAdmin}
                    onChange={(e) =>
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, config: e.target.value } : n))
                      )
                    }
                  />

                  {/* Connect Targets controls (Ops/Admin only) */}
                  {isOpsOrAdmin && (
                    <div className="space-y-1.5 pt-2">
                      <span className="font-bold text-[10px] text-muted-foreground uppercase">Connect target node</span>
                      <Select
                        label=""
                        options={nodes
                          .filter((n) => n.id !== selectedNode.id)
                          .map((n) => ({ label: n.label, value: n.id }))}
                        onChange={(e: any) => handleAddEdge(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  )}

                  {isOpsOrAdmin && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleDeleteNode(selectedNode.id)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Delete Node
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center text-[10px] text-muted-foreground italic py-6">No node selected</p>
              )}
            </CardContent>
          </Card>

          {/* Connections list */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Active Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {edges.map((edge) => {
                const src = nodes.find((n) => n.id === edge.source)
                const tgt = nodes.find((n) => n.id === edge.target)
                return (
                  <div key={edge.id} className="p-2 border border-border/40 bg-card rounded-xl flex items-center justify-between">
                    <span className="font-semibold text-[10px]">
                      {src?.label || "Unknown"} ➔ {tgt?.label || "Unknown"}
                    </span>
                    {isOpsOrAdmin && (
                      <Button size="xs" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleDeleteEdge(edge.id)}>
                        <X className="h-3 w-3 text-danger" />
                      </Button>
                    )}
                  </div>
                );
              })}
              {edges.length === 0 && (
                <p className="text-center text-[10px] text-muted-foreground/60 italic py-4">No active connections</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
