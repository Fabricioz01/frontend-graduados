# 📋 Checklist de Migración de Módulos

## Cómo Migrar un Módulo de `views/` a `features/`

### Paso 1: Identificar el Módulo

- [ ] Identifica el módulo en `src/app/views/`
- [ ] Anota todas sus dependencias (componentes, servicios, modelos)

### Paso 2: Crear Estructura en Features

```bash
# Ejemplo: migrar views/forms a features/forms
mkdir -p src/app/features/forms/components
```

### Paso 3: Copiar Componentes

```bash
# Copiar componentes
cp -r src/app/views/forms/* src/app/features/forms/components/
```

### Paso 4: Crear Archivo de Rutas

```typescript
// src/app/features/forms/forms.routes.ts
import { Routes } from "@angular/router";

export const FORMS_ROUTES: Routes = [
  {
    path: "elements",
    loadComponent: () => import("./components/elements/elements.component").then((m) => m.ElementsComponent),
    data: { title: "Form Elements" },
  },
  // ... más rutas
];
```

### Paso 5: Actualizar Importaciones

Buscar y reemplazar en todos los archivos del módulo:

#### Servicios:

```typescript
// ❌ Antes
import { MyService } from "../../services/my.service";

// ✅ Después
import { MyService } from "@core/services/api/my.service";
// o
import { MyService } from "@core/services/ui/my.service";
```

#### Interfaces/Modelos:

```typescript
// ❌ Antes
import { MyModel } from "../../common/my.model";

// ✅ Después
import { MyModel } from "@core/interfaces/api/my.model";
// o
import { MyModel } from "@core/interfaces/ui/my.model";
```

#### Componentes Compartidos:

```typescript
// ❌ Antes
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";

// ✅ Después
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
```

#### Directivas:

```typescript
// ❌ Antes
import { SortableDirective } from "../../common/sortable.directive";

// ✅ Después
import { SortableDirective } from "@shared/directives/sortable.directive";
```

#### Constantes:

```typescript
// ❌ Antes
import { currency } from "@common/constants";

// ✅ Después
import { currency } from "@shared/constants/app.constants";
```

#### Store:

```typescript
// ❌ Antes
import { selectUser } from "@store/authentication/authentication.selector";

// ✅ Después
import { selectUser } from "@core/store/authentication/authentication.selector";
```

### Paso 6: Agregar Rutas al Módulo Principal

```typescript
// En app.routes.ts
{
  path: '',
  component: LayoutComponent,
  children: [
    // ... otras rutas
    {
      path: 'forms',
      loadChildren: () =>
        import('@features/forms/forms.routes').then((m) => m.FORMS_ROUTES),
    },
  ],
}
```

### Paso 7: Verificar Compilación

```bash
ng build --configuration development
```

### Paso 8: Probar en Navegador

```bash
npm start
```

- [ ] Navegar al módulo
- [ ] Probar todas las funcionalidades
- [ ] Verificar que no hay errores en consola

---

## 📝 Lista de Módulos Pendientes de Migrar

### De Alta Prioridad

- [ ] **apex-charts** (`views/apex-charts/` → `features/charts/`)
- [ ] **apps** (`views/apps/` → `features/apps/`)
  - [ ] todolist
  - [ ] contacts
  - [ ] calendar
- [ ] **forms** (`views/forms/` → `features/forms/`)
- [ ] **tables** (`views/tables/` → `features/tables/`)
- [ ] **maps** (`views/maps/` → `features/maps/`)

### De Media Prioridad

- [ ] **extended-ui** (`views/extended-ui/` → `features/extended-ui/`)
- [ ] **icons** (`views/icons/` → `features/icons/`)
- [ ] **ui** (`views/ui/` → `features/ui/`)
- [ ] **widget** (`views/widget/` → `features/widgets/`)

### De Baja Prioridad

- [ ] **other-pages** (`views/other-pages/` → `features/pages/`)
- [ ] **utility** (`views/utility/` → `features/utility/`)

---

## 🔍 Patrones Comunes de Migración

### Patrón 1: Componente Simple

```typescript
// views/mi-modulo/mi-componente/mi-componente.component.ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-mi-componente",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./mi-componente.component.html",
})
export class MiComponenteComponent {}
```

**Migrar a**: `features/mi-modulo/components/mi-componente/`

### Patrón 2: Componente con Servicio

```typescript
// ❌ Antes
import { MyService } from "../../../services/my.service";

// ✅ Después
import { MyService } from "@core/services/api/my.service";
```

### Patrón 3: Componente con Store

```typescript
// ❌ Antes
import { Store } from "@ngrx/store";
import { selectData } from "@store/my-store/my.selector";

// ✅ Después
import { Store } from "@ngrx/store";
import { selectData } from "@core/store/my-store/my.selector";
```

### Patrón 4: Componente con Shared Components

```typescript
// ❌ Antes
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";

// ✅ Después
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
```

---

## ⚠️ Errores Comunes y Soluciones

### Error: Module not found

**Problema**: `Cannot find module '@views/...'`

**Solución**: Actualizar path alias en importación

```typescript
// ❌
import { X } from "@views/...";

// ✅
import { X } from "@features/...";
// o
import { X } from "@core/...";
// o
import { X } from "@shared/...";
```

### Error: Circular dependency

**Problema**: Features importando de otras features

**Solución**:

1. Mover lógica compartida a `@core` o `@shared`
2. Usar lazy loading para evitar dependencias circulares

### Error: Service not found

**Problema**: Servicio no encontrado después de migración

**Solución**:

1. Verificar que el servicio esté en `@core/services/`
2. Verificar que tenga `providedIn: 'root'`
3. Actualizar import en el componente

---

## 🎯 Criterios de Éxito

Un módulo está **completamente migrado** cuando:

- ✅ Todos los componentes están en `features/[modulo]/components/`
- ✅ Archivo de rutas creado: `[modulo].routes.ts`
- ✅ Todas las importaciones usan path aliases (`@core`, `@shared`)
- ✅ No hay imports relativos (`../../../`)
- ✅ Compila sin errores: `ng build`
- ✅ Funciona en navegador: `npm start`
- ✅ No hay errores en consola del navegador
- ✅ Todas las funcionalidades del módulo funcionan correctamente

---

## 📊 Progreso de Migración

```
Total de módulos: 14
Migrados: 3 (dashboard, auth, errors)
Pendientes: 11
Progreso: 21% ░░░░░░░░░░░░░░░░░░░░░
```

---

**Última actualización**: 25 de octubre de 2025
