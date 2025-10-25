import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/api/auth.service';

export const authGuard = (url: any) => {
  // ⚠️ DESARROLLO: Guard desactivado temporalmente para testing
  // Permite acceso sin autenticación

  // TODO: Descomentar cuando conectes el backend real
  /*
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  if (!authService.session) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: url._routerState.url },
    });
  }
  */

  return true; // ← Siempre permite acceso
};
