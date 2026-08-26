import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const platformId = inject(PLATFORM_ID);

  // SSR / prerender ke time localStorage available nahi hota
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const token =
    localStorage.getItem('authToken');

  // Token nahi hai to request normally bhejo
  if (!token) {
    return next(req);
  }

  // JWT token automatically attach karo
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};