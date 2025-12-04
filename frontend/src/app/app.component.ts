import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <app-navbar />
    }
    <main [class.with-nav]="authService.isAuthenticated()">
      <router-outlet />
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
    }
    main.with-nav {
      padding-top: 64px;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}

