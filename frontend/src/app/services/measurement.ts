import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MeasurementSite {
  _id: string;
  siteName: string;
  location?: string;
}

export type MeasurementWorkType =
  | 'Plaster'
  | 'Brick Work'
  | 'Concrete'
  | 'Flooring'
  | 'Painting'
  | 'Tiles'
  | 'Shuttering'
  | 'Excavation'
  | 'Other';

export type MeasurementUnit =
  | 'sq.ft'
  | 'sq.m'
  | 'cu.ft'
  | 'cu.m'
  | 'running.ft'
  | 'piece';

export type MeasurementStatus =
  | 'Pending'
  | 'Calculated'
  | 'Completed';

export interface Measurement {
  _id?: string;

  site: string | MeasurementSite;

  workType: MeasurementWorkType;

  measurementDate: string;

  length: number;
  width: number;
  height: number;

  unit: MeasurementUnit;

  quantity: number;

  rate: number;

  totalAmount: number;

  status?: MeasurementStatus;

  photoUrl?: string;

  aiAnalysis?: string;

  notes?: string;

  createdAt?: string;

  updatedAt?: string;
}

export interface MeasurementResponse {
  success: boolean;
  message?: string;
  count?: number;
  data: Measurement[];
}

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {

  private apiUrl =
    'http://localhost:5001/api/measurements';

  constructor(
    private http: HttpClient
  ) {}

  getMeasurements(): Observable<MeasurementResponse> {
    return this.http.get<MeasurementResponse>(
      this.apiUrl
    );
  }

  getMeasurement(
    id: string
  ): Observable<{
    success: boolean;
    data: Measurement;
  }> {

    return this.http.get<{
      success: boolean;
      data: Measurement;
    }>(
      `${this.apiUrl}/${id}`
    );
  }

  getSiteMeasurements(
    siteId: string
  ): Observable<MeasurementResponse> {

    return this.http.get<MeasurementResponse>(
      `${this.apiUrl}/site/${siteId}`
    );
  }

  createMeasurement(
    measurement: Measurement
  ): Observable<{
    success: boolean;
    message: string;
    data: Measurement;
  }> {

    return this.http.post<{
      success: boolean;
      message: string;
      data: Measurement;
    }>(
      this.apiUrl,
      measurement
    );
  }

  updateMeasurement(
    id: string,
    measurement: Partial<Measurement>
  ): Observable<{
    success: boolean;
    message: string;
    data: Measurement;
  }> {

    return this.http.put<{
      success: boolean;
      message: string;
      data: Measurement;
    }>(
      `${this.apiUrl}/${id}`,
      measurement
    );
  }

  deleteMeasurement(
    id: string
  ): Observable<{
    success: boolean;
    message: string;
  }> {

    return this.http.delete<{
      success: boolean;
      message: string;
    }>(
      `${this.apiUrl}/${id}`
    );
  }
}