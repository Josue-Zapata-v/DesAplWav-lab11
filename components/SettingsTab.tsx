"use client"

import { useState } from "react"
import { useDashboard } from "@/context/DashboardContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SettingsTab() {
  const { settings, updateSettings } = useDashboard()

  const [form, setForm] = useState({ ...settings })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null)
  const [saved, setSaved] = useState(false)

  // ── Validación ──────────────────────────────────────────────────────────────

  const validate = () => {
    if (!form.companyName.trim()) return "El nombre de la empresa es obligatorio."
    if (!form.timezone) return "Selecciona una zona horaria."
    if (!form.language) return "Selecciona un idioma."
    return null
  }

  // ── Guardar ─────────────────────────────────────────────────────────────────

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validate()
    if (error) {
      setAlert({ type: "error", message: error })
      return
    }
    setLoading(true)
    setAlert(null)
    setTimeout(() => {
      updateSettings({ ...form })
      setLoading(false)
      setSaved(true)
      setAlert({ type: "success", message: "Configuración guardada correctamente." })
      setTimeout(() => {
        setAlert(null)
        setSaved(false)
      }, 3000)
    }, 1400)
  }

  // ── Reset ────────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setForm({ ...settings })
    setAlert(null)
    setSaved(false)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Alert global */}
      {alert && (
        <Alert
          variant={alert.type === "error" ? "destructive" : "default"}
          className={
            alert.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : ""
          }
        >
          <AlertTitle>{alert.type === "error" ? "Error" : "Éxito"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Sección: General ─────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="h-5 w-5 text-primary">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <CardTitle>General</CardTitle>
                <CardDescription>Información básica de tu organización</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">
                  Nombre de la empresa <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Mi Empresa S.A."
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Idioma <span className="text-destructive">*</span></Label>
                <Select
                  value={form.language}
                  onValueChange={(v) => setForm({ ...form, language: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Zona horaria <span className="text-destructive">*</span></Label>
              <Select
                value={form.timezone}
                onValueChange={(v) => setForm({ ...form, timezone: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Lima">América/Lima (UTC-5)</SelectItem>
                  <SelectItem value="America/Bogota">América/Bogotá (UTC-5)</SelectItem>
                  <SelectItem value="America/Santiago">América/Santiago (UTC-4)</SelectItem>
                  <SelectItem value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</SelectItem>
                  <SelectItem value="America/Mexico_City">América/Ciudad de México (UTC-6)</SelectItem>
                  <SelectItem value="Europe/Madrid">Europa/Madrid (UTC+1)</SelectItem>
                  <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ── Sección: Notificaciones ───────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="h-5 w-5 text-primary">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Controla cómo y cuándo recibes notificaciones</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "emailNotifications" as const,
                label: "Notificaciones por email",
                description: "Recibe actualizaciones importantes por correo electrónico",
              },
              {
                key: "pushNotifications" as const,
                label: "Notificaciones push",
                description: "Notificaciones en tiempo real en el navegador",
              },
              {
                key: "weeklyReport" as const,
                label: "Reporte semanal",
                description: "Recibe un resumen de actividad cada lunes",
              },
            ].map(({ key, label, description }) => (
              <div key={key}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={form[key] ? "default" : "secondary"}>
                    {form[key] ? "Activado" : "Desactivado"}
                  </Badge>
                  <Switch
                    checked={form[key]}
                    onCheckedChange={(checked) => setForm({ ...form, [key]: checked })}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Sección: Seguridad ────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="h-5 w-5 text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <CardTitle>Seguridad y Privacidad</CardTitle>
                <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "twoFactor" as const,
                label: "Autenticación de dos factores",
                description: "Añade una capa extra de seguridad al iniciar sesión",
              },
              {
                key: "publicProfile" as const,
                label: "Perfil público",
                description: "Permite que otros usuarios vean tu perfil",
              },
            ].map(({ key, label, description }) => (
              <div key={key}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={form[key] ? "default" : "secondary"}>
                    {form[key] ? "Activado" : "Desactivado"}
                  </Badge>
                  <Switch
                    checked={form[key]}
                    onCheckedChange={(checked) => setForm({ ...form, [key]: checked })}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Sección: Zona de peligro ──────────────────────────────────────── */}
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="h-5 w-5 text-destructive">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-destructive">Zona de peligro</CardTitle>
                <CardDescription>Acciones irreversibles sobre tu cuenta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div>
                <p className="text-sm font-medium">Restablecer configuración</p>
                <p className="text-xs text-muted-foreground">
                  Vuelve los campos al último estado guardado
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={handleReset}
              >
                Restablecer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Botones de acción ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {saved
              ? "✓ Todos los cambios han sido guardados"
              : "Los cambios no guardados se perderán al salir"}
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleReset}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              {loading ? "Guardando..." : "Guardar configuración"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}