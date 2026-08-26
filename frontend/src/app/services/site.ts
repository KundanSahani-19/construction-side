import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Site {
  _id?: string;
  siteName: string;
  clientName: string;
  clientMobile?: string;
  location: string;
  workType?: string;
  contractAmount: number;
  startDate?: string;
  expectedCompletionDate?: string;
  receivedAmount: number;
  status: 'Running' | 'Completed' | 'On Hold';
  notes?: string;
  pendingAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private apiUrl = 'http://localhost:5001/api/sites';

  constructor(private http: HttpClient) {}

  getSites(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getSite(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createSite(site: Site): Observable<any> {
    return this.http.post(this.apiUrl, site);
  }

  updateSite(id: string, site: Partial<Site>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, site);
  }

  deleteSite(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}