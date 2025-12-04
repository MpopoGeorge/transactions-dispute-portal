import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  description?: string;
  date: string;
  status: string;
  createdAt: string;
  hasDispute: boolean;
  disputeId?: string;
}

export interface TransactionDetail extends Transaction {
  dispute?: {
    id: string;
    reason: string;
    status: string;
    createdAt: string;
  };
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TransactionListResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: Pagination;
  };
}

export interface TransactionDetailResponse {
  success: boolean;
  data: TransactionDetail;
}

export interface TransactionSummary {
  totalTransactions: number;
  totalAmount: number;
  disputedTransactions: number;
  disputedAmount: number;
  transactionsByCategory: { [key: string]: number };
  transactionsByStatus: { [key: string]: number };
}

export interface TransactionSummaryResponse {
  success: boolean;
  data: TransactionSummary;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(params: TransactionQueryParams = {}): Observable<TransactionListResponse> {
    let httpParams = new HttpParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<TransactionListResponse>(this.API_URL, { params: httpParams });
  }

  getTransaction(id: string): Observable<TransactionDetailResponse> {
    return this.http.get<TransactionDetailResponse>(`${this.API_URL}/${id}`);
  }

  getSummary(): Observable<TransactionSummaryResponse> {
    return this.http.get<TransactionSummaryResponse>(`${this.API_URL}/summary`);
  }
}

