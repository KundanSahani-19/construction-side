import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Server / prerender ke time localStorage access mat karo
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token =
    localStorage.getItem('authToken');

  if (token) {
    return true;
  }

  return router.createUrlTree([
    '/login'
  ]);
};