import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportServiceService {

  
  constructor(private http: HttpClient) { }

  private baseUrl: string = environment.apiUrl;

  exportPDF(purchaseOrderId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export?purchaseOrderId=${purchaseOrderId}`, { responseType: 'blob' });
  }
}
