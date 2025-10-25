import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Mock Backend Interceptor para desarrollo SIN backend
 * 
 * IMPORTANTE: Este interceptor solo debe usarse en desarrollo
 * cuando no tienes backend disponible. Simula respuestas exitosas
 * para las llamadas a la API.
 * 
 * Para activarlo, descomenta la línea en app.config.ts
 * Para desactivarlo, comenta la línea en app.config.ts
 */
@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, body } = request;

    // Solo interceptar llamadas a /api/
    if (!url.includes('/api/')) {
      return next.handle(request);
    }

    // Simular login exitoso
    if (url.endsWith('/api/login') && method === 'POST') {
      return this.mockLogin(body);
    }

    // Simular otras llamadas API
    if (url.includes('/api/')) {
      return this.mockGenericSuccess();
    }

    // Si no es una ruta /api/, dejar pasar la petición normal
    return next.handle(request);
  }

  /**
   * Simula un login exitoso
   */
  private mockLogin(credentials: any): Observable<HttpEvent<any>> {
    // Validación simple de credenciales (opcional)
    const validCredentials = [
      { email: 'user@demo.com', password: '123456' },
      { email: 'admin@demo.com', password: 'admin123' },
    ];

    const isValid = validCredentials.some(
      (cred) =>
        cred.email === credentials.email &&
        cred.password === credentials.password
    );

    if (!isValid) {
      return throwError(() => ({
        status: 401,
        error: { message: 'Credenciales inválidas' },
      })).pipe(delay(500));
    }

    // Respuesta mock exitosa
    const mockUser = {
      id: 1,
      email: credentials.email,
      firstName: 'Usuario',
      lastName: 'Demo',
      token: 'mock-jwt-token-' + Date.now(),
      role: 'admin',
    };

    return of(new HttpResponse({ status: 200, body: mockUser })).pipe(
      delay(500) // Simular latencia de red
    );
  }

  /**
   * Simula una respuesta genérica exitosa
   */
  private mockGenericSuccess(): Observable<HttpEvent<any>> {
    return of(
      new HttpResponse({ status: 200, body: { success: true } })
    ).pipe(delay(300));
  }
}
