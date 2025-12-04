import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService, Transaction, Pagination } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="transaction-list">
      <div class="container">
        <div class="page-header">
          <h1>Transactions</h1>
          <p>View and manage your transaction history</p>
        </div>

        <!-- Filters -->
        <div class="card filter-card">
          <div class="card-body">
            <div class="filters">
              <div class="filter-group">
                <label class="form-label">Search</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search by merchant..."
                  [(ngModel)]="filters.search"
                  (input)="onSearch()"
                />
              </div>
              <div class="filter-group">
                <label class="form-label">Category</label>
                <select class="form-control" [(ngModel)]="filters.category" (change)="loadTransactions()">
                  <option value="">All Categories</option>
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ formatCategory(cat) }}</option>
                  }
                </select>
              </div>
              <div class="filter-group">
                <label class="form-label">Status</label>
                <select class="form-control" [(ngModel)]="filters.status" (change)="loadTransactions()">
                  <option value="">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="DISPUTED">Disputed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        @if (isLoading) {
          <div class="loading-container">
            <div class="spinner"></div>
          </div>
        } @else if (transactions.length === 0) {
          <div class="empty-state card">
            <div class="card-body">
              <span class="empty-icon">—</span>
              <h3>No transactions found</h3>
              <p>Try adjusting your filters</p>
            </div>
          </div>
        } @else {
          <!-- Transactions Table -->
          <div class="card">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (transaction of transactions; track transaction.id) {
                    <tr>
                      <td>
                        <a [routerLink]="['/transactions', transaction.id]" class="merchant-link">
                          {{ transaction.merchant }}
                        </a>
                      </td>
                      <td>{{ formatCategory(transaction.category) }}</td>
                      <td>{{ formatDate(transaction.date) }}</td>
                      <td class="amount">{{ formatCurrency(transaction.amount) }}</td>
                      <td>
                        <span [class]="'badge badge-' + getStatusClass(transaction.status)">
                          {{ transaction.status }}
                        </span>
                      </td>
                      <td>
                        <a [routerLink]="['/transactions', transaction.id]" class="btn btn-secondary btn-sm">
                          View
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pagination -->
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
    .transaction-list {
      padding: 2rem 1rem;
    }

    .filter-card {
      margin-bottom: 1.5rem;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
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
      }
    }

    .table-responsive {
      overflow-x: auto;
    }

    .merchant-link {
      color: #f8fafc;
      font-weight: 500;
      
      &:hover {
        color: #6366f1;
      }
    }

    .amount {
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8rem;
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
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  pagination: Pagination | null = null;
  isLoading = true;
  
  filters = {
    search: '',
    category: '',
    status: '',
    page: 1
  };

  categories = [
    'SHOPPING', 'GROCERIES', 'RESTAURANTS', 'ENTERTAINMENT',
    'TRAVEL', 'UTILITIES', 'HEALTHCARE', 'EDUCATION', 'TRANSFER', 'ATM', 'OTHER'
  ];

  private searchTimeout: any;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    
    this.transactionService.getTransactions({
      page: this.filters.page,
      limit: 10,
      search: this.filters.search || undefined,
      category: this.filters.category || undefined,
      status: this.filters.status || undefined
    }).subscribe({
      next: (response) => {
        this.transactions = response.data.transactions;
        this.pagination = response.data.pagination;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filters.page = 1;
      this.loadTransactions();
    }, 300);
  }

  goToPage(page: number): void {
    this.filters.page = page;
    this.loadTransactions();
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

