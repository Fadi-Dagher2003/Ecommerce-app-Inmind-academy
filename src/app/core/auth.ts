import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { 
  IUser, 
  ILoginRequest, 
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse
} from '../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  private apiUrl = 'http://localhost:4000/api';
  private tokenKey = 'token';
  private userKey = 'user';
  
  private loginUrl = `${this.apiUrl}/auth/login`;
  private registerUrl = `${this.apiUrl}/auth/register`;

  // Signals for reactive state
  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<IUser | null>(null);

  // Computed signals
  isLoggedIn = computed(() => !!this.tokenSignal());
  currentUser = computed(() => this.userSignal());

  constructor() {
    this.loadFromCookies();
  }

  private loadFromCookies(): void {
    const token = this.cookieService.get(this.tokenKey);
    const userData = this.cookieService.get(this.userKey);
    
    if (token) {
      this.tokenSignal.set(token);
    }
    if (userData) {
      try {
        this.userSignal.set(JSON.parse(userData));
      } catch {
        this.userSignal.set(null);
      }
    }
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  setToken(token: string): void {
    this.tokenSignal.set(token);
    this.cookieService.set(this.tokenKey, token, {
      expires: 7,
      path: '/',
      secure: false,
      sameSite: 'Lax'
    });
  }

  getUser(): IUser | null {
    return this.userSignal();
  }

  setUser(user: IUser): void {
    this.userSignal.set(user);
    this.cookieService.set(this.userKey, JSON.stringify(user), {
      expires: 7,
      path: '/',
      secure: false,
      sameSite: 'Lax'
    });
  }

  removeToken(): void {
    this.tokenSignal.set(null);
    this.cookieService.delete(this.tokenKey, '/');
  }

  removeUser(): void {
    this.userSignal.set(null);
    this.cookieService.delete(this.userKey, '/');
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  // ✅ Login with error handling
  login(email: string, password: string): Observable<ILoginResponse> {
    const body: ILoginRequest = { email, password };
    return this.http.post<ILoginResponse>(this.loginUrl, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ✅ Register with error handling
  register(
    email: string,
    firstName: string,
    lastName: string, 
    password: string,
    username: string,
    dateOfBirth: string,
    role: string
  ): Observable<IRegisterResponse> {
    const body: IRegisterRequest = { 
      email, 
      firstName, 
      lastName, 
      password, 
      username, 
      dateOfBirth, 
      role 
    };
    return this.http.post<IRegisterResponse>(this.registerUrl, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ✅ Error handler that extracts the actual error message
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error - try to extract the message from the response
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}