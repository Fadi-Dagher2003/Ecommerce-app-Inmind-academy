import { Component, Input, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card';
import { IProduct } from '../../interfaces/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-carousel.html',
  styleUrls: ['./product-carousel.scss']
})
export class ProductCarouselComponent implements OnInit {
  @Input() nbrBestsellerProducts: number = 5;
  @Input() itemsPerPage: number = 4;
  @Input() category?: string;
  @Input() excludeProductId?: number;
  @Input() customTitle?: string;

  private productService = inject(ProductService);

  products = signal<IProduct[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  currentPage = signal(1);

  totalPages = computed(() => {
    return Math.ceil(this.products().length / this.itemsPerPage) || 1;
  });

  currentItems = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.products().slice(start, end);
  });

  hasNext = computed(() => this.currentPage() < this.totalPages());
  hasPrev = computed(() => this.currentPage() > 1);

  // Dynamic title
  title = computed(() => {
    if (this.customTitle) return this.customTitle;
    if (this.category) return 'You May Also Like';
    return `Top ${this.nbrBestsellerProducts} Bestsellers`;
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // If category is provided, fetch similar items
    if (this.category) {
      this.productService.getProductsByCategory(this.category).subscribe({
        next: (data) => {
          // ✅ Exclude current product if ID is provided
          let filtered = data;
          if (this.excludeProductId) {
            filtered = data.filter(p => p.id !== this.excludeProductId);
          }
          this.products.set(filtered);
          this.isLoading.set(false);
          this.currentPage.set(1);
        },
        error: (err) => {
          this.error.set('Failed to load similar products');
          this.isLoading.set(false);
          console.error('Error loading similar products:', err);
        }
      });
    } else {
      // Default: fetch bestsellers
      this.productService.getTopRatedProducts(this.nbrBestsellerProducts).subscribe({
        next: (data) => {
          this.products.set(data);
          this.isLoading.set(false);
          this.currentPage.set(1);
        },
        error: (err) => {
          this.error.set('Failed to load products');
          this.isLoading.set(false);
          console.error('Error loading products:', err);
        }
      });
    }
  }

  nextPage(): void {
    if (this.hasNext()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.hasPrev()) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  refresh(): void { //useless function
    this.loadProducts();
  }
}