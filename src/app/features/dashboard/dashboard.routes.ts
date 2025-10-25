import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: 'index',
    loadComponent: () =>
      import('./components/index/index.component').then(
        (m) => m.IndexComponent,
      ),
    data: { title: 'CRM Dashboard' },
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./components/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent,
      ),
    data: { title: 'Analytics Dashboard' },
  },
  {
    path: 'ecommerce',
    loadComponent: () =>
      import('./components/ecommerce/ecommerce.component').then(
        (m) => m.EcommerceComponent,
      ),
    data: { title: 'E-Commerce Dashboard' },
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./components/projects/projects.component').then(
        (m) => m.ProjectsComponent,
      ),
    data: { title: 'Projects Dashboard' },
  },
  {
    path: 'hrm',
    loadComponent: () =>
      import('./components/hrm/hrm.component').then((m) => m.HrmComponent),
    data: { title: 'HRM Dashboard' },
  },
  {
    path: 'jobs',
    loadComponent: () =>
      import('./components/jobs/jobs.component').then((m) => m.JobsComponent),
    data: { title: 'Jobs Dashboard' },
  },
];
