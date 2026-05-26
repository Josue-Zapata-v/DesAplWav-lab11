"use client"

import React, { createContext, useContext, useState } from "react"

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  name: string
  description: string
  category: string
  priority: string
  status: string
  progress: number
  members: string[]
}

export interface Member {
  userId: string
  name: string
  email: string
  role: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: string
  priority: string
  userId: string
  deadline: string
}

export interface Settings {
  companyName: string
  timezone: string
  language: string
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyReport: boolean
  twoFactor: boolean
  publicProfile: boolean
}

// ─── Datos iniciales ──────────────────────────────────────────────────────────

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    category: "web",
    priority: "high",
    status: "En progreso",
    progress: 65,
    members: ["m1", "m2", "m3"],
  },
  {
    id: "p2",
    name: "Mobile App",
    description: "Aplicación móvil con React Native",
    category: "mobile",
    priority: "medium",
    status: "En revisión",
    progress: 90,
    members: ["m3", "m4"],
  },
  {
    id: "p3",
    name: "Dashboard Analytics",
    description: "Panel de análisis con visualizaciones",
    category: "web",
    priority: "low",
    status: "Planificado",
    progress: 20,
    members: ["m1", "m5"],
  },
  {
    id: "p4",
    name: "API Gateway",
    description: "Microservicios con Node.js",
    category: "other",
    priority: "urgent",
    status: "En progreso",
    progress: 45,
    members: ["m2", "m4", "m5"],
  },
  {
    id: "p5",
    name: "Design System",
    description: "Librería de componentes reutilizables",
    category: "design",
    priority: "medium",
    status: "Completado",
    progress: 100,
    members: ["m3"],
  },
  {
    id: "p6",
    name: "Marketing Website",
    description: "Sitio web institucional",
    category: "marketing",
    priority: "low",
    status: "En progreso",
    progress: 75,
    members: ["m1", "m5"],
  },
]

const initialMembers: Member[] = [
  {
    userId: "m1",
    name: "María García",
    email: "maria@example.com",
    role: "Frontend Developer",
    position: "Senior",
    birthdate: "1995-03-15",
    phone: "999-111-001",
    projectId: "p1",
    isActive: true,
  },
  {
    userId: "m2",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "Backend Developer",
    position: "Mid",
    birthdate: "1993-07-22",
    phone: "999-111-002",
    projectId: "p1",
    isActive: true,
  },
  {
    userId: "m3",
    name: "Ana López",
    email: "ana@example.com",
    role: "UI/UX Designer",
    position: "Senior",
    birthdate: "1997-01-10",
    phone: "999-111-003",
    projectId: "p2",
    isActive: false,
  },
  {
    userId: "m4",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    role: "DevOps Engineer",
    position: "Senior",
    birthdate: "1990-11-05",
    phone: "999-111-004",
    projectId: "p4",
    isActive: true,
  },
  {
    userId: "m5",
    name: "Laura Martínez",
    email: "laura@example.com",
    role: "Project Manager",
    position: "Lead",
    birthdate: "1988-06-30",
    phone: "999-111-005",
    projectId: "p3",
    isActive: true,
  },
]

const initialTasks: Task[] = [
  {
    id: "t1",
    description: "Implementar autenticación",
    projectId: "p1",
    status: "En progreso",
    priority: "Alta",
    userId: "m1",
    deadline: "2025-11-15",
  },
  {
    id: "t2",
    description: "Diseñar pantalla de perfil",
    projectId: "p2",
    status: "Pendiente",
    priority: "Media",
    userId: "m3",
    deadline: "2025-11-20",
  },
  {
    id: "t3",
    description: "Configurar CI/CD",
    projectId: "p4",
    status: "Completado",
    priority: "Alta",
    userId: "m4",
    deadline: "2025-11-10",
  },
  {
    id: "t4",
    description: "Optimizar queries SQL",
    projectId: "p1",
    status: "En progreso",
    priority: "Urgente",
    userId: "m2",
    deadline: "2025-11-12",
  },
  {
    id: "t5",
    description: "Documentar API endpoints",
    projectId: "p4",
    status: "Pendiente",
    priority: "Baja",
    userId: "m5",
    deadline: "2025-11-25",
  },
  {
    id: "t6",
    description: "Crear componentes base",
    projectId: "p5",
    status: "Completado",
    priority: "Alta",
    userId: "m3",
    deadline: "2025-11-08",
  },
  {
    id: "t7",
    description: "Setup infraestructura cloud",
    projectId: "p3",
    status: "Pendiente",
    priority: "Media",
    userId: "m4",
    deadline: "2025-12-01",
  },
  {
    id: "t8",
    description: "Landing page hero section",
    projectId: "p6",
    status: "En progreso",
    priority: "Alta",
    userId: "m1",
    deadline: "2025-11-18",
  },
]

const initialSettings: Settings = {
  companyName: "Mi Empresa S.A.",
  timezone: "America/Lima",
  language: "es",
  emailNotifications: true,
  pushNotifications: false,
  weeklyReport: true,
  twoFactor: false,
  publicProfile: true,
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface DashboardContextType {
  projects: Project[]
  members: Member[]
  tasks: Task[]
  settings: Settings
  addProject: (p: Omit<Project, "id">) => void
  updateProject: (id: string, p: Partial<Project>) => void
  deleteProject: (id: string) => void
  addMember: (m: Omit<Member, "userId">) => void
  updateMember: (userId: string, m: Partial<Member>) => void
  deleteMember: (userId: string) => void
  addTask: (t: Omit<Task, "id">) => void
  updateTask: (id: string, t: Partial<Task>) => void
  deleteTask: (id: string) => void
  updateSettings: (s: Partial<Settings>) => void
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [settings, setSettings] = useState<Settings>(initialSettings)

  const addProject = (p: Omit<Project, "id">) => {
    const id = "p" + Date.now()
    setProjects((prev) => [...prev, { ...p, id }])
  }

  const updateProject = (id: string, p: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, ...p } : proj))
    )
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const addMember = (m: Omit<Member, "userId">) => {
    const userId = "m" + Date.now()
    setMembers((prev) => [...prev, { ...m, userId }])
  }

  const updateMember = (userId: string, m: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((mem) => (mem.userId === userId ? { ...mem, ...m } : mem))
    )
  }

  const deleteMember = (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
  }

  const addTask = (t: Omit<Task, "id">) => {
    const id = "t" + Date.now()
    setTasks((prev) => [...prev, { ...t, id }])
  }

  const updateTask = (id: string, t: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...t } : task))
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const updateSettings = (s: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...s }))
  }

  return (
    <DashboardContext.Provider
      value={{
        projects,
        members,
        tasks,
        settings,
        addProject,
        updateProject,
        deleteProject,
        addMember,
        updateMember,
        deleteMember,
        addTask,
        updateTask,
        deleteTask,
        updateSettings,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}