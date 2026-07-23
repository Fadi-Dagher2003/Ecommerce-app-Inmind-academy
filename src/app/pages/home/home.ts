import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { ProductService } from '../../shared/services/product';
import { IProduct } from '../../shared/interfaces/product';
import { HeroComponent } from './components/hero/hero';
import { CategoryPillarsComponent } from './components/category-pillars/category-pillars';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { ProductCarouselComponent } from '../../shared/components/product-carousel/product-carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    HeroComponent, 
    CategoryPillarsComponent,
    ProductCardComponent,
    ProductCarouselComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private router = inject(Router);

  // ✅ Local signals for products
  popularProducts = signal<IProduct[]>([]);
  bestsellers = signal<IProduct[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  // ✅ Load data using service methods
  loadData(): void {
    this.isLoading.set(true);

    // ✅ Fetch popular products (first 4)
    this.productService.getTopRatedProducts(4).subscribe({
      next: (data) => {
        this.popularProducts.set(data);
      },
      error: (err) => {
        console.error('Error loading popular products:', err);
      }
    });

    // ✅ Fetch bestsellers (top 10 rated)
    this.productService.getTopRatedProducts().subscribe({
      next: (data) => {
        this.bestsellers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading bestsellers:', err);
        this.isLoading.set(false);
      }
    });
  }

  // ============================================================
  // AUTH METHODS
  // ============================================================

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