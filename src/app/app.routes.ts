import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';
import { LoginGuard } from './core/login.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: '**', redirectTo: '' }
];