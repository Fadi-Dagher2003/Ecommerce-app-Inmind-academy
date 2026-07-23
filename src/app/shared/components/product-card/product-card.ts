import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../interfaces/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  @Input() product!: IProduct;
  @Input() showDescription: boolean = false;
  @Input() showPrice: boolean = false;
  @Input() showRating: boolean = false;
  @Input() showFavorite: boolean = false;
  @Input() compact: boolean = false;

  @Output() productClick = new EventEmitter<IProduct>();
  @Output() favoriteClick = new EventEmitter<IProduct>();

  get fullStars(): number[] {
    if (!this.product?.rating?.rate) return [];
    return Array(Math.floor(this.product.rating.rate)).fill(0);
  }

  get hasHalfStar(): boolean {
    if (!this.product?.rating?.rate) return false;
    return this.product.rating.rate % 1 >= 0.5;
  }

  get emptyStars(): number[] {
    if (!this.product?.rating?.rate) return [];
    return Array(5 - Math.ceil(this.product.rating.rate)).fill(0);
  }

  onCardClick(): void {
    this.productClick.emit(this.product);
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteClick.emit(this.product);
  }
}