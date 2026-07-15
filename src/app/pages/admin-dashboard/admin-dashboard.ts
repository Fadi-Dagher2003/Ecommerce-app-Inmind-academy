import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome Admin!</p>
      <div class="admin-stats">
        <div class="stat-card">
          <h3>Total Products</h3>
          <p>156</p>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <p>89</p>
        </div>
        <div class="stat-card">
          <h3>Total Users</h3>
          <p>245</p>
        </div>
      </div>
      <button (click)="goToHome()">Go to Homepage</button>
      <button (click)="logout()" class="logout-btn">Logout</button>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111;
      font-family: 'Poppins', sans-serif;
    }
    .admin-stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .stat-card {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
    }
    .stat-card h3 {
      font-size: 14px;
      color: #666;
      font-family: 'Poppins', sans-serif;
    }
    .stat-card p {
      font-size: 32px;
      font-weight: 700;
      color: #111;
      margin-top: 8px;
      font-family: 'Poppins', sans-serif;
    }
    button {
      padding: 12px 24px;
      background: #111;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 10px;
      font-family: 'Poppins', sans-serif;
    }
    .logout-btn {
      background: #e74c3c;
    }
    .logout-btn:hover {
      background: #c0392b;
    }
  `]
})
export class AdminDashboardComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  goToHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
  }
}