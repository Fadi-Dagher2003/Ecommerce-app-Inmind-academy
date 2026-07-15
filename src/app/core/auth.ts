import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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

  // Updated to local Docker backend
  private apiUrl = 'http://localhost:4000/api';
  private tokenKey = 'token';
  private userKey = 'user';
  
  private loginUrl = `${this.apiUrl}/auth/login`;
  private registerUrl = `${this.apiUrl}/auth/register`;

  currentUser: IUser | undefined;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.currentUser = this.getUserFromCookie();
  }

  getToken(): string {
    return this.cookieService.get(this.tokenKey);
  }

  setToken(token: string): void {
    this.cookieService.set(this.tokenKey, token, {
      expires: 7, //days
      path: '/',
      secure: false,
      sameSite: 'Lax'
    });
  }

  hasToken(): boolean {
    return this.cookieService.check(this.tokenKey);
  }

  removeToken(): void {
    this.cookieService.delete(this.tokenKey, '/');
  }

  getUser(): IUser | undefined {
    return this.currentUser;
  }

  setUser(user: IUser): void {
    this.currentUser = user;
    this.cookieService.set(this.userKey, JSON.stringify(user), {
      expires: 7,
      path: '/',
      secure: false,
      sameSite: 'Lax'
    });
  }

  removeUser(): void {
    this.currentUser = undefined;
    this.cookieService.delete(this.userKey, '/');
  }

  private getUserFromCookie(): IUser | undefined {
    const userData = this.cookieService.get(this.userKey);
    return userData ? JSON.parse(userData) : undefined;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  login(email: string, password: string): Observable<ILoginResponse> {
    const body: ILoginRequest = { email, password };
    return this.http.post<ILoginResponse>(this.loginUrl, body)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
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
    return this.http.post<IRegisterResponse>(this.registerUrl, body)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}