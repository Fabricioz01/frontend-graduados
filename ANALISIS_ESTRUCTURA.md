# ANÁLISIS DE ESTRUCTURA - ANGULAR 19

## CONFIGURACIÓN BÁSICA

**Proyecto:** Hando - Plantilla Admin Angular 19
**Gestor de paquetes:** Bun
**Estilo:** SCSS con Bootstrap 5.3.3
**Estado:** NgRx Store con localStorage sync
**Builder:** Angular DevKit Application Builder

## ARQUITECTURA DE CARPETAS

```
src/app/
├── app.config.ts          -> Configuración raíz (providers, interceptors, NgRx)
├── app.routes.ts          -> Rutas principales con guards
├── layout/                -> Layout principal con sidebar y topbar
├── auth-layout/           -> Layout para páginas de autenticación
├── error-layout/          -> Layout para páginas de error
├── common/                -> Constantes, directivas, modelos compartidos
├── components/            -> Componentes reutilizables (breadcrumb, maps)
├── helper/                -> Interceptors (JWT, Error), fake-backend, utils
├── services/              -> Servicios globales (auth, crud, theme, table)
├── store/                 -> NgRx (authentication, calendar con effects)
└── views/                 -> Páginas de la aplicación (lazy load)
```

## ROUTING Y NAVEGACIÓN

**app.routes.ts:**
- Ruta raíz redirige a '/index'
- 3 layouts principales: LayoutComponent, AuthLayoutComponent, ErrorLayoutComponent
- Guard de autenticación en LayoutComponent verifica `authService.session`
- Lazy loading para todas las vistas mediante loadChildren

**views/views.route.ts:**
- Todas las rutas de la aplicación autenticada
- Módulos lazy: ui, extended, icons, charts, forms, tables, maps, apps
- Dashboards: index, analytics, ecommerce, projects, hrm, jobs
- Widget como ruta standalone

## SIDEBAR - ARCHIVO CRÍTICO

**common/menu.meta.ts** -> ESTE ES EL ARCHIVO DEL SIDEBAR
- Exporta `MENU_ITEMS: MenuItemType[]`
- Estructura: isTitle (separador), label, icon (feather), url, children, collapsed
- Secciones: MENU, PAGES, APPS, GENERAL
- Iconos: feather-icons (home, users, calendar, package, etc.)

**layout/components/sidebar/sidebar.component.ts:**
- Importa MENU_ITEMS desde menu.meta.ts
- Maneja collapsed state de cada item
- Detecta ruta activa y expande padres automáticamente
- Usa simplebar para scroll
- Renderiza iconos con feather.toSvg()

## ESTADO GLOBAL (NgRx)

**store/index.ts:**
- RootReducerState con authentication y Calendar
- Configurado en app.config.ts con metaReducers
- Store DevTools activado

**store/authentication:**
- Actions, effects, reducer, selector
- Modelo User en auth.model.ts

**store/calendar:**
- Actions, effects, reducer, selectors
- Data mock en data.ts

## SERVICIOS PRINCIPALES

**auth.service.ts:**
- Gestiona login/logout
- Guarda token en cookies (CookieService)
- Key de sesión: '_HANDO_AUTH_SESSION_KEY_'
- Fake backend en helper/fake-backend.ts

**theme.service.ts:**
- Maneja tema light/dark
- Usado en topbar.component.ts

**crud.service.ts:**
- Servicio genérico para operaciones CRUD

**table.service.ts:**
- Utilidades para tablas

## INTERCEPTORS

**helper/jwt.interceptor.ts:**
- Añade token a headers de peticiones HTTP

**helper/error.interceptor.ts:**
- Maneja errores HTTP globalmente

**helper/fake-backend.ts:**
- Simula backend con usuarios mock
- Token JWT hardcoded
- Almacena usuarios en sessionStorage

## LAYOUTS

**LayoutComponent:**
- Topbar + Sidebar + router-outlet
- Usado para páginas autenticadas

**AuthLayoutComponent:**
- Para login, register, recover password, etc.

**ErrorLayoutComponent:**
- Para 404, 500, 503, 429, offline

## TOPBAR

**layout/components/topbar/topbar.component.ts:**
- Toggle sidebar (atributo data-sidebar en body)
- Cambio de tema (light/dark)
- Fullscreen
- Responsive: oculta sidebar < 1040px

## ASSETS Y ESTILOS

**public/assets:**
- fonts/, images/, scss/
- Variables en _variables.scss y _variables-dark.scss
- Custom en scss/custom/

**src/styles.scss:**
- Punto de entrada de estilos

## DEPENDENCIAS CLAVE

- @ng-bootstrap/ng-bootstrap: Componentes Bootstrap
- @ngrx/store + effects: Gestión de estado
- angular-feather: Iconos
- ng-apexcharts: Gráficos
- @fullcalendar: Calendario
- simplebar-angular: Scrollbar personalizado
- ngx-quill: Editor de texto
- jsvectormap: Mapas vectoriales
- flatpickr: Date picker
- lightgallery/glightbox: Galerías de imágenes

## PUNTOS IMPORTANTES PARA REORGANIZACIÓN

1. **Sidebar:** Modificar `common/menu.meta.ts` (MENU_ITEMS array)
2. **Rutas:** Sincronizar urls en menu.meta.ts con views/views.route.ts
3. **Lazy loading:** Todas las vistas usan loadChildren
4. **Guards:** Autenticación verificada en app.routes.ts
5. **Store:** Añadir nuevos reducers en store/index.ts
6. **Servicios:** Centralizados en services/
7. **Helpers:** Interceptors y utilidades en helper/
8. **Layouts:** 3 layouts separados (main, auth, error)
9. **Assets:** Movidos a public/ (Angular 19 nueva estructura)
10. **Componentes compartidos:** components/ para reutilizables

## ESTRUCTURA RECOMENDADA PARA MÓDULOS

```
views/
├── dashboards/       -> Todos los dashboards
├── apps/             -> Aplicaciones (calendar, contacts, todo)
├── auth/             -> Páginas de autenticación
├── errors/           -> Páginas de error
├── ui/               -> Componentes UI
├── extended-ui/      -> UI extendida
├── forms/            -> Formularios
├── tables/           -> Tablas
├── apex-charts/      -> Gráficos
├── icons/            -> Iconos
├── maps/             -> Mapas
├── utility/          -> Páginas utility (profile, pricing, invoice, etc.)
└── widget/           -> Widgets
```

## PATRÓN DE RUTAS

Cada módulo tiene su archivo .route.ts:
- views.route.ts (principal)
- ui/ui-pages.route.ts
- forms/form.route.ts
- etc.

Todos exportan constante Routes con lazy loading.
