import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { HeroComponent } from './components/hero/hero';
import { CategoryPillarsComponent } from './components/category-pillars/category-pillars';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

export interface Product {
  id: number;
  title: string;
  image: string;
  description?: string;
  price?: string;
  rating?: number;
  reviews?: number;
  isBestseller?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    HeroComponent, 
    CategoryPillarsComponent,
    ProductCardComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  // ✅ Popular Products (Simple Card - no extra details)
  popularProducts: Product[] = [
    { 
      id: 1, 
      title: 'Ready for Lift(ing) Off', 
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600' 
    },
    { 
      id: 2, 
      title: 'Everyday Seamless Restock', 
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600' 
    },
    { 
      id: 3, 
      title: 'Studio Audio Active ANC', 
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600' 
    },
    { 
      id: 4, 
      title: 'For Every Daily Run', 
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' 
    }
  ];

  // ✅ Bestsellers (Full Card - with all details)
  bestsellers: Product[] = [
    {
      id: 5,
      title: 'Chrono Flex Sneaker',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
      description: 'Lightweight engineered mesh upper built for explosive high-intensity training intervals.',
      price: 'US$85',
      rating: 5,
      reviews: 353,
      isBestseller: true
    },
    {
      id: 6,
      title: 'Sleek Comfort Hoodie',
      image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=500',
      description: 'Premium heavy-knit cotton blend featuring a structured drop-shoulder oversized profile.',
      price: 'US$72',
      rating: 4.5,
      reviews: 353,
      isBestseller: true
    },
    {
      id: 7,
      title: 'Studio Headset Max',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500',
      description: 'Advanced active noise cancellation pairing crystal clear audio with high-fidelity acoustics.',
      price: 'US$145',
      rating: 5,
      reviews: 353,
      isBestseller: true
    },
    {
      id: 8,
      title: 'Community Utility Tee',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500',
      description: 'Ultra-breathable seamless technology designed to wick away heavy moisture comfortably.',
      price: 'US$45',
      rating: 4,
      reviews: 353,
      isBestseller: true
    }
    
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