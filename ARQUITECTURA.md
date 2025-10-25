# Refactorización Arquitectónica - Seguimiento a Graduados

## Estructura Nueva

El proyecto ha sido completamente refactorizado siguiendo una arquitectura modular basada en tres pilares principales:

### 📁 src/app/core/

**Propósito**: Lógica singleton y servicios centrales de la aplicación

#### Estructura:

```
core/
├── guards/               # Guards de autenticación y autorización
├── interceptors/         # Interceptores HTTP (JWT, Error)
├── utils/               # Utilidades y helpers
├── services/
│   ├── api/            # Servicios que interactúan con el backend
│   │   ├── auth.service.ts
│   │   └── crud.service.ts
│   └── ui/             # Servicios de lógica de UI
│       ├── theme.service.ts
│       ├── title.service.ts
│       └── table.service.ts
├── interfaces/
│   ├── api/            # Interfaces de DTOs del backend
│   └── ui/             # Interfaces para modelos de vista
│       └── apexchart.model.ts
├── store/              # Estado global (NgRx)
│   ├── authentication/
│   └── calendar/
├── layout/             # Layout principal de la aplicación
├── auth-layout/        # Layout para páginas de autenticación
├── error-layout/       # Layout para páginas de error
├── menu.meta.ts        # Configuración del menú de navegación
└── index.ts            # Barrel export
```

**Reglas**:

- ✅ Todos los servicios e interfaces deben estar aquí
- ✅ Es la única fuente de verdad para datos y lógica de negocio
- ❌ No debe contener componentes de vista (excepto layouts)

---

### 📁 src/app/features/

**Propósito**: Módulos de negocio organizados por funcionalidad

#### Estructura:

```
features/
├── dashboard/
│   ├── components/          # Componentes de dashboard (CRM, Analytics, etc.)
│   └── dashboard.routes.ts  # Rutas del dashboard
├── auth/
│   ├── components/          # Login, Register, Recover, etc.
│   └── auth.routes.ts       # Rutas de autenticación
├── errors/
│   ├── components/          # Error 404, 500, etc.
│   └── errors.routes.ts     # Rutas de errores
└── gestion-usuarios/
    ├── usuarios/
    │   ├── components/      # Componentes de usuarios
    │   └── usuarios.routes.ts
    ├── roles/
    │   ├── components/      # Componentes de roles
    │   └── roles.routes.ts
    └── gestion-usuarios.routes.ts  # Rutas padre
```

**Reglas**:

- ✅ Solo componentes y archivos de rutas
- ✅ Importan servicios e interfaces desde `@core`
- ❌ No deben tener carpetas propias de `services` o `interfaces`
- ✅ Soporta anidación de sub-módulos (ej: gestion-usuarios)

---

### 📁 src/app/shared/

**Propósito**: Componentes, directivas y pipes reutilizables

#### Estructura:

```
shared/
├── components/          # Componentes presentacionales
│   ├── breadcrumb/
│   └── vector-maps/
├── directives/         # Directivas reutilizables
│   ├── sortable.directive.ts
│   └── flatpickr.directive.ts
├── pipes/              # Pipes personalizados
├── constants/          # Constantes globales
│   └── app.constants.ts
└── index.ts            # Barrel export
```

**Reglas**:

- ✅ Solo componentes "tontos" (presentacionales)
- ✅ Directivas y pipes reutilizables
- ❌ No debe contener servicios
- ✅ Los componentes reciben datos via `@Input` y emiten eventos via `@Output`

---

## Configuración del Proyecto

### tsconfig.json - Path Aliases

```json
{
  "paths": {
    "@core/*": ["./src/app/core/*"],
    "@features/*": ["./src/app/features/*"],
    "@shared/*": ["./src/app/shared/*"]
  }
}
```

### angular.json - Schematics

```json
{
  "schematics": {
    "@schematics/angular:component": {
      "skipTests": true,
      "style": "scss",
      "standalone": true
    },
    "@schematics/angular:directive": {
      "skipTests": true,
      "standalone": true
    },
    "@schematics/angular:pipe": {
      "skipTests": true,
      "standalone": true
    },
    "@schematics/angular:service": {
      "skipTests": true
    }
  }
}
```

---

## Rutas Principales (app.routes.ts)

```typescript
export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent, // Desde @core
    canActivate: [authGuard],
    children: [
      {
        path: "",
        loadChildren: () => import("@features/dashboard/dashboard.routes"),
      },
      {
        path: "gestion-usuarios",
        loadChildren: () => import("@features/gestion-usuarios/gestion-usuarios.routes"),
      },
    ],
  },
  {
    path: "auth",
    component: AuthLayoutComponent, // Desde @core
    loadChildren: () => import("@features/auth/auth.routes"),
  },
  {
    path: "",
    component: ErrorLayoutComponent, // Desde @core
    loadChildren: () => import("@features/errors/errors.routes"),
  },
];
```

---

## Ejemplo de Importaciones

### En un componente de feature:

```typescript
// ✅ Correcto - Importar desde core
import { AuthenticationService } from "@core/services/api/auth.service";
import { User } from "@core/interfaces/api/user.model";
import { ThemeService } from "@core/services/ui/theme.service";

// ✅ Correcto - Importar desde shared
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { NgbdSortableHeader } from "@shared/directives/sortable.directive";

// ❌ Incorrecto - No importar de otras features
import { SomeComponent } from "@features/other-feature/components/some.component";
```

### En core:

```typescript
// ✅ Correcto - Core puede importar de shared
import { SortDirection } from "@shared/directives/sortable.directive";

// ❌ Incorrecto - Core no debe importar de features
import { DashboardComponent } from "@features/dashboard/components/crm.component";
```

---

## Comandos para Generar Nuevos Elementos

### Nuevo servicio (siempre en core):

```bash
ng g service core/services/api/mi-servicio
ng g service core/services/ui/mi-servicio-ui
```

### Nuevo componente en feature:

```bash
ng g component features/mi-feature/components/mi-componente
```

### Nuevo componente shared:

```bash
ng g component shared/components/mi-componente-compartido
```

### Nueva directiva:

```bash
ng g directive shared/directives/mi-directiva
```

### Nuevo pipe:

```bash
ng g pipe shared/pipes/mi-pipe
```

---

## Ventajas de esta Arquitectura

1. **Separación Clara de Responsabilidades**: Cada módulo tiene un propósito específico
2. **Escalabilidad**: Fácil agregar nuevos features sin afectar otros
3. **Mantenibilidad**: Código organizado y fácil de encontrar
4. **Reutilización**: Componentes y lógica compartida centralizada
5. **Testing**: Más fácil crear tests unitarios
6. **Lazy Loading**: Carga bajo demanda de módulos
7. **Tree Shaking**: Mejor optimización del bundle final

---

## Próximos Pasos

1. ✅ Estructura base creada
2. ✅ Servicios movidos a core
3. ✅ Componentes reutilizables en shared
4. ✅ Features con ejemplos creados
5. ⏳ Migrar componentes restantes de views a features
6. ⏳ Actualizar todas las importaciones
7. ⏳ Eliminar carpetas antiguas (views, common, helper, services)
8. ⏳ Probar compilación
9. ⏳ Ejecutar aplicación

---

## Notas Importantes

- **Sin fake-backend**: Se eliminó completamente el fake-backend
- **Sin archivos .spec.ts**: Configurado para no generar archivos de prueba
- **Standalone Components**: Todos los componentes nuevos son standalone
- **Lazy Loading**: Todos los módulos se cargan de forma perezosa
- **Path Aliases**: Usar `@core`, `@features`, `@shared` en importaciones
