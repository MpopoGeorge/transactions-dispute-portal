import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/transaction-list/transaction-list.component').then(m => m.TransactionListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'transactions/:id',
    loadComponent: () => import('./features/transactions/transaction-detail/transaction-detail.component').then(m => m.TransactionDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'disputes',
    loadComponent: () => import('./features/disputes/dispute-list/dispute-list.component').then(m => m.DisputeListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'disputes/:id',
    loadComponent: () => import('./features/disputes/dispute-detail/dispute-detail.component').then(m => m.DisputeDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

