import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { FooterComponent } from './shared/components/footer/footer';
import { AuthService } from './core/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  private authService = inject(AuthService);
  title = 'Final-Project';

  ngOnInit(): void {
    // fetch user if token exists
    if (this.authService.getToken()) {
      this.authService.fetchCurrentUser().subscribe({
        next: (user) => {
          console.log('User loaded:', user);
        },
        error: (error) => {
          console.warn('Failed to load user:', error.message);
        }
      });
    }
  }
}