import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionService, TransactionSummary } from '../../core/services/transaction.service';
import { DisputeService, DisputeSummary } from '../../core/services/dispute.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="container">
        <div class="page-header">
          <h1>Dashboard</h1>
          <p>Overview of your transactions and disputes</p>
        </div>

        @if (isLoading) {
          <div class="loading-container">
            <div class="spinner"></div>
          </div>
        } @else {
          <!-- Summary Cards -->
          <div class="stats-grid">
            <div class="card stat-card">
              <div class="stat-icon transactions">TXN</div>
              <div class="stat-content">
                <span class="stat-value">{{ transactionSummary?.totalTransactions || 0 }}</span>
                <span class="stat-label">Total Transactions</span>
              </div>
            </div>

            <div class="card stat-card">
              <div class="stat-icon amount">R</div>
              <div class="stat-content">
                <span class="stat-value">{{ formatCurrency(transactionSummary?.totalAmount || 0) }}</span>
                <span class="stat-label">Total Amount</span>
              </div>
            </div>

            <div class="card stat-card">
              <div class="stat-icon disputes">!</div>
              <div class="stat-content">
                <span class="stat-value">{{ disputeSummary?.totalDisputes || 0 }}</span>
                <span class="stat-label">Total Disputes</span>
              </div>
            </div>

            <div class="card stat-card">
              <div class="stat-icon open">#</div>
              <div class="stat-content">
                <span class="stat-value">{{ disputeSummary?.openDisputes || 0 }}</span>
                <span class="stat-label">Open Disputes</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="actions-grid">
              <a routerLink="/transactions" class="card action-card">
                <span class="action-icon">→</span>
                <span class="action-title">View Transactions</span>
                <span class="action-desc">Browse and filter your transaction history</span>
              </a>
              <a routerLink="/disputes" class="card action-card">
                <span class="action-icon">→</span>
                <span class="action-title">Manage Disputes</span>
                <span class="action-desc">Track and manage your dispute cases</span>
              </a>
            </div>
          </div>

          <!-- Dispute Status Breakdown -->
          @if (disputeSummary && disputeSummary.totalDisputes > 0) {
            <div class="dispute-breakdown">
              <h2>Dispute Status</h2>
              <div class="card">
                <div class="card-body">
                  <div class="status-list">
                    @for (item of getDisputeStatusList(); track item.status) {
                      <div class="status-item">
                        <span class="status-name">{{ formatStatus(item.status) }}</span>
                        <span class="status-count">{{ item.count }}</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem 1rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
    }

    .stat-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(99, 102, 241, 0.1);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .quick-actions, .dispute-breakdown {
      margin-bottom: 2rem;

      h2 {
        margin-bottom: 1rem;
        font-size: 1.25rem;
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .action-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .action-title {
      font-weight: 600;
      color: #f8fafc;
      margin-bottom: 0.25rem;
    }

    .action-desc {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .status-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 8px;
    }

    .status-name {
      color: #e2e8f0;
    }

    .status-count {
      font-weight: 600;
      color: #6366f1;
    }
  `]
})
export class DashboardComponent implements OnInit {
  transactionSummary: TransactionSummary | null = null;
  disputeSummary: DisputeSummary | null = null;
  isLoading = true;

  constructor(
    private transactionService: TransactionService,
    private disputeService: DisputeService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.transactionService.getSummary().subscribe({
      next: (response) => {
        this.transactionSummary = response.data;
      }
    });

    this.disputeService.getSummary().subscribe({
      next: (response) => {
        this.disputeSummary = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(value);
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  getDisputeStatusList(): { status: string; count: number }[] {
    if (!this.disputeSummary?.disputesByStatus) return [];
    return Object.entries(this.disputeSummary.disputesByStatus)
      .map(([status, count]) => ({ status, count }));
  }
}

