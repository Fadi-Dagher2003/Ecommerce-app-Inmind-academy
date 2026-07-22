import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Product {
  id: number;
  title: string;
  image: string;
  description?: string;
  price?: string;
  rating?: number;
  reviews?: number;
  isBestseller?: boolean; // Controls which card style to use
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showDescription: boolean = false;
  @Input() showPrice: boolean = false;
  @Input() showRating: boolean = false;
  @Input() showFavorite: boolean = false;

  get fullStars(): number[] {
    if (!this.product.rating) return [];
    return Array(Math.floor(this.product.rating)).fill(0);
  }

  get hasHalfStar(): boolean {
    if (!this.product.rating) return false;
    return this.product.rating % 1 >= 0.5;
  }

  get emptyStars(): number[] {
    if (!this.product.rating) return [];
    return Array(5 - Math.ceil(this.product.rating)).fill(0);
  }
}