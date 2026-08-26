import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabourStatementSite {
  _id: string;
  siteName: string;
  location?: string;
}

export interface LabourStatementLabour {
  _id: string;
  name: string;
  mobile?: string;
  labourType?: string;
  memberCount?: number;
  dailyRate?: number;
  overtimeRate?: number;
  paymentType?: string;
  status?: string;
  joiningDate?: string;
  currentSite?: LabourStatementSite | null;
}

export interface LabourStatementAttendance {
  _id: string;
  date: string;
  status: 'Present' | 'Half Day' | 'Absent' | 'Leave';
  dayValue: number;
  dailyRate: number;
  dayAmount: number;
  overtimeHours: number;
  overtimeAmount: number;
  totalAmount: number;
  site?: LabourStatementSite | null;
  team?: {
    _id: string;
    teamName: string;
  } | null;
  attendanceUnit?: 'Individual' | 'Couple Together';
  notes?: string;
}

export interface LabourStatementAdvance {
  _id: string;
  date: string;
  amount: number;
  paymentMode?: string;
  referenceNumber?: string;
  reason?: string;
  notes?: string;
  status?: 'Paid' | 'Pending' | 'Cancelled';
  site?: LabourStatementSite | null;
}

export interface LabourStatementSummary {
  totalAttendanceDays: number;
  presentDays: number;
  halfDays: number;
  absentDays: number;
  leaveDays: number;

  regularEarning: number;

  overtimeHours: number;
  overtimeAmount: number;

  totalEarning: number;
  totalAdvance: number;
  balance: number;
}

export interface LabourStatementData {
  labour: LabourStatementLabour;

  summary: LabourStatementSummary;

  attendance: LabourStatementAttendance[];

  advances: LabourStatementAdvance[];
}

export interface LabourStatementResponse {
  success: boolean;
  message?: string;
  data: LabourStatementData;
}

export interface LabourSearchResponse {
  success: boolean;
  count?: number;
  data: LabourStatementLabour[];
}

@Injectable({
  providedIn: 'root'
})
export class LabourStatementService {

  private apiUrl =
    'http://localhost:5001/api/labour-statements';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================================
  // SEARCH LABOUR
  // ==========================================

  searchLabour(
    search: string
  ): Observable<LabourSearchResponse> {

    const params = new HttpParams()
      .set('search', search);

    return this.http.get<LabourSearchResponse>(
      `${this.apiUrl}/search`,
      { params }
    );
  }

  // ==========================================
  // GET COMPLETE STATEMENT
  // ==========================================

  getLabourStatement(
    labourId: string,
    fromDate?: string,
    toDate?: string
  ): Observable<LabourStatementResponse> {

    let params = new HttpParams();

    if (fromDate) {
      params = params.set(
        'fromDate',
        fromDate
      );
    }

    if (toDate) {
      params = params.set(
        'toDate',
        toDate
      );
    }

    return this.http.get<LabourStatementResponse>(
      `${this.apiUrl}/${labourId}`,
      { params }
    );
  }

  // ==========================================
  // GET SUMMARY
  // ==========================================

  getLabourStatementSummary(
    labourId: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${labourId}/summary`
    );
  }
}