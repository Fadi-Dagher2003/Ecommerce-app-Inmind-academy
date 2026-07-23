import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProduct } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/products';

  // Get a single product by ID
  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  // Get all products (with optional limit)
  getProducts(limit?: number): Observable<IProduct[]> {
    let url = this.apiUrl;
    if (limit) {
      url += `?limit=${limit}`;
    }
    return this.http.get<IProduct[]>(url);
  }

  // Get products by category (with optional limit)
  getProductsByCategory(category: string, limit?: number): Observable<IProduct[]> {
    const encodedCategory = encodeURIComponent(category);
    let url = `${this.apiUrl}/category/${encodedCategory}`;
    if (limit) {
      url += `?limit=${limit}`;
    }
    return this.http.get<IProduct[]>(url);
  }

  // Get top N products by highest rating (client-side sorting)
  getTopRatedProducts(limit: number = 10): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl).pipe(
      map(products => {
        return [...products]
          .sort((a, b) => b.rating.rate - a.rating.rate)
          .slice(0, limit);
      })
    );
  }

  // Get products with advanced filtering (client-side)
  getProductsFilter(
    category: string | null | undefined, 
    priceAsc: boolean = false,
    priceDesc: boolean = false,
    ratingAsc: boolean = false,
    ratingDesc: boolean = false,
    limit?: number,
    excludeId?: number
  ): Observable<IProduct[]> {
    // Build the URL ith category if provided
    let url = this.apiUrl;
    if (category) {
      url = `${this.apiUrl}/category/${encodeURIComponent(category)}`;
    }
    
    return this.http.get<IProduct[]>(url).pipe(
      map(products => {
        let processedArray = [...products];

        // Exclude a specific product by ID
        if (excludeId) {
          processedArray = processedArray.filter(product => product.id !== excludeId);
        }

        // Apply sorting
        processedArray.sort((a, b) => {
          if (priceAsc) return a.price - b.price;
          if (priceDesc) return b.price - a.price;
          if (ratingAsc) return a.rating.rate - b.rating.rate;
          if (ratingDesc) return b.rating.rate - a.rating.rate;
          return 0;
        });

        // Apply limit
        return limit ? processedArray.slice(0, limit) : processedArray;
      })
    );
  }
}