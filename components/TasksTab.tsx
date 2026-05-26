"use client"

import { useState } from "react"
import { useDashboard, Task } from "@/context/DashboardContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5

const emptyForm = {
  description: "",
  projectId: "",
  status: "",
  priority: "",
  userId: "",
  deadline: "",
}

function formatDate(dateStr: string) {
  if (!dateStr) return "Sin fecha"
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

function dateToCalendar(dateStr: string): Date | undefined {
  if (!dateStr) return undefined
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function calendarToString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado": return "default"
    case "En progreso": return "secondary"
    case "Pendiente": return "outline"
    default: return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente": return "destructive"
    case "Alta": return "default"
    case "Media": return "secondary"
    case "Baja": return "outline"
    default: return "outline"
  }
}

// ─── DatePicker reutilizable ──────────────────────────────────────────────────

function DatePickerField({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (val: string) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const selected = dateToCalendar(value)

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" className="mr-2 h-4 w-4 text-muted-foreground">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {value ? formatDate(value) : "Seleccionar fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(calendarToString(date))
                setOpen(false)
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function TasksTab() {
  const { tasks, projects, members, addTask, updateTask, deleteTask } = useDashboard()

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<string | null>(null)
  const [formData, setFormData] = useState({ ...emptyForm })
  const [editData, setEditData] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("todos")
  const [filterPriority, setFilterPriority] = useState("todos")

  // ── Filtrado y paginación ───────────────────────────────────────────────────

  const filtered = tasks.filter((t) => {
    const matchStatus = filterStatus === "todos" || t.status === filterStatus
    const matchPriority = filterPriority === "todos" || t.priority === filterPriority
    return matchStatus && matchPriority
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  )

  const handleFilterStatus = (val: string) => {
    setFilterStatus(val)
    setCurrentPage(1)
  }

  const handleFilterPriority = (val: string) => {
    setFilterPriority(val)
    setCurrentPage(1)
  }

  // ── Validación ──────────────────────────────────────────────────────────────

  const validate = (data: typeof emptyForm) => {
    if (!data.description.trim()) return "La descripción es obligatoria."
    if (!data.projectId) return "Selecciona un proyecto."
    if (!data.status) return "Selecciona un estado."
    if (!data.priority) return "Selecciona una prioridad."
    if (!data.userId) return "Asigna un responsable."
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
      addTask({ ...formData })
      setFormData({ ...emptyForm })
      setLoading(false)
      setOpenCreate(false)
      setAlert({ type: "success", message: "Tarea creada correctamente." })
      setTimeout(() => setAlert(null), 3000)
    }, 1200)
  }

  // ── Editar ──────────────────────────────────────────────────────────────────

  const handleOpenEdit = (task: Task) => {
    setEditData({
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      userId: task.userId,
      deadline: task.deadline,
    })
    setOpenEdit(task.id)
    setAlert(null)
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
      updateTask(id, { ...editData })
      setLoading(false)
      setOpenEdit(null)
      setAlert({ type: "success", message: "Tarea actualizada correctamente." })
      setTimeout(() => setAlert(null), 3000)
    }, 1200)
  }

  // ── Eliminar ────────────────────────────────────────────────────────────────

  const handleDelete = (id: string) => {
    setLoading(true)
    setTimeout(() => {
      deleteTask(id)
      setLoading(false)
      setAlert({ type: "success", message: "Tarea eliminada correctamente." })
      setTimeout(() => setAlert(null), 3000)
    }, 800)
  }

  // ── Formulario compartido ───────────────────────────────────────────────────

  const renderForm = (
    data: typeof emptyForm,
    set: React.Dispatch<React.SetStateAction<typeof emptyForm>>
  ) => (
    <div className="grid gap-4 py-4">
      {alert?.type === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Error de validación</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label>Descripción <span className="text-destructive">*</span></Label>
        <Input
          placeholder="Describe la tarea..."
          value={data.description}
          onChange={(e) => set({ ...data, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Proyecto <span className="text-destructive">*</span></Label>
          <Select value={data.projectId} onValueChange={(v) => set({ ...data, projectId: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar proyecto" /></SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Responsable <span className="text-destructive">*</span></Label>
          <Select value={data.userId} onValueChange={(v) => set({ ...data, userId: v })}>
            <SelectTrigger><SelectValue placeholder="Asignar a..." /></SelectTrigger>
            <SelectContent>
              {members.map((m) => (
                <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Estado <span className="text-destructive">*</span></Label>
          <Select value={data.status} onValueChange={(v) => set({ ...data, status: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Prioridad <span className="text-destructive">*</span></Label>
          <Select value={data.priority} onValueChange={(v) => set({ ...data, priority: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar prioridad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Baja">Baja</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DatePickerField
        label="Fecha límite"
        value={data.deadline}
        onChange={(val) => set({ ...data, deadline: val })}
      />
    </div>
  )

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Alert global */}
      {alert?.type === "success" && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Tareas</CardTitle>
              <CardDescription>
                {filtered.length} tarea{filtered.length !== 1 ? "s" : ""} encontrada
                {filtered.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>

            {/* Botón crear */}
            <Dialog open={openCreate} onOpenChange={(v) => { setOpenCreate(v); setAlert(null) }}>
              <DialogTrigger asChild>
                <Button>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" className="mr-2 h-4 w-4">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                  Nueva Tarea
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[540px]">
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Tarea</DialogTitle>
                    <DialogDescription>
                      Completa la información de la tarea.
                    </DialogDescription>
                  </DialogHeader>
                  {renderForm(formData, setFormData)}
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpenCreate(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && <Spinner className="mr-2" />}
                      {loading ? "Creando..." : "Crear Tarea"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filtros */}
          <div className="flex gap-3 pt-2">
            <Select value={filterStatus} onValueChange={handleFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filtrar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={handleFilterPriority}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filtrar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las prioridades</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"><Checkbox /></TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No hay tareas que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId)
                    const member = members.find((m) => m.userId === task.userId)
                    return (
                      <TableRow key={task.id}>
                        <TableCell><Checkbox /></TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {task.description}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {project?.name ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {member?.name ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={priorityVariant(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(task.deadline)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Editar */}
                            <Dialog
                              open={openEdit === task.id}
                              onOpenChange={(v) => {
                                if (!v) { setOpenEdit(null); setAlert(null) }
                                else handleOpenEdit(task)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline"
                                  onClick={() => handleOpenEdit(task)}>
                                  Editar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[540px]">
                                <form onSubmit={(e) => handleEdit(e, task.id)}>
                                  <DialogHeader>
                                    <DialogTitle>Editar Tarea</DialogTitle>
                                    <DialogDescription>
                                      Modifica los datos de la tarea.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {renderForm(editData, setEditData)}
                                  <DialogFooter>
                                    <Button type="button" variant="outline"
                                      onClick={() => { setOpenEdit(null); setAlert(null) }}>
                                      Cancelar
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                      {loading && <Spinner className="mr-2" />}
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
                                    strokeLinecap="round" strokeLinejoin="round"
                                    className="h-4 w-4">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                  </svg>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[400px]">
                                <DialogHeader>
                                  <DialogTitle>Eliminar tarea</DialogTitle>
                                  <DialogDescription>
                                    ¿Estás seguro de que deseas eliminar{" "}
                                    <span className="font-semibold">
                                      {task.description}
                                    </span>?
                                    Esta acción no se puede deshacer.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-4">
                                  <Button variant="outline">Cancelar</Button>
                                  <Button variant="destructive" disabled={loading}
                                    onClick={() => handleDelete(task.id)}>
                                    {loading && <Spinner className="mr-2" />}
                                    {loading ? "Eliminando..." : "Sí, eliminar"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Página {safePage} de {totalPages} —{" "}
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-disabled={safePage === 1}
                    className={safePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === safePage}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={safePage === totalPages}
                    className={safePage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}