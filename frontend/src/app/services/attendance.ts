import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attendance {
  _id?: string;
  labour: string;
  site: string;
  team?: string;
  attendanceDate: string;
  status: 'Present' | 'Half Day' | 'Absent' | 'Leave';
  dayValue?: number;
  overtimeHours: number;
  overtimeAmount?: number;
  attendanceUnit: 'Individual' | 'Couple Together';
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'https://construction-side-api.onrender.com/api/attendance';

  constructor(private http: HttpClient) {}

  getAttendance(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAttendanceByDate(date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/date/${date}`);
  }

  getSiteAttendance(siteId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/site/${siteId}`);
  }

  createAttendance(data: Attendance): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateAttendance(id: string, data: Partial<Attendance>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteAttendance(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}