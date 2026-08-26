import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  _id?: string;

  // Labour payment ke liye optional
  labour?: string | null;

  // Construction site
  site: string;

  // Amount
  amount: number;

  // Payment date
  paymentDate: string;

  // Payment type
  paymentType?:
    | 'Advance'
    | 'Salary'
    | 'Wages'
    | 'Overtime'
    | 'Final Payment'
    | 'Other';

  // Payment reason
  reason?: string;

  // Payment mode
  paymentMode:
    | 'Cash'
    | 'Bank Transfer'
    | 'UPI'
    | 'Cheque'
    | 'Other';

  // Transaction / cheque number
  referenceNumber?: string;

  // Extra notes
  notes?: string;

  // Backend populated data ke liye
  labourData?: any;

  siteData?: any;

  createdAt?: string;

  updatedAt?: string;
}


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl =
    'https://construction-side-api.onrender.com/api/payments';


  constructor(
    private http: HttpClient
  ) {}


  // =========================
  // GET ALL PAYMENTS
  // =========================

  getPayments(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }


  // =========================
  // GET SITE PAYMENTS
  // =========================

  getSitePayments(
    siteId: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/site/${siteId}`
    );

  }


  // =========================
  // GET LABOUR PAYMENTS
  // =========================

  getLabourPayments(
    labourId: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/labour/${labourId}`
    );

  }


  // =========================
  // CREATE PAYMENT
  // =========================

  createPayment(
    payment: Payment
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      payment
    );

  }


  // =========================
  // DELETE PAYMENT
  // =========================

  deletePayment(
    paymentId: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${paymentId}`
    );

  }

}