import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService, TransactionDetail } from '../../../core/services/transaction.service';
import { DisputeService } from '../../../core/services/dispute.service';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="transaction-detail">
      <div class="container">
        <a routerLink="/transactions" class="back-link">← Back to Transactions</a>

        @if (isLoading) {
          <div class="loading-container">
            <div class="spinner"></div>
          </div>
        } @else if (transaction) {
          <div class="detail-header">
            <div>
              <h1>{{ transaction.merchant }}</h1>
              <p class="text-muted">Transaction Details</p>
            </div>
            <span [class]="'badge badge-' + getStatusClass(transaction.status)">
              {{ transaction.status }}
            </span>
          </div>

          <div class="detail-grid">
            <div class="card">
              <div class="card-body">
                <h3>Transaction Information</h3>
                <dl class="detail-list">
                  <div class="detail-item">
                    <dt>Amount</dt>
                    <dd class="amount">{{ formatCurrency(transaction.amount) }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Category</dt>
                    <dd>{{ formatCategory(transaction.category) }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Date</dt>
                    <dd>{{ formatDate(transaction.date) }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Description</dt>
                    <dd>{{ transaction.description || 'No description' }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            @if (transaction.dispute) {
              <div class="card dispute-card">
                <div class="card-body">
                  <h3>⚠️ Active Dispute</h3>
                  <p>This transaction has an active dispute.</p>
                  <a [routerLink]="['/disputes', transaction.dispute.id]" class="btn btn-primary">
                    View Dispute
                  </a>
                </div>
              </div>
            } @else if (transaction.status !== 'DISPUTED') {
              <div class="card">
                <div class="card-body">
                  <h3>File a Dispute</h3>
                  
                  @if (disputeError) {
                    <div class="alert alert-danger">{{ disputeError }}</div>
                  }

                  <div class="form-group">
                    <label class="form-label">Reason</label>
                    <select class="form-control" [(ngModel)]="disputeForm.reason">
                      <option value="">Select a reason</option>
                      <option value="UNAUTHORIZED">Unauthorized Transaction</option>
                      <option value="DUPLICATE">Duplicate Charge</option>
                      <option value="INCORRECT_AMOUNT">Incorrect Amount</option>
                      <option value="NOT_RECEIVED">Goods/Services Not Received</option>
                      <option value="CANCELLED">Cancelled Transaction</option>
                      <option value="FRAUDULENT">Fraudulent Activity</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea
                      class="form-control"
                      rows="4"
                      placeholder="Please describe the issue in detail..."
                      [(ngModel)]="disputeForm.description"
                    ></textarea>
                  </div>

                  <button
                    class="btn btn-danger"
                    [disabled]="isSubmitting || !disputeForm.reason || !disputeForm.description"
                    (click)="submitDispute()"
                  >
                    @if (isSubmitting) {
                      Submitting...
                    } @else {
                      Submit Dispute
                    }
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .transaction-detail {
      padding: 2rem 1rem;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: #94a3b8;
      
      &:hover {
        color: #6366f1;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;

      h1 {
        margin-bottom: 0.25rem;
      }
    }

    .detail-grid {
      display: grid;
      gap: 1.5rem;
    }

    h3 {
      margin-bottom: 1.5rem;
      font-size: 1.125rem;
    }

    .detail-list {
      display: grid;
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(71, 85, 105, 0.3);

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      dt {
        color: #94a3b8;
      }

      dd {
        font-weight: 500;
        color: #f8fafc;
        text-align: right;
      }
    }

    .amount {
      font-family: 'Courier New', monospace;
      font-size: 1.25rem;
    }

    .dispute-card {
      border-color: rgba(245, 158, 11, 0.5);
      background: rgba(245, 158, 11, 0.05);

      h3 {
        color: #f59e0b;
      }
    }
  `]
})
export class TransactionDetailComponent implements OnInit {
  transaction: TransactionDetail | null = null;
  isLoading = true;
  isSubmitting = false;
  disputeError = '';

  disputeForm = {
    reason: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private disputeService: DisputeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTransaction(id);
    }
  }

  loadTransaction(id: string): void {
    this.transactionService.getTransaction(id).subscribe({
      next: (response) => {
        this.transaction = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  submitDispute(): void {
    if (!this.transaction || !this.disputeForm.reason || !this.disputeForm.description) return;

    this.isSubmitting = true;
    this.disputeError = '';

    this.disputeService.createDispute({
      transactionId: this.transaction.id,
      reason: this.disputeForm.reason,
      description: this.disputeForm.description
    }).subscribe({
      next: (response) => {
        this.router.navigate(['/disputes', response.data.id]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.disputeError = err.error?.message || 'Failed to submit dispute';
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(value);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'DISPUTED': return 'danger';
      default: return 'secondary';
    }
  }
}

