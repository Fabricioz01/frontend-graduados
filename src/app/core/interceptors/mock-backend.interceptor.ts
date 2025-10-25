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

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const { url, method, body } = request;

    if (!url.includes('/api/')) {
      return next.handle(request);
    }

    if (url.endsWith('/api/login') && method === 'POST') {
      return this.mockLogin(body);
    }

    if (url.includes('/api/')) {
      return this.mockGenericSuccess();
    }

    return next.handle(request);
  }

  private mockLogin(credentials: any): Observable<HttpEvent<any>> {
    const validCredentials = [
      { email: 'user@demo.com', password: '123456' },
      { email: 'admin@demo.com', password: 'admin123' },
    ];

    const isValid = validCredentials.some(
      (cred) =>
        cred.email === credentials.email &&
        cred.password === credentials.password,
    );

    if (!isValid) {
      return throwError(() => ({
        status: 401,
        error: { message: 'Credenciales inválidas' },
      })).pipe(delay(500));
    }

    const mockUser = {
      id: 1,
      email: credentials.email,
      firstName: 'Usuario',
      lastName: 'Demo',
      token: 'mock-jwt-token-' + Date.now(),
      role: 'admin',
    };

    return of(new HttpResponse({ status: 200, body: mockUser })).pipe(
      delay(500),
    );
  }

  private mockGenericSuccess(): Observable<HttpEvent<any>> {
    return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(
      delay(300),
    );
  }
}
