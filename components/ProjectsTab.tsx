"use client"

import { useState } from "react"
import { useDashboard, Project } from "@/context/DashboardContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado": return "default"
    case "En revisión": return "secondary"
    default: return "outline"
  }
}

const priorityLabel: Record<string, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
}

const categoryLabel: Record<string, string> = {
  web: "Desarrollo Web",
  mobile: "Desarrollo Mobile",
  design: "Diseño",
  marketing: "Marketing",
  other: "Otro",
}

const emptyForm = {
  name: "",
  description: "",
  category: "",
  priority: "",
  status: "Planificado",
  progress: 0,
  members: [] as string[],
}

// ─── Componente detalle ───────────────────────────────────────────────────────

function ProjectDetailDialog({ project, members }: {
  project: Project
  members: { userId: string; name: string }[]
}) {
  const projectMembers = members.filter((m) => project.members.includes(m.userId))

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{project.name}</DialogTitle>
        <DialogDescription>{project.description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Categoría</p>
            <p className="font-medium">{categoryLabel[project.category] ?? project.category}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Prioridad</p>
            <p className="font-medium">{priorityLabel[project.priority] ?? project.priority}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Estado</p>
            <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Progreso</p>
            <p className="font-medium">{project.progress}%</p>
          </div>
        </div>

        <div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm mb-2">Miembros del equipo</p>
          {projectMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin miembros asignados</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {projectMembers.map((m) => (
                <Badge key={m.userId} variant="secondary">{m.name}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ProjectsTab() {
  const { projects, members, addProject, updateProject, deleteProject } = useDashboard()

  const [openCreate, setOpenCreate] = useState(false)
  const [openDetail, setOpenDetail] = useState<string | null>(null)
  const [openEdit, setOpenEdit] = useState<string | null>(null)
  const [formData, setFormData] = useState({ ...emptyForm })
  const [editData, setEditData] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null)

  // ── Validación ──────────────────────────────────────────────────────────────

  const validate = (data: typeof emptyForm) => {
    if (!data.name.trim()) return "El nombre del proyecto es obligatorio."
    if (!data.category) return "Selecciona una categoría."
    if (!data.priority) return "Selecciona una prioridad."
    return null
  }

  // ── Crear ───────────────────────────────────────────────────────────────────

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validate(formData)
    if (error) {
      setAlert({ type: "error", message: error })
      return
    }
    setLoading(true)
    setAlert(null)
    setTimeout(() => {
      addProject({ ...formData })
      setFormData({ ...emptyForm })
      setLoading(false)
      setOpenCreate(false)
      setAlert({ type: "success", message: "Proyecto creado correctamente." })
      setTimeout(() => setAlert(null), 3000)
    }, 1200)
  }

  // ── Editar ──────────────────────────────────────────────────────────────────

  const handleOpenEdit = (project: Project) => {
    setEditData({
      name: project.name,
      description: project.description,
      category: project.category,
      priority: project.priority,
      status: project.status,
      progress: project.progress,
      members: project.members,
    })
    setOpenEdit(project.id)
  }

  const handleEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault()
    const error = validate(editData)
    if (error) {
      setAlert({ type: "error", message: error })
      return
    }
    setLoading(true)
    setAlert(null)
    setTimeout(() => {
      updateProject(id, { ...editData })
      setLoading(false)
      setOpenEdit(null)
      setAlert({ type: "success", message: "Proyecto actualizado correctamente." })
      setTimeout(() => setAlert(null), 3000)
    }, 1200)
  }

  // ── Eliminar ────────────────────────────────────────────────────────────────

  const handleDelete = (id: string) => {
    setLoading(true)
    setTimeout(() => {
      deleteProject(id)
      setLoading(false)
      setAlert({ type: "success", message: "Proyecto eliminado." })
      setTimeout(() => setAlert(null), 3000)
    }, 800)
  }

  // ── Form compartido ─────────────────────────────────────────────────────────

  const renderForm = (
    data: typeof emptyForm,
    set: React.Dispatch<React.SetStateAction<typeof emptyForm>>,
    showStatus = false
  ) => (
    <div className="grid gap-4 py-4">
      {alert?.type === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label>Nombre del Proyecto <span className="text-destructive">*</span></Label>
        <Input
          placeholder="Mi Proyecto Increíble"
          value={data.name}
          onChange={(e) => set({ ...data, name: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Descripción</Label>
        <Input
          placeholder="Breve descripción..."
          value={data.description}
          onChange={(e) => set({ ...data, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Categoría <span className="text-destructive">*</span></Label>
          <Select value={data.category} onValueChange={(v) => set({ ...data, category: v })}>
            <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Desarrollo Web</SelectItem>
              <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
              <SelectItem value="design">Diseño</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Prioridad <span className="text-destructive">*</span></Label>
          <Select value={data.priority} onValueChange={(v) => set({ ...data, priority: v })}>
            <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showStatus && (
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Estado</Label>
            <Select value={data.status} onValueChange={(v) => set({ ...data, status: v })}>
              <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Planificado">Planificado</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="En revisión">En revisión</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Progreso (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={data.progress}
              onChange={(e) => set({ ...data, progress: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <Label>Miembros del equipo</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[48px]">
          {members.map((m) => {
            const selected = data.members.includes(m.userId)
            return (
              <button
                key={m.userId}
                type="button"
                onClick={() => {
                  const updated = selected
                    ? data.members.filter((id) => id !== m.userId)
                    : [...data.members, m.userId]
                  set({ ...data, members: updated })
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary"
                }`}
              >
                {m.name}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">Haz clic para seleccionar/deseleccionar</p>
      </div>
    </div>
  )

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Alert global de éxito */}
      {alert?.type === "success" && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Botón crear */}
      <div className="flex justify-end">
        <Dialog open={openCreate} onOpenChange={(v) => { setOpenCreate(v); setAlert(null) }}>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M5 12h14" /><path d="M12 5v14" />
              </svg>
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[540px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                <DialogDescription>
                  Completa la información del proyecto.
                </DialogDescription>
              </DialogHeader>
              {renderForm(formData, setFormData, false)}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenCreate(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner className="mr-2" /> : null}
                  {loading ? "Creando..." : "Crear Proyecto"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de proyectos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{project.members.length} miembros</span>
                  <Badge variant="outline" className="text-xs">
                    {priorityLabel[project.priority] ?? project.priority}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-1">
                  {/* Ver detalles */}
                  <Dialog open={openDetail === project.id}
                    onOpenChange={(v) => setOpenDetail(v ? project.id : null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-1">
                        Ver detalles
                      </Button>
                    </DialogTrigger>
                    <ProjectDetailDialog project={project} members={members} />
                  </Dialog>

                  {/* Editar */}
                  <Dialog open={openEdit === project.id}
                    onOpenChange={(v) => { if (!v) setOpenEdit(null); else handleOpenEdit(project) }}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary" className="flex-1"
                        onClick={() => handleOpenEdit(project)}>
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[540px]">
                      <form onSubmit={(e) => handleEdit(e, project.id)}>
                        <DialogHeader>
                          <DialogTitle>Editar Proyecto</DialogTitle>
                          <DialogDescription>Modifica los datos del proyecto.</DialogDescription>
                        </DialogHeader>
                        {renderForm(editData, setEditData, true)}
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setOpenEdit(null)}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? <Spinner className="mr-2" /> : null}
                            {loading ? "Guardando..." : "Guardar cambios"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Eliminar */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle>Eliminar proyecto</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que deseas eliminar{" "}
                          <span className="font-semibold">{project.name}</span>?
                          Esta acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => {}}>Cancelar</Button>
                        <Button variant="destructive" disabled={loading}
                          onClick={() => handleDelete(project.id)}>
                          {loading ? <Spinner className="mr-2" /> : null}
                          {loading ? "Eliminando..." : "Sí, eliminar"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}