import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth';
import { ILoginResponse } from '../../shared/interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;

  // Simple signals
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  private loginSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const icon = document.getElementById('passwordIcon') as HTMLElement;
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.className = 'fa-regular fa-eye-slash';
    } else {
      passwordInput.type = 'password';
      icon.className = 'fa-regular fa-eye';
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, password } = this.loginForm.value;

    this.loginSubscription = this.authService.login(email, password).subscribe({
      next: (response: ILoginResponse) => {
        this.isLoading.set(false);
        this.successMessage.set('Login successful! Redirecting...');
        
        this.authService.setToken(response.token);
        console.log(response.token);
        this.authService.setUser(response.user);
        console.log(response.user);

        setTimeout(() => {
          // Check if user is admin
          const user = this.authService.getUser();
          if (user?.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            // Regular users go to homepage
            this.router.navigate(['/']);
          }
        }, 5);
      },
      
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Invalid email or password. Please try again.');
      }
    });
  }

  onInputChange(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}