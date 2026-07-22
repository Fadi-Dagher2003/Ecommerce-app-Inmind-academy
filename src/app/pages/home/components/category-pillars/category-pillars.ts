import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-pillars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-pillars.html',
  styleUrls: ['./category-pillars.scss']
})
export class CategoryPillarsComponent {
  categories = [
    { name: 'MEN', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600', link: '/men' },
    { name: 'WOMEN', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600', link: '/women' },
    { name: 'ACCESSORIES', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600', link: '/accessories' },
    { name: 'ELECTRONICS', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600', link: '/electronics' }
  ];
}