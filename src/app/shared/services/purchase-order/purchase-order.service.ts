import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PurchaseOrderForEditDto, PurchaseOrderWithDetailsCreationDto, PurchaseOrderWithDetailsUpdateDto } from '../../interfaces/purchase-order/purchase-order';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl;

  getPurchaseOrderList(pageIndex: number, pageSize: number, searchQuery: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    if (searchQuery) {
      params = params.set('searchTerm', searchQuery);
    }

    return this.http.get<any>(`${this.baseUrl}/purchaseorders`, { observe: 'response', params })
      .pipe(
        map((response: HttpResponse<any>) => {
          console.log(response);
          const paginationHeader = response.headers.get('X-Pagination');
          let pagination = null;
          if (paginationHeader) {
            pagination = JSON.parse(paginationHeader);
          }
          return {
            data: response.body,
            pagination: pagination
          };
        })
      );
  }

  deletePurchaseOrder(purchaseOrderId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/purchaseorders/${purchaseOrderId}`);
  }

  createPurchaseOrder(purchaseOrderWithDetails: PurchaseOrderWithDetailsCreationDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/purchaseorders`, purchaseOrderWithDetails);
  }
  

  getPurchaseOrderByPurchaseId(purchaseOrderId: number): Observable<PurchaseOrderForEditDto> {
    return this.http.get<PurchaseOrderForEditDto>(`${this.baseUrl}/purchaseorders/${purchaseOrderId}`);
  }

  updatePurchaseOrder(purchaseOrderId: number, purchaseOrderWithDetails: PurchaseOrderWithDetailsUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/purchaseorders/${purchaseOrderId}`, purchaseOrderWithDetails);
  }
}
