# Guía de Desarrollo - Login y Backend

## 📋 Estado Actual

La aplicación está configurada para funcionar con un **backend real** en `/api/login`. Sin embargo, puedes desarrollar sin backend usando el **Mock Backend Interceptor**.

---

## 🔐 Credenciales de Prueba

### Con Mock Backend (desarrollo sin backend)
```
Email: user@demo.com
Password: 123456

Email: admin@demo.com  
Password: admin123
```

### Con Backend Real
Usa las credenciales que proporcione tu backend.

---

## 🚀 Modo 1: Desarrollo CON Backend Real

### Configuración
1. **Descomenta** las líneas del Mock Backend en `app.config.ts`
2. Asegúrate de que tu backend esté corriendo
3. El backend debe responder en `/api/login` con esta estructura:

```typescript
// Request
POST /api/login
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}

// Response exitosa (200)
{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "token": "jwt-token-here",
  "role": "admin"
}

// Response error (401)
{
  "error": {
    "message": "Credenciales inválidas"
  }
}
```

### Flujo de Autenticación
1. Usuario ingresa credenciales en `/auth/sign-in`
2. Se dispara acción NgRx `login`
3. `AuthenticationService` hace POST a `/api/login`
4. Si exitoso: guarda token en cookie y redirige a dashboard
5. Si error: muestra mensaje de error
6. `authGuard` verifica cookie en cada ruta protegida

---

## 🧪 Modo 2: Desarrollo SIN Backend (Mock)

### Activar Mock Backend

**1. Abrir `src/app/app.config.ts`**

**2. Descomentar estas líneas:**

```typescript
// ANTES (comentado)
// import { MockBackendInterceptor } from './core/interceptors/mock-backend.interceptor';

// DESPUÉS (descomentado)
import { MockBackendInterceptor } from './core/interceptors/mock-backend.interceptor';
```

```typescript
// ANTES (comentado)
// { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true },

// DESPUÉS (descomentado)
{ provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true },
```

**3. Reiniciar el servidor de desarrollo:**
```bash
# Detener el servidor (Ctrl+C)
npm run start
```

### ¿Cómo Funciona el Mock?

El `MockBackendInterceptor` intercepta todas las llamadas a `/api/*` y:

1. **Login (`/api/login`)**:
   - Valida credenciales contra lista hardcoded
   - Retorna usuario mock con token fake
   - Simula 500ms de latencia de red

2. **Otras llamadas API**:
   - Retorna respuesta genérica exitosa
   - Simula 300ms de latencia

3. **Llamadas fuera de `/api/`**:
   - Las deja pasar sin interceptar

### Credenciales Mock
```typescript
// Válidas
user@demo.com / 123456
admin@demo.com / admin123

// Inválidas (retorna error 401)
Cualquier otra combinación
```

---

## 🛡️ Guard de Autenticación

### ¿Cómo Funciona?

El `authGuard` en `src/app/core/guards/auth.guard.ts`:

```typescript
export const authGuard = (url: any) => {
  const authService = inject(AuthenticationService);
  
  // Verifica si existe cookie de sesión
  if (!authService.session) {
    // No hay sesión → Redirige a login
    return router.createUrlTree(['/auth/login']);
  }
  
  // Hay sesión → Permite acceso
  return true;
};
```

### Rutas Protegidas

Todas las rutas bajo `/dashboard` están protegidas:

```typescript
// app.routes.ts
{
  path: '',
  component: LayoutComponent,
  canActivate: [authGuard], // ← Guard aplicado aquí
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./features/dashboard/dashboard.routes')
    }
  ]
}
```

### Flujo de Protección

1. Usuario intenta acceder a `/dashboard/index`
2. Guard verifica cookie `_HANDO_AUTH_SESSION_KEY_`
3. **Si existe cookie**: Acceso permitido ✅
4. **Si NO existe cookie**: Redirige a `/auth/sign-in?returnUrl=/dashboard/index` ❌

---

## 🔧 Solución de Problemas

### Error: "Cannot read properties of undefined (reading 'message')"

**✅ SOLUCIONADO**: Se corrigió el manejo de errores en:
- `sign-in.component.ts` (línea 56)
- `error.interceptor.ts` (línea 15)

Ahora usa **optional chaining** (`?.`) para evitar estos errores:
```typescript
// Antes
this.errorMessage = data.error.message;

// Después
this.errorMessage = data?.error?.message || 'Error de conexión';
```

### Error 404: POST http://localhost:4200/api/login

**Causa**: No hay backend disponible.

