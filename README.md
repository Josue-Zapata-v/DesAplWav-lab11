# 🚀 Dashboard de Proyectos — Next.js + shadcn/ui

Sistema de gestión de proyectos, tareas y equipos construido con **Next.js 16**, **shadcn/ui**, **Tailwind CSS v4** y **React Context** para estado global en memoria.

🌐 **Demo en producción:** [https://des-apl-wav-lab11-jeo7.vercel.app/dashboard](https://des-apl-wav-lab11-jeo7.vercel.app/dashboard)

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Requisitos previos](#-requisitos-previos)
- [Instalación desde cero](#-instalación-desde-cero)
- [Clonar repositorio existente](#-clonar-repositorio-existente)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Componentes shadcn/ui utilizados](#-componentes-shadcnui-utilizados)
- [Funcionalidades implementadas](#-funcionalidades-implementadas)
- [Guía de pruebas](#-guía-de-pruebas)
- [Scripts disponibles](#-scripts-disponibles)

---

## 🛠 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.2.6 | Framework principal (App Router) |
| React | 19.2.4 | UI Library |
| TypeScript | ^5 | Tipado estático |
| Tailwind CSS | ^4 | Estilos utilitarios |
| shadcn/ui | ^4.8.0 | Sistema de componentes |
| Radix UI | ^1.4.3 | Accesibilidad de componentes |
| react-day-picker | ^10.0.1 | Componente Calendar |
| date-fns | ^4.3.0 | Utilidades de fechas |
| class-variance-authority | ^0.7.1 | Gestión de variantes CSS |
| lucide-react | ^1.16.0 | Iconografía |
| tw-animate-css | ^1.4.0 | Animaciones Tailwind |

---

## ✅ Requisitos previos

Asegúrate de tener instalado en tu sistema:

- **Node.js** v18.17 o superior → [nodejs.org](https://nodejs.org)
- **npm** v9 o superior (incluido con Node.js)
- **Git** → [git-scm.com](https://git-scm.com)

Verifica las versiones:

```bash
node --version
npm --version
git --version
```

---

## 📦 Instalación desde cero

Si deseas crear el proyecto desde cero, sigue estos pasos:

### 1. Crear proyecto Next.js

```bash
npx create-next-app@latest next-shadcn-ui
cd next-shadcn-ui
```

Configuración recomendada al crear el proyecto:

```
✔ Would you like to use TypeScript?                  → Yes
✔ Would you like to use ESLint?                      → Yes
✔ Would you like to use Tailwind CSS?                → Yes
✔ Would you like your code inside a src/ directory?  → No
✔ Would you like to use App Router?                  → Yes
✔ Would you like to use Turbopack?                   → Yes
✔ Would you like to customize the import alias?      → No
```

### 2. Inicializar shadcn/ui

```bash
npx shadcn@latest init
```

Configuración recomendada:

```
✔ Which style would you like to use?    → New York
✔ Which color would you like to use?    → Neutral
✔ Would you like to use CSS variables?  → Yes
```

### 3. Instalar componentes shadcn/ui

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add table
npx shadcn@latest add checkbox
npx shadcn@latest add form
npx shadcn@latest add switch
npx shadcn@latest add spinner
npx shadcn@latest add alert
npx shadcn@latest add calendar
npx shadcn@latest add pagination
npx shadcn@latest add textarea
npx shadcn@latest add popover
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000/dashboard](http://localhost:3000/dashboard) en tu navegador.

---

## 🔗 Clonar repositorio existente

### 1. Clonar el repositorio

```bash
git clone https://github.com/Josue-Zapata-v/DesAplWav-lab11.git
cd DesAplWav-lab11
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000/dashboard](http://localhost:3000/dashboard) en tu navegador.

> **Nota:** No se requiere archivo `.env`. El proyecto usa estado en memoria (React Context), sin base de datos ni variables de entorno.

---

## 📁 Estructura del proyecto

```
next-shadcn-ui/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Página principal del dashboard
│   ├── globals.css           # Tema global (violeta/índigo)
│   └── layout.tsx            # Layout raíz
├── components/
│   ├── ui/                   # Componentes generados por shadcn/ui
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── spinner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   └── tabs.tsx
│   ├── OverviewTab.tsx       # Tab Resumen con métricas en tiempo real
│   ├── ProjectsTab.tsx       # Tab Proyectos con CRUD completo
│   ├── TeamTab.tsx           # Tab Equipo con CRUD completo
│   ├── TasksTab.tsx          # Tab Tareas con CRUD + paginación
│   └── SettingsTab.tsx       # Tab Configuración con formulario
├── context/
│   └── DashboardContext.tsx  # Estado global compartido (React Context)
├── lib/
│   └── utils.ts              # Utilidades (cn)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 Componentes shadcn/ui utilizados

| Componente | Ubicación | Propósito |
|---|---|---|
| **Spinner** | Todos los formularios | Simula peticiones al backend (1.2s delay) |
| **Alert** | Todos los formularios | Validación de campos y confirmación de éxito |
| **Calendar** | TeamTab, TasksTab | Selector de fecha de nacimiento y fecha límite |
| **Pagination** | TasksTab | Navegación entre páginas de tareas (5 por página) |
| **Dialog** | ProjectsTab, TeamTab, TasksTab | Modales de crear, editar, ver detalle y confirmar eliminación |
| **Select** | Todos los formularios | Dropdowns de categoría, prioridad, estado, rol, etc. |
| **Switch** | TeamTab, SettingsTab | Toggle de estado activo/inactivo y configuraciones |
| **Badge** | Todos los tabs | Indicadores visuales de estado y prioridad |
| **Avatar** | OverviewTab, TeamTab | Representación visual de miembros |
| **Card** | Todos los tabs | Contenedores de secciones |
| **Tabs** | dashboard/page.tsx | Navegación principal del dashboard |
| **Table** | TasksTab | Listado tabular de tareas |
| **Checkbox** | TasksTab | Selección de filas en tabla |
| **Popover** | TeamTab, TasksTab | Contenedor del Calendar en formularios |

---

## ✨ Funcionalidades implementadas

### 🎨 Tema personalizado
- Color primario cambiado de negro a **violeta/índigo** (`oklch(0.5 0.24 270)`)
- Variables CSS definidas en `app/globals.css` para modo claro y oscuro

### 📊 Tab: Resumen
- Métricas en tiempo real desde React Context:
  - Total de proyectos y cuántos están completados
  - Tareas completadas y en progreso
  - Total de tareas y pendientes
  - Miembros activos e inactivos
- Barras de progreso por estado de proyectos
- Distribución de tareas por prioridad
- Actividad reciente generada desde datos reales

### 📁 Tab: Proyectos
- **Crear** proyecto con campos: nombre, descripción, categoría, prioridad y miembros del equipo (selección por chips interactivos)
- **Ver detalles** en modal: muestra toda la información incluyendo miembros asignados con sus nombres
- **Editar** proyecto: modifica todos los campos incluyendo estado y porcentaje de progreso
- **Eliminar** con diálogo de confirmación
- Spinner en todas las operaciones simulando llamada al backend

### 👥 Tab: Equipo
- CRUD completo de miembros con todos los campos requeridos:
  - `userId` (generado automáticamente)
  - `name`, `email`, `role`, `position`
  - `birthdate` (selector Calendar)
  - `phone`, `projectId`, `isActive` (Switch)
- Validación de campos obligatorios con Alert
- Badge de estado Activo/Inactivo en cada fila
- Muestra proyecto asignado y fecha de nacimiento

### ✅ Tab: Tareas
- CRUD completo con campos: `description`, `projectId`, `status`, `priority`, `userId`, `deadline`
- Selector de fecha límite con componente Calendar
- **Filtros** por estado y prioridad (combinables)
- **Paginación** de 5 tareas por página con navegación completa
- Contador de resultados filtrados
- Resuelve nombres de proyecto y responsable desde el Context

### ⚙️ Tab: Configuración
- Sección **General**: nombre de empresa, idioma, zona horaria
- Sección **Notificaciones**: email, push, reporte semanal (Switch + Badge)
- Sección **Seguridad**: autenticación de dos factores, perfil público
- Sección **Zona de peligro**: restablecer al último estado guardado
- Spinner al guardar, Alert de éxito/error

---

## 🧪 Guía de pruebas

Navega a [http://localhost:3000/dashboard](http://localhost:3000/dashboard) y sigue estos pasos:

### ✳️ Verificar Spinner
1. Ir a cualquier tab (Proyectos, Equipo o Tareas)
2. Abrir un formulario y completar los campos requeridos
3. Hacer clic en guardar → el botón mostrará el **Spinner** durante ~1.2 segundos

### ✳️ Verificar Alert
1. Abrir cualquier modal de creación
2. Hacer clic en guardar **sin completar** los campos requeridos
3. Aparecerá un **Alert destructivo** rojo con el mensaje de error
4. Al guardar correctamente aparece un **Alert verde** de éxito

### ✳️ Verificar Calendar
1. **Equipo** → "Nuevo Miembro" → campo "Fecha de nacimiento" → clic en el botón de fecha → se abre el **Calendar**
2. **Tareas** → "Nueva Tarea" → campo "Fecha límite" → mismo comportamiento

### ✳️ Verificar Pagination
1. Ir al tab **Tareas**
2. Crear más de 5 tareas usando el botón "Nueva Tarea"
3. La **Pagination** se activa mostrando páginas numeradas
4. Usar filtros de estado/prioridad y observar cómo la paginación se resetea a la página 1

### ✳️ Verificar CRUD Proyectos
1. **Crear**: "Nuevo Proyecto" → completar formulario → seleccionar miembros (chips) → "Crear Proyecto"
2. **Ver detalles**: clic en "Ver detalles" de cualquier card → modal con info completa
3. **Editar**: clic en "Editar" → modificar progreso a 100% y estado a "Completado" → guardar
4. **Eliminar**: clic en ícono rojo → confirmar → el proyecto desaparece del grid

### ✳️ Verificar CRUD Equipo
1. **Crear**: "Nuevo Miembro" → completar todos los campos → seleccionar fecha de nacimiento → guardar
2. **Editar**: "Editar" en cualquier fila → modificar rol o estado isActive → guardar
3. **Eliminar**: ícono rojo → confirmar eliminación

### ✳️ Verificar CRUD Tareas
1. **Crear**: "Nueva Tarea" → completar campos → seleccionar fecha límite → guardar
2. **Filtrar**: usar los selectores de estado y prioridad para filtrar resultados
3. **Editar**: "Editar" en cualquier fila de la tabla
4. **Eliminar**: ícono rojo → confirmar

### ✳️ Verificar métricas en Resumen
1. Ir al tab **Resumen** y anotar los números actuales
2. Ir a **Tareas** → crear una nueva tarea con estado "Completado"
3. Volver a **Resumen** → el contador de "Tareas Completadas" habrá aumentado
4. Ir a **Equipo** → agregar un nuevo miembro activo
5. Volver a **Resumen** → "Miembros Activos" habrá aumentado

### ✳️ Verificar Configuración
1. Ir al tab **Configuración**
2. Cambiar el nombre de empresa y togglear los switches
3. Los badges cambian entre "Activado" / "Desactivado" en tiempo real
4. Guardar → Spinner → Alert verde de confirmación
5. Clic en "Restablecer" → los campos vuelven al último estado guardado

---

## 📜 Scripts disponibles

```bash
# Iniciar servidor de desarrollo con Turbopack
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción (requiere build previo)
npm start

# Analizar código con ESLint
npm run lint
```

---

## 👨‍💻 Autor

**Josue Zapata Villegas**  
Estudiante de Diseño y Desarrollo de Software — Instituto Tecsup  
[github.com/Josue-Zapata-v](https://github.com/Josue-Zapata-v)

---

*Laboratorio 11 — Desarrollo de Aplicaciones Web Avanzado*
