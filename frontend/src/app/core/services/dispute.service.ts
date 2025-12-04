import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pagination } from './transaction.service';

export interface Dispute {
  id: string;
  transactionId: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  transaction: {
    id: string;
    amount: number;
    merchant: string;
    category: string;
    date: string;
  };
}

export interface DisputeEvent {
  id: string;
  status: string;
  notes?: string;
  createdAt: string;
  createdBy?: string;
}

export interface DisputeDetail extends Dispute {
  history: DisputeEvent[];
}

export interface DisputeListResponse {
  success: boolean;
  data: {
    disputes: Dispute[];
    pagination: Pagination;
  };
}

export interface DisputeDetailResponse {
  success: boolean;
  data: DisputeDetail;
}

export interface DisputeSummary {
  totalDisputes: number;
  openDisputes: number;
  underReviewDisputes: number;
  resolvedDisputes: number;
  totalDisputedAmount: number;
  disputesByReason: { [key: string]: number };
  disputesByStatus: { [key: string]: number };
}

export interface DisputeSummaryResponse {
  success: boolean;
  data: DisputeSummary;
}

export interface CreateDisputeRequest {
  transactionId: string;
  reason: string;
  description: string;
}

export interface DisputeQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  reason?: string;
  sortBy?: string;
  sortOrder?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DisputeService {
  private readonly API_URL = `${environment.apiUrl}/disputes`;

  constructor(private http: HttpClient) {}

  getDisputes(params: DisputeQueryParams = {}): Observable<DisputeListResponse> {
    let httpParams = new HttpParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<DisputeListResponse>(this.API_URL, { params: httpParams });
  }

  getDispute(id: string): Observable<DisputeDetailResponse> {
    return this.http.get<DisputeDetailResponse>(`${this.API_URL}/${id}`);
  }

  getSummary(): Observable<DisputeSummaryResponse> {
    return this.http.get<DisputeSummaryResponse>(`${this.API_URL}/summary`);
  }

  createDispute(request: CreateDisputeRequest): Observable<{ success: boolean; data: Dispute }> {
    return this.http.post<{ success: boolean; data: Dispute }>(this.API_URL, request);
  }

  getHistory(id: string): Observable<{ success: boolean; data: DisputeEvent[] }> {
    return this.http.get<{ success: boolean; data: DisputeEvent[] }>(`${this.API_URL}/${id}/history`);
  }
}

