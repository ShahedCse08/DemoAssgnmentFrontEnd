import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownItem } from '../../interfaces/utility/dropdown';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl;

  getSuppliersDropdown(): Observable<DropdownItem<number>[]> {
    return this.http.get<DropdownItem<number>[]>(`${this.baseUrl}/dropdowns/suppliers`);
  }

}
