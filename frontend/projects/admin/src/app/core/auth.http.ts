import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/** Adds the token to every request, and signs out when the server says the session is no longer valid. */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const signed = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  return next(signed).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.endsWith('/auth/login') && auth.signedIn()) {
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};
