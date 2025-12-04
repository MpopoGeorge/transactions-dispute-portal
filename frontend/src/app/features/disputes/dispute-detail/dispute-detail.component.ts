import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DisputeService, DisputeDetail, DisputeEvent } from '../../../core/services/dispute.service';

@Component({
  selector: 'app-dispute-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dispute-detail">
      <div class="container">
        <a routerLink="/disputes" class="back-link">← Back to Disputes</a>

        @if (isLoading) {
          <div class="loading-container">
            <div class="spinner"></div>
          </div>
        } @else if (dispute) {
          <div class="detail-header">
            <div>
              <h1>Dispute Details</h1>
              <p class="text-muted">{{ dispute.transaction.merchant }}</p>
            </div>
            <span [class]="'badge badge-lg badge-' + getStatusClass(dispute.status)">
              {{ formatStatus(dispute.status) }}
            </span>
          </div>

          <div class="detail-grid">
            <!-- Transaction Info -->
            <div class="card">
              <div class="card-body">
                <h3>Transaction</h3>
                <dl class="detail-list">
                  <div class="detail-item">
                    <dt>Merchant</dt>
                    <dd>{{ dispute.transaction.merchant }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Amount</dt>
                    <dd class="amount">{{ formatCurrency(dispute.transaction.amount) }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Category</dt>
                    <dd>{{ formatCategory(dispute.transaction.category) }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Date</dt>
                    <dd>{{ formatDate(dispute.transaction.date) }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Dispute Info -->
            <div class="card">
              <div class="card-body">
                <h3>Dispute Information</h3>
                <dl class="detail-list">
                  <div class="detail-item">
                    <dt>Reason</dt>
                    <dd>{{ formatReason(dispute.reason) }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Filed On</dt>
                    <dd>{{ formatDate(dispute.createdAt) }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Last Updated</dt>
                    <dd>{{ formatDate(dispute.updatedAt) }}</dd>
                  </div>
                  @if (dispute.resolvedAt) {
                    <div class="detail-item">
                      <dt>Resolved On</dt>
                      <dd>{{ formatDate(dispute.resolvedAt) }}</dd>
                    </div>
                  }
                </dl>
              </div>
            </div>

            <!-- Description -->
            <div class="card full-width">
              <div class="card-body">
                <h3>Description</h3>
                <p class="description">{{ dispute.description }}</p>

                @if (dispute.resolutionNotes) {
                  <h3 class="mt-2">Resolution Notes</h3>
                  <p class="resolution-notes">{{ dispute.resolutionNotes }}</p>
                }
              </div>
            </div>

            <!-- Timeline -->
            <div class="card full-width">
              <div class="card-body">
                <h3>History</h3>
                <div class="timeline">
                  @for (event of dispute.history; track event.id) {
                    <div class="timeline-item">
                      <div class="timeline-marker"></div>
                      <div class="timeline-content">
                        <div class="timeline-header">
                          <span [class]="'badge badge-sm badge-' + getStatusClass(event.status)">
                            {{ formatStatus(event.status) }}
                          </span>
                          <span class="timeline-date">{{ formatDateTime(event.createdAt) }}</span>
                        </div>
                        @if (event.notes) {
                          <p class="timeline-notes">{{ event.notes }}</p>
                        }
                        @if (event.createdBy) {
                          <span class="timeline-author">By: {{ event.createdBy }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dispute-detail {
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

    .badge-lg {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    h3 {
      margin-bottom: 1.5rem;
      font-size: 1.125rem;
    }

    .mt-2 {
      margin-top: 2rem;
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
      }
    }

    .amount {
      font-family: 'Courier New', monospace;
    }

    .description, .resolution-notes {
      color: #cbd5e1;
      line-height: 1.7;
    }

    .resolution-notes {
      padding: 1rem;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 8px;
      border-left: 3px solid #10b981;
    }

    .timeline {
      position: relative;
      padding-left: 2rem;
    }

    .timeline-item {
      position: relative;
      padding-bottom: 1.5rem;
      
      &:last-child {
        padding-bottom: 0;
      }

      &::before {
        content: '';
        position: absolute;
        left: -1.5rem;
        top: 0.5rem;
        bottom: 0;
        width: 2px;
        background: rgba(71, 85, 105, 0.5);
      }

      &:last-child::before {
        display: none;
      }
    }

    .timeline-marker {
      position: absolute;
      left: -2rem;
      top: 0.25rem;
      width: 12px;
      height: 12px;
      background: #6366f1;
      border-radius: 50%;
      border: 2px solid #0f172a;
    }

    .timeline-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .badge-sm {
      padding: 0.2rem 0.5rem;
      font-size: 0.7rem;
    }

    .timeline-date {
      color: #64748b;
      font-size: 0.75rem;
    }

    .timeline-notes {
      color: #cbd5e1;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .timeline-author {
      color: #64748b;
      font-size: 0.75rem;
    }
  `]
})
export class DisputeDetailComponent implements OnInit {
  dispute: DisputeDetail | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private disputeService: DisputeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDispute(id);
    }
  }

  loadDispute(id: string): void {
    this.disputeService.getDispute(id).subscribe({
      next: (response) => {
        this.dispute = response.data;
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

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ').toLowerCase()
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

