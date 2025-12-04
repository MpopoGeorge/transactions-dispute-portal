import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DisputeService, Dispute } from '../../../core/services/dispute.service';
import { Pagination } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-dispute-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dispute-list">
      <div class="container">
        <div class="page-header">
          <h1>Disputes</h1>
          <p>Track and manage your transaction disputes</p>
        </div>

        <!-- Filters -->
        <div class="card filter-card">
          <div class="card-body">
            <div class="filters">
              <div class="filter-group">
                <label class="form-label">Status</label>
                <select class="form-control" [(ngModel)]="filters.status" (change)="loadDisputes()">
                  <option value="">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="PENDING_INFO">Pending Info</option>
                  <option value="RESOLVED_APPROVED">Resolved - Approved</option>
                  <option value="RESOLVED_DENIED">Resolved - Denied</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        @if (isLoading) {
          <div class="loading-container">
            <div class="spinner"></div>
          </div>
        } @else if (disputes.length === 0) {
          <div class="empty-state card">
            <div class="card-body">
              <span class="empty-icon">—</span>
              <h3>No disputes found</h3>
              <p>You haven't filed any disputes yet</p>
              <a routerLink="/transactions" class="btn btn-primary">View Transactions</a>
            </div>
          </div>
        } @else {
          <div class="disputes-grid">
            @for (dispute of disputes; track dispute.id) {
              <a [routerLink]="['/disputes', dispute.id]" class="card dispute-card">
                <div class="card-body">
                  <div class="dispute-header">
                    <span class="merchant">{{ dispute.transaction.merchant }}</span>
                    <span [class]="'badge badge-' + getStatusClass(dispute.status)">
                      {{ formatStatus(dispute.status) }}
                    </span>
                  </div>
                  <div class="dispute-amount">{{ formatCurrency(dispute.transaction.amount) }}</div>
                  <div class="dispute-reason">{{ formatReason(dispute.reason) }}</div>
                  <div class="dispute-date">Filed {{ formatDate(dispute.createdAt) }}</div>
                </div>
              </a>
            }
          </div>

          @if (pagination && pagination.totalPages > 1) {
            <div class="pagination">
              <button
                class="btn btn-secondary"
                [disabled]="!pagination.hasPreviousPage"
                (click)="goToPage(pagination.currentPage - 1)"
              >
                Previous
              </button>
              <span class="page-info">
                Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
              </span>
              <button
                class="btn btn-secondary"
                [disabled]="!pagination.hasNextPage"
                (click)="goToPage(pagination.currentPage + 1)"
              >
                Next
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .dispute-list {
      padding: 2rem 1rem;
    }

    .filter-card {
      margin-bottom: 1.5rem;
    }

    .filters {
      max-width: 300px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;

      .empty-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }

      h3 {
        margin-bottom: 0.5rem;
      }

      p {
        color: #94a3b8;
        margin-bottom: 1.5rem;
      }
    }

    .disputes-grid {
      display: grid;
      gap: 1rem;
    }

    .dispute-card {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .dispute-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .merchant {
      font-weight: 600;
      color: #f8fafc;
    }

    .dispute-amount {
      font-size: 1.25rem;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      color: #f8fafc;
      margin-bottom: 0.25rem;
    }

    .dispute-reason {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .dispute-date {
      color: #64748b;
      font-size: 0.75rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .page-info {
      color: #94a3b8;
    }
  `]
})
export class DisputeListComponent implements OnInit {
  disputes: Dispute[] = [];
  pagination: Pagination | null = null;
  isLoading = true;

  filters = {
    status: '',
    page: 1
  };

  constructor(private disputeService: DisputeService) {}

  ngOnInit(): void {
    this.loadDisputes();
  }

  loadDisputes(): void {
    this.isLoading = true;

    this.disputeService.getDisputes({
      page: this.filters.page,
      limit: 10,
      status: this.filters.status || undefined
    }).subscribe({
      next: (response) => {
        this.disputes = response.data.disputes;
        this.pagination = response.data.pagination;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number): void {
    this.filters.page = page;
    this.loadDisputes();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(value);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  formatReason(reason: string): string {
    return reason.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OPEN': return 'warning';
      case 'UNDER_REVIEW': return 'info';
      case 'PENDING_INFO': return 'warning';
      case 'RESOLVED_APPROVED': return 'success';
      case 'RESOLVED_DENIED': return 'danger';
      case 'CLOSED': return 'secondary';
      default: return 'secondary';
    }
  }
}

