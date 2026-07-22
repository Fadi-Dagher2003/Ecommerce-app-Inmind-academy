import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    const user = this.authService.getUser();

    // 1. User is already loaded in memory
    if (user) {
      return of(this.checkAdminRole(user.role));
    }

    // 2. User is not loaded in memory yet — fetch profile from API first
    return this.authService.fetchCurrentUser().pipe(
      map(fetchedUser => this.checkAdminRole(fetchedUser?.role)),
      catchError(() => {
        // If API fails or user is unauthenticated
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }

  // Method to check user role
  private checkAdminRole(role?: string): boolean {
    if (role === 'admin') {
      return true;
    }

    // User is logged in, but NOT an admin Send to home
    this.router.navigate(['/']);
    return false;
  }
}