import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/sign-in/sign-in.component').then(
        (m) => m.SignInComponent,
      ),
    data: { title: 'Login' },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    data: { title: 'Register' },
  },
  {
    path: 'recoverpw',
    loadComponent: () =>
      import('./components/recover-pasword/recover-pasword.component').then(
        (m) => m.RecoverPaswordComponent,
      ),
    data: { title: 'Recover Password' },
  },
  {
    path: 'lock-screen',
    loadComponent: () =>
      import('./components/lock-screen/lock-screen.component').then(
        (m) => m.LockScreenComponent,
      ),
    data: { title: 'Lock Screen' },
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./components/logout/logout.component').then(
        (m) => m.LogoutComponent,
      ),
    data: { title: 'Logout' },
  },
  {
    path: 'confirm-mail',
    loadComponent: () =>
      import('./components/confirm-mail/confirm-mail.component').then(
        (m) => m.ConfirmMailComponent,
      ),
    data: { title: 'Confirm Mail' },
  },
  {
    path: 'email-verification',
    loadComponent: () =>
      import(
        './components/email-verifivation/email-verifivation.component'
      ).then((m) => m.EmailVerifivationComponent),
    data: { title: 'Email Verification' },
  },
];
