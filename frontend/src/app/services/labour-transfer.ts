import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabourTransfer {
  _id?: string;
  labour: string;
  fromSite: string;
  toSite: string;
  transferDate: string;
  reason?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabourTransferService {

  private apiUrl =
    'http://localhost:5001/api/labour-transfers';

  constructor(
    private http: HttpClient
  ) {}

  getTransfers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTransfer(id: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }

  getLabourTransfers(
    labourId: string
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/labour/${labourId}`
    );
  }

  createTransfer(
    transfer: LabourTransfer
  ): Observable<any> {
    return this.http.post(
      this.apiUrl,
      transfer
    );
  }

  updateTransfer(
    id: string,
    transfer: Partial<LabourTransfer>
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      transfer
    );
  }

  deleteTransfer(
    id: string
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}