import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ======================================================
// LABOUR SITE
// ======================================================

export interface LabourSite {
  _id: string;
  siteName: string;
  location?: string;
}

// ======================================================
// LABOUR MEMBER
// ======================================================

export interface LabourMember {
  _id?: string;

  name: string;

  mobile?: string;

  role:
    | 'Mistri'
    | 'Plaster Labour'
    | 'Helper'
    | 'Ladies Helper'
    | 'Other';
}

// ======================================================
// LABOUR TYPE
// ======================================================

export type LabourType =
  | 'Mistri'
  | 'Plaster Labour'
  | 'Helper'
  | 'Ladies Helper'
  | 'Couple / Jodi'
  | 'Other';

// ======================================================
// PAYMENT TYPE
// ======================================================

export type LabourPaymentType =
  | 'Daily'
  | 'Monthly'
  | 'Piece Rate';

// ======================================================
// STATUS
// ======================================================

export type LabourStatus =
  | 'Active'
  | 'Inactive';

// ======================================================
// LABOUR
// ======================================================

export interface Labour {

  _id?: string;

  name: string;

  mobile?: string;

  labourType: LabourType;

  memberCount: number;

  members?: LabourMember[];

  dailyRate: number;

  overtimeRate: number;

  paymentType: LabourPaymentType;

  currentSite?:
    | string
    | LabourSite
    | null;

  status: LabourStatus;

  joiningDate?: string;

  notes?: string;

  createdAt?: string;

  updatedAt?: string;
}

// ======================================================
// API RESPONSE
// ======================================================

export interface LabourResponse {

  success: boolean;

  message?: string;

  count?: number;

  data: Labour[];

}

// ======================================================
// SINGLE LABOUR RESPONSE
// ======================================================

export interface SingleLabourResponse {

  success: boolean;

  message?: string;

  data: Labour;

}

// ======================================================
// DELETE RESPONSE
// ======================================================

export interface DeleteLabourResponse {

  success: boolean;

  message: string;

}

// ======================================================
// SERVICE
// ======================================================

@Injectable({
  providedIn: 'root'
})
export class LabourService {

  // ====================================================
  // API URL
  // ====================================================

  private apiUrl =
    'https://construction-side-api.onrender.com/api/labours';

  // ====================================================
  // CONSTRUCTOR
  // ====================================================

  constructor(
    private http: HttpClient
  ) {}

  // ====================================================
  // GET ALL LABOURS
  // ====================================================

  getLabours():
    Observable<LabourResponse> {

    return this.http.get<LabourResponse>(
      this.apiUrl
    );

  }

  // ====================================================
  // GET SINGLE LABOUR
  // ====================================================

  getLabour(
    id: string
  ):
    Observable<SingleLabourResponse> {

    return this.http.get<SingleLabourResponse>(
      `${this.apiUrl}/${id}`
    );

  }

  // ====================================================
  // CREATE LABOUR
  // ====================================================

  createLabour(
    labour: Labour
  ):
    Observable<SingleLabourResponse> {

    return this.http.post<SingleLabourResponse>(
      this.apiUrl,
      labour
    );

  }

  // ====================================================
  // UPDATE LABOUR
  // ====================================================

  updateLabour(
    id: string,
    labour: Partial<Labour>
  ):
    Observable<SingleLabourResponse> {

    return this.http.put<SingleLabourResponse>(
      `${this.apiUrl}/${id}`,
      labour
    );

  }

  // ====================================================
  // DELETE LABOUR
  // ====================================================

  deleteLabour(
    id: string
  ):
    Observable<DeleteLabourResponse> {

    return this.http.delete<DeleteLabourResponse>(
      `${this.apiUrl}/${id}`
    );

  }

}