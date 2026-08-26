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
    'https://construction-side-api.onrender.com/api/labour-transfers';

  constructor(
    private http: HttpClient
  ) {}

  getTransfers(): Observable<any> {
    return this.http.get(this.apiUrl);
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

}