**Soluciones**:
1. **Activar Mock Backend** (ver sección "Modo 2")
2. **Configurar proxy** a backend real (ver sección siguiente)
3. **Levantar backend** en el puerto esperado

### No puedo hacer login

**Verifica**:
1. ¿Está el Mock Backend activado en `app.config.ts`?
2. ¿Estás usando credenciales válidas?
3. ¿Hay errores en la consola del navegador?
4. ¿Reiniciaste el servidor después de cambiar config?

---

## 🔌 Configurar Proxy a Backend Real

Si tu backend está en otro puerto (ej: `http://localhost:3000`):

**1. Crear `proxy.conf.json`:**
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

**2. Actualizar `package.json`:**
```json
{
  "scripts": {
    "start": "ng serve --proxy-config proxy.conf.json"
  }
}
```

**3. Reiniciar servidor:**
```bash
npm run start
```

Ahora todas las llamadas a `/api/*` se redirigirán a `http://localhost:3000/api/*`.

---

## 📊 Flujo Completo de Login

```
┌─────────────────┐
│  Usuario ingresa│
│  credenciales   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SignInComponent │
│  dispatch(login)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Authentication   │
│    Effects      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Authentication   │
│    Service      │
│ POST /api/login │
└────────┬────────┘
         │
         ├─────────┐
         │         │
         ▼         ▼
    ┌────────┐ ┌──────────┐
    │ Mock   │ │ Backend  │
    │Backend │ │  Real    │
    └───┬────┘ └────┬─────┘
        │           │
        └─────┬─────┘
              │
              ▼
        ┌──────────┐
        │ Respuesta│
        └────┬─────┘
             │
        ┌────┴─────┐
        │          │
        ▼          ▼
    ┌────────┐ ┌────────┐
    │Success │ │ Error  │
    └───┬────┘ └───┬────┘
        │          │
        ▼          ▼
┌──────────────┐ ┌──────────────┐
│Guarda token  │ │Muestra error │
│en cookie     │ │al usuario    │
│Redirige a /  │ │              │
└──────────────┘ └──────────────┘
```

---

## ✅ Checklist de Desarrollo

### Sin Backend (Mock)
- [x] Corregir manejo de errores
- [x] Crear MockBackendInterceptor
- [x] Documentar credenciales mock
- [ ] Descomentar interceptor en app.config.ts
- [ ] Reiniciar servidor
- [ ] Probar login con credenciales mock
- [ ] Verificar redirección a dashboard
- [ ] Verificar guard en rutas protegidas

### Con Backend
- [x] Corregir manejo de errores
- [ ] Levantar backend
- [ ] Configurar proxy (si es necesario)
- [ ] Verificar endpoint /api/login
- [ ] Verificar estructura de respuesta
- [ ] Probar login con credenciales reales
- [ ] Verificar token JWT
- [ ] Probar refresh de página (persistencia)

---

## 🎯 Resumen

| Aspecto | Sin Backend (Mock) | Con Backend Real |
|---------|-------------------|------------------|
| **Interceptor** | `MockBackendInterceptor` activado | `MockBackendInterceptor` desactivado |
| **Credenciales** | user@demo.com / 123456 | Las de tu backend |
| **Token** | Fake (mock-jwt-token-xxx) | JWT real del backend |
| **Validación** | Hardcoded en interceptor | Validación real en DB |
| **Latencia** | Simulada (500ms) | Real |
| **Desarrollo** | ✅ Ideal sin backend | ✅ Para producción |

---

## 📚 Archivos Relacionados

```
src/app/
├── app.config.ts                                  # Configuración de interceptors
├── core/
│   ├── guards/
│   │   └── auth.guard.ts                         # Guard de autenticación
│   ├── interceptors/
│   │   ├── jwt.interceptor.ts                    # Agrega token a requests
│   │   ├── error.interceptor.ts                  # Manejo global de errores
│   │   └── mock-backend.interceptor.ts           # Mock para desarrollo
│   ├── services/api/
│   │   └── auth.service.ts                       # Servicio de autenticación
│   └── store/authentication/
│       ├── authentication.actions.ts              # Acciones NgRx
│       ├── authentication.effects.ts              # Effects NgRx
│       ├── authentication.reducer.ts              # Reducer NgRx
│       └── authentication.selector.ts             # Selectors NgRx
└── features/auth/components/sign-in/
    └── sign-in.component.ts                       # Componente de login
```

---

**Última actualización**: ${new Date().toLocaleString('es-ES')}
