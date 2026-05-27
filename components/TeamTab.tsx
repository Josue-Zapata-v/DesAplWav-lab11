"use client"

import { useState } from "react"
import { useDashboard, Member } from "@/context/DashboardContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyForm = {
  name: "",
  email: "",
  role: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: "",
  isActive: true,
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

// ─── Subcomponente: campo de fecha con Calendar ───────────────────────────────

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
          <Button variant="outline" className="justify-start text-left font-normal">
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

export function TeamTab() {
  const { members, projects, addMember, updateMember, deleteMember } = useDashboard()

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<string | null>(null)
  const [formData, setFormData] = useState({ ...emptyForm })
  const [editData, setEditData] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null)

  // ── Validación ──────────────────────────────────────────────────────────────

  const validate = (data: typeof emptyForm) => {
    if (!data.name.trim()) return "El nombre es obligatorio."
    if (!data.email.trim()) return "El email es obligatorio."
    if (!data.email.includes("@")) return "El email no es válido."
    if (!data.role) return "Selecciona un rol."
    if (!data.position) return "Selecciona una posición."
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
      addMember({ ...formData })
      setFormData({ ...emptyForm })
      setLoading(false)
      setOpenCreate(false)
      setAlert({ type: "success", message: "Miembro agregado correctamente." })
      setTimeout(() => setAlert(null), 3000)
    }, 1200)
  }

  // ── Editar ──────────────────────────────────────────────────────────────────

  const handleOpenEdit = (member: Member) => {
    setEditData({
      name: member.name,
      email: member.email,
      role: member.role,
      position: member.position,
      birthdate: member.birthdate,
      phone: member.phone,
      projectId: member.projectId,
      isActive: member.isActive,
    })
    setOpenEdit(member.userId)
    setAlert(null)
  }

  const handleEdit = (e: React.FormEvent, userId: string) => {
    e.preventDefault()
    const error = validate(editData)
    if (error) {
      setAlert({ type: "error", message: error })
      return
    }
    setLoading(true)
    setAlert(null)
    setTimeout(() => {
      updateMember(userId, { ...editData })
      setLoading(false)
      setOpenEdit(null)
      setAlert({ type: "success", message: "Miembro actualizado correctamente." })
      setTimeout(() => setAlert(null), 3000)
    }, 1200)
  }

  // ── Eliminar ────────────────────────────────────────────────────────────────

  const handleDelete = (userId: string) => {
    setLoading(true)
    setTimeout(() => {
      deleteMember(userId)
      setLoading(false)
      setAlert({ type: "success", message: "Miembro eliminado correctamente." })
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

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Nombre completo <span className="text-destructive">*</span></Label>
          <Input
            placeholder="Juan Pérez"
            value={data.name}
            onChange={(e) => set({ ...data, name: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>Email <span className="text-destructive">*</span></Label>
          <Input
            type="email"
            placeholder="juan@empresa.com"
            value={data.email}
            onChange={(e) => set({ ...data, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Rol <span className="text-destructive">*</span></Label>
          <Select value={data.role} onValueChange={(v) => set({ ...data, role: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
              <SelectItem value="Backend Developer">Backend Developer</SelectItem>
              <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
              <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
              <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
              <SelectItem value="Project Manager">Project Manager</SelectItem>
              <SelectItem value="QA Engineer">QA Engineer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Posición <span className="text-destructive">*</span></Label>
          <Select value={data.position} onValueChange={(v) => set({ ...data, position: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar posición" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Junior">Junior</SelectItem>
              <SelectItem value="Mid">Mid</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Principal">Principal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Teléfono</Label>
          <Input
            placeholder="999-000-000"
            value={data.phone}
            onChange={(e) => set({ ...data, phone: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>Proyecto asignado</Label>
          <Select value={data.projectId} onValueChange={(v) => set({ ...data, projectId: v })}>
            <SelectTrigger><SelectValue placeholder="Sin proyecto" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="none">Sin proyecto</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
          </Select>
        </div>
      </div>

      <DatePickerField
        label="Fecha de nacimiento"
        value={data.birthdate}
        onChange={(val) => set({ ...data, birthdate: val })}
      />

      <div className="flex items-center gap-3 p-3 border rounded-md">
        <Switch
          checked={data.isActive}
          onCheckedChange={(checked) => set({ ...data, isActive: checked })}
        />
        <div>
          <p className="text-sm font-medium">Miembro activo</p>
          <p className="text-xs text-muted-foreground">
            {data.isActive ? "El miembro aparecerá como activo en el sistema" : "El miembro estará inactivo"}
          </p>
        </div>
      </div>
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
              <CardTitle>Miembros del Equipo</CardTitle>
              <CardDescription>
                Gestiona los miembros de tu equipo — {members.length} registrados,{" "}
                {members.filter((m) => m.isActive).length} activos
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
                  Nuevo Miembro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[560px]">
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Miembro</DialogTitle>
                    <DialogDescription>
                      Completa la información del miembro del equipo.
                    </DialogDescription>
                  </DialogHeader>
                  {renderForm(formData, setFormData)}
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpenCreate(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && <Spinner className="mr-2" />}
                      {loading ? "Agregando..." : "Agregar Miembro"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {members.map((member) => {
              const project = projects.find((p) => p.id === member.projectId)
              return (
                <div key={member.userId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.position} {member.role}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                      {member.phone && (
                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      {project && (
                        <p className="text-xs text-muted-foreground">{project.name}</p>
                      )}
                      {member.birthdate && (
                        <p className="text-xs text-muted-foreground">
                          Nac. {formatDate(member.birthdate)}
                        </p>
                      )}
                    </div>

                    <Badge variant={member.isActive ? "default" : "secondary"}>
                      {member.isActive ? "Activo" : "Inactivo"}
                    </Badge>

                    {/* Botón editar */}
                    <Dialog
                      open={openEdit === member.userId}
                      onOpenChange={(v) => {
                        if (!v) { setOpenEdit(null); setAlert(null) }
                        else handleOpenEdit(member)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline"
                          onClick={() => handleOpenEdit(member)}>
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[560px]">
                        <form onSubmit={(e) => handleEdit(e, member.userId)}>
                          <DialogHeader>
                            <DialogTitle>Editar Miembro</DialogTitle>
                            <DialogDescription>
                              Modifica la información de {member.name}.
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

                    {/* Botón eliminar */}
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
                          <DialogTitle>Eliminar miembro</DialogTitle>
                          <DialogDescription>
                            ¿Estás seguro de que deseas eliminar a{" "}
                            <span className="font-semibold">{member.name}</span>?
                            Esta acción no se puede deshacer.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                          <Button variant="outline">Cancelar</Button>
                          <Button variant="destructive" disabled={loading}
                            onClick={() => handleDelete(member.userId)}>
                            {loading && <Spinner className="mr-2" />}
                            {loading ? "Eliminando..." : "Sí, eliminar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}