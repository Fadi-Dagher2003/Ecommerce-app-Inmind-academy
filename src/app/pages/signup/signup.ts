import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth';
import { IRegisterResponse } from '../../shared/interfaces/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  signupForm!: FormGroup;

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  passwordStrength = signal(0);
  strengthText = signal('');
  strengthClass = signal('');

  private registerSubscription!: Subscription;
  private passwordSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dateOfBirth: ['', [Validators.required]],
      role: ['user', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    });

    this.passwordSubscription = this.signupForm.get('password')?.valueChanges.subscribe((password: string) => {
      this.checkPasswordStrength(password);
    }) as Subscription;
  }

  get f() {
    return this.signupForm.controls;
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

  checkPasswordStrength(password: string): void {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;

    this.passwordStrength.set(score);

    if (password.length === 0) {
      this.strengthText.set('');
      this.strengthClass.set('');
    } else if (score <= 1) {
      this.strengthText.set('Weak');
      this.strengthClass.set('weak');
    } else if (score === 2) {
      this.strengthText.set('Medium');
      this.strengthClass.set('medium');
    } else if (score === 3) {
      this.strengthText.set('Strong');
      this.strengthClass.set('strong');
    } else if (score >= 4) {
      this.strengthText.set('Very Strong');
      this.strengthClass.set('strong');
    }
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const { 
      email, 
      firstName, 
      lastName, 
      username, 
      password, 
      dateOfBirth, 
      role 
    } = this.signupForm.value;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.registerSubscription = this.authService.register(
      email,
      firstName,
      lastName,
      password,
      username,
      dateOfBirth,
      role
    ).subscribe({
      next: (response: IRegisterResponse) => {
        this.isLoading.set(false);
        this.successMessage.set('Account created successfully! Redirecting...');
        
        this.authService.setToken(response.token);
        this.authService.setUser(response.user);
        
        console.log('Registration successful:', response);
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Registration failed. Please try again.');
        console.error('Registration error:', error);
      }
    });
  }

  onInputChange(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  ngOnDestroy(): void {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
    if (this.passwordSubscription) {
      this.passwordSubscription.unsubscribe();
    }
  }
}