import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
  
  private loginUrl = `${this.apiUrl}/auth/login`;
  private registerUrl = `${this.apiUrl}/auth/register`;
  private userProfileUrl = `${this.apiUrl}/user`; 
  private checkTokenUrl = `${this.apiUrl}/auth/check`;

  // Signals for reactive state (memory only)
  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<IUser | null>(null);

  // Computed signals real-only signals
  isLoggedIn = computed(() => !!this.tokenSignal()); // !! returns boolean
  currentUser = computed(() => this.userSignal()); // 

  constructor() {
    this.loadFromCookies();
  }

  private loadFromCookies(): void {
    const token = this.cookieService.get(this.tokenKey);
    
    if (token) {
      this.tokenSignal.set(token);
      console.log('Token loaded from cookies');
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

  // Set user ONLY in memory (Signal), NOT in cookies
  setUser(user: IUser): void {
    this.userSignal.set(user);
  }

  removeToken(): void {
    this.tokenSignal.set(null);
    this.cookieService.delete(this.tokenKey, '/');
  }

  // Remove user ONLY from memory (Signal)
  removeUser(): void {
    this.userSignal.set(null);
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
    console.log('👋 Logged out');
  }

  // Fetch current user from backend using the cookie then save him in memory(signal)
  fetchCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>(this.userProfileUrl).pipe(
      tap((user) => {
        this.setUser(user);
        console.log('User fetched and saved to memory:', user);
      }),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<ILoginResponse> {
    const body: ILoginRequest = { email, password };
    return this.http.post<ILoginResponse>(this.loginUrl, body).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setUser(response.user);
        console.log('Login successful, user in memory:', response.user);
      }),
      catchError(this.handleError)
    );
  }

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
    return this.http.post<IRegisterResponse>(this.registerUrl, body).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setUser(response.user);
        console.log('Registration successful, user in memory:', response.user);
      }),
      catchError(this.handleError)
    );
  }

  checkTokenValidity(): Observable<boolean> {
    return this.http.post<{ valid: boolean }>(this.checkTokenUrl, {}).pipe(
      map(response => response.valid),
      catchError(() => {
        this.logout();
        return of(false); 
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
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