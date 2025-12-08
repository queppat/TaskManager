import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from './auth';

export const authGuard: CanActivateFn = async (state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.loading()) {
    await auth.initialize();
  }

  if (auth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};