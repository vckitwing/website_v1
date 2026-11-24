import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Only signed-in users get in; everyone else is sent to the login page. */
export const signedInGuard: CanActivateFn = async () => {
  // inject() only works before the first await
  const auth = inject(AuthService);
  const router = inject(Router);
  return (await auth.restore()) ? true : router.createUrlTree(['/login']);
};

/** Pages for super admins only (users, audit log). */
export const superAdminGuard: CanActivateFn = () => {
  return inject(AuthService).isSuperAdmin() ? true : inject(Router).createUrlTree(['/conferences']);
};
