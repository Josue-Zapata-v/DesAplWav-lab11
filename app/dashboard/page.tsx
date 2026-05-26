"use client"

import { DashboardProvider } from "@/context/DashboardContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/OverviewTab"
import { ProjectsTab } from "@/components/ProjectsTab"
import { TeamTab } from "@/components/TeamTab"
import { TasksTab } from "@/components/TasksTab"
import { SettingsTab } from "@/components/SettingsTab"

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Dashboard de Proyectos
            </h1>
            <p className="text-muted-foreground">
              Gestiona tus proyectos y tareas con shadcn/ui
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="projects">Proyectos</TabsTrigger>
              <TabsTrigger value="team">Equipo</TabsTrigger>
              <TabsTrigger value="tasks">Tareas</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsTab />
            </TabsContent>
            <TabsContent value="team">
              <TeamTab />
            </TabsContent>
            <TabsContent value="tasks">
              <TasksTab />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardProvider>
  )
}