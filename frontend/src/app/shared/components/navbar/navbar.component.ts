import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a routerLink="/dashboard" class="navbar-brand">
          <span class="brand-icon">DP</span>
          <span class="brand-text">Dispute Portal</span>
        </a>

        <div class="navbar-menu">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            Dashboard
          </a>
          <a routerLink="/transactions" routerLinkActive="active" class="nav-link">
            Transactions
          </a>
          <a routerLink="/disputes" routerLinkActive="active" class="nav-link">
            Disputes
          </a>
        </div>

        <div class="navbar-actions">
          <span class="user-name">{{ userName }}</span>
          <button class="btn btn-secondary" (click)="logout()">
            Logout
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(71, 85, 105, 0.3);
      z-index: 1000;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #f8fafc;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .brand-icon {
      font-size: 1.5rem;
    }

    .navbar-menu {
      display: flex;
      gap: 0.5rem;
    }

    .nav-link {
      padding: 0.5rem 1rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        color: #f8fafc;
        background: rgba(71, 85, 105, 0.3);
      }

      &.active {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.1);
      }
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .brand-text, .user-name {
        display: none;
      }
      
      .navbar-menu {
        gap: 0.25rem;
      }
      
      .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  get userName(): string {
    const user = this.authService.getUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  logout(): void {
    this.authService.logout();
  }
}

