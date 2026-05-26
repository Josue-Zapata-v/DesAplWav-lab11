"use client"

import { useDashboard } from "@/context/DashboardContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function OverviewTab() {
  const { projects, members, tasks } = useDashboard()

  const totalProjects = projects.length
  const completedTasks = tasks.filter((t) => t.status === "Completado").length
  const activeMembers = members.filter((m) => m.isActive).length
  const inProgressTasks = tasks.filter((t) => t.status === "En progreso").length

  const recentActivity = [
    ...tasks.map((t) => {
      const member = members.find((m) => m.userId === t.userId)
      const project = projects.find((p) => p.id === t.projectId)
      return {
        user: member?.name ?? "Usuario",
        action: t.status === "Completado" ? "completó la tarea" : "actualizó la tarea",
        task: t.description,
        project: project?.name ?? "",
      }
    }),
  ].slice(0, 4)

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
              strokeWidth="2" className="h-4 w-4 text-primary">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter((p) => p.status === "Completado").length} completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
              strokeWidth="2" className="h-4 w-4 text-primary">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressTasks} en progreso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
              strokeWidth="2" className="h-4 w-4 text-primary">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.filter((t) => t.status === "Pendiente").length} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
              strokeWidth="2" className="h-4 w-4 text-primary">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {members.length - activeMembers} inactivos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progreso de proyectos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Proyectos</CardTitle>
            <CardDescription>Distribución por estado actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["En progreso", "Completado", "En revisión", "Planificado"].map((status) => {
              const count = projects.filter((p) => p.status === status).length
              const pct = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0
              const colors: Record<string, string> = {
                "En progreso": "bg-primary",
                "Completado": "bg-green-500",
                "En revisión": "bg-yellow-500",
                "Planificado": "bg-slate-400",
              }
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{status}</span>
                    <span className="font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${colors[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Tareas</CardTitle>
            <CardDescription>Distribución por prioridad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Urgente", "Alta", "Media", "Baja"].map((priority) => {
              const count = tasks.filter((t) => t.priority === priority).length
              const pct = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0
              const colors: Record<string, string> = {
                "Urgente": "bg-destructive",
                "Alta": "bg-primary",
                "Media": "bg-yellow-500",
                "Baja": "bg-slate-400",
              }
              return (
                <div key={priority}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{priority}</span>
                    <span className="font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${colors[priority]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {activity.user.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}{" "}
                    <span className="font-medium text-foreground">{activity.task}</span>
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.project}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}