import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); //inject not to use a class constructor
  const router = inject(Router);
  
  const token = authService.getToken();
  
  console.log('token: ', token);
  
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // add token to http request
      }
    });
    console.log('Token added to request');
  }

  return next(authReq).pipe( //send request
    catchError((error) => {
      console.error('Error:', error.status, error.url);
      if (error.status === 401) {
        console.log('401 Unauthorized');
        authService.logout();
        router.navigate(['/login']);
      }
      if (error.status === 404) {
        console.log('404 Not Found - Redirecting to 404 page');
        router.navigate(['/404']);
      }
      
      return throwError(() => error);
    })
  );
};