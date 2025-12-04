import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">DP</span>
          <h1>Create Account</h1>
          <p>Sign up for a new account</p>
        </div>

        @if (errorMessage) {
          <div class="alert alert-danger">{{ errorMessage }}</div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                class="form-control"
                formControlName="firstName"
                placeholder="John"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                class="form-control"
                formControlName="lastName"
                placeholder="Doe"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              class="form-control"
              formControlName="email"
              placeholder="john@example.com"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              type="password"
              id="password"
              class="form-control"
              formControlName="password"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="isLoading || registerForm.invalid">
            @if (isLoading) {
              <span class="spinner-small"></span>
            } @else {
              Create Account
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
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
      max-width: 450px;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { firstName, lastName, email, password } = this.registerForm.value;

    this.authService.register(email, password, firstName, lastName).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}

