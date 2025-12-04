import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">DP</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        @if (errorMessage) {
          <div class="alert alert-danger">{{ errorMessage }}</div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              class="form-control"
              formControlName="email"
              placeholder="Enter your email"
            />
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <span class="form-error">Please enter a valid email</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              type="password"
              id="password"
              class="form-control"
              formControlName="password"
              placeholder="Enter your password"
            />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <span class="form-error">Password is required</span>
            }
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="isLoading || loginForm.invalid">
            @if (isLoading) {
              <span class="spinner-small"></span>
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
        </div>

        <div class="demo-credentials">
          <strong>Mpopo Credentials:</strong><br>
          Email: gtmpopo&#64;gmail.com<br>
          Password: NoPassword123
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(71, 85, 105, 0.5);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(10px);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;

      .auth-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      p {
        color: #94a3b8;
      }
    }

    .btn-block {
      width: 100%;
      margin-top: 1rem;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: #94a3b8;

      a {
        color: #6366f1;
        font-weight: 500;
      }
    }

    .demo-credentials {
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 8px;
      font-size: 0.875rem;
      color: #94a3b8;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}

