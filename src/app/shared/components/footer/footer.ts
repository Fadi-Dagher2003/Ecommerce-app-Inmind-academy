import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {

  currentYear = signal(new Date().getFullYear());


  paymentMethods = [
    { name: 'Visa', path: 'images/payment/visa.png' },
    { name: 'Mastercard', path: 'images/payment/mastercard.png' },
    { name: 'WhishMoney', path: 'images/payment/whish.png' },
    { name: 'Omt', path: 'images/payment/omt.png' }
  ];


  onSubscribe(email: string): void {
    if (email) {
     
    }
  }
  
}