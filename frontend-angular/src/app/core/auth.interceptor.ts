import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from './auth';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (req.url.includes('/auth/refresh')) {
    return next(req.clone({ withCredentials: true }));
  }

  let apiReq = req;
  const url = req.url;

  if (!url.startsWith('http') &&
    !url.startsWith('/api/') &&
    !url.startsWith('/assets/') &&
    !url.includes('.json')) {

    const baseUrl = '/api';
    const newUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    apiReq = req.clone({ url: newUrl });
  }

  const token = auth.getToken();

  if (token) {
    apiReq = apiReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  } else {
    apiReq = apiReq.clone({ withCredentials: true });
  }

  return next(apiReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {

        if (isRefreshing) {
          return throwError(() => error);
        }

        isRefreshing = true;

        return auth.refreshToken().pipe(
          switchMap((response) => {
            isRefreshing = false;

            const newToken = auth.getToken();

            const newRequest = apiReq.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken || response.accessToken}`
              },
              withCredentials: true,
            });

            return next(newRequest);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            auth.clearAuthData();

            const currentUrl = router.url;
            if (!currentUrl.includes('/login') && !currentUrl.includes('/register')) {
              router.navigate(['/login'], {
                queryParams: { returnUrl: currentUrl }
              });
            }

            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};