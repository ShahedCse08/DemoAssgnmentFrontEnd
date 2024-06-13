import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownItem } from '../../interfaces/utility/dropdown';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl;

  getAutocompleteSuggestions(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/autocompletes/products/${keyword}`);
  }

  getLineItems(keyword: string): Observable<DropdownItem<number>[]> {
    if (keyword) {
      return this.http.get<DropdownItem<number>[]>(`${this.baseUrl}/autocompletes/products/${keyword}`);
    }else{
      return this.http.get<DropdownItem<number>[]>(`${this.baseUrl}/dropdowns/products`);
    }
  }

}
