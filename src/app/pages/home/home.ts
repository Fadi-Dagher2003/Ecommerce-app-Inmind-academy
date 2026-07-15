import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Header with Auth Buttons -->
      <div class="header">
        <h1>Welcome to Our Store</h1>
        <div class="auth-buttons">
          @if (!isLoggedIn()) {
            <a routerLink="/login" class="login-btn">Login</a>
            <a routerLink="/signup" class="signup-btn">Sign Up</a>
          } @else {
            <span class="welcome-text">Welcome, {{ getUserName() }}!</span>
            <button (click)="logout()" class="logout-btn">Logout</button>
          }
        </div>
      </div>
      
      <div class="products-grid">
        <div class="product-card" *ngFor="let product of products">
          <h3>{{ product.title }}</h3>
          <p>{{ product.price }}</p>
        </div>
      </div>

      @if (isAdmin()) {
        <button (click)="goToAdmin()" class="admin-btn">Go to Admin Panel</button>
      }
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #111;
      margin: 0;
      font-family: 'Poppins', sans-serif;
    }
    
    .auth-buttons {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .login-btn {
      padding: 10px 24px;
      background: #111;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .login-btn:hover {
      background: #333;
      transform: translateY(-2px);
    }
    
    .signup-btn {
      padding: 10px 24px;
      background: transparent;
      color: #111;
      border: 2px solid #111;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .signup-btn:hover {
      background: #111;
      color: white;
      transform: translateY(-2px);
    }
    
    .welcome-text {
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      color: #111;
    }
    
    .logout-btn {
      padding: 8px 20px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .logout-btn:hover {
      background: #c0392b;
      transform: translateY(-2px);
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .product-card {
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
      background: white;
      transition: all 0.3s ease;
    }
    
    .product-card:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    
    .product-card h3 {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      margin: 0 0 8px 0;
    }
    
    .product-card p {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      color: #111;
      margin: 0;
    }
    
    .admin-btn {
      margin-top: 30px;
      padding: 12px 24px;
      background: #111;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .admin-btn:hover {
      background: #333;
      transform: translateY(-2px);
    }
  `]
})
export class HomeComponent {
  products = [
    { id: 1, title: 'Product 1', price: '$99.99' },
    { id: 2, title: 'Product 2', price: '$149.99' },
    { id: 3, title: 'Product 3', price: '$199.99' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    const user = this.authService.getUser();
    return user?.role === 'admin';
  }

  getUserName(): string {
    const user = this.authService.getUser();
    return user?.firstName || user?.username || 'User';
  }

  goToAdmin(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  logout(): void {
    this.authService.logout();
  }
}