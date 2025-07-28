import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiKey = environment.apiKey;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    const headers = new HttpHeaders({
      'GROCY-API-KEY': this.apiKey
    });
    return this.http.get<any[]>(`${this.apiUrl}/objects/products`, { headers });
  }

  getProductStockById(productId: number): Observable<any> {
    const headers = new HttpHeaders({
      'GROCY-API-KEY': this.apiKey
    });
    return this.http.get<any>(`${this.apiUrl}/stock/products/${productId}`, { headers });
  }

  addProductById(productId: number, amount: number = 1): Observable<any> {
    const headers = new HttpHeaders({
      'GROCY-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });
    const body = {
      amount: amount,
      transaction_type: 'purchase'
    };
    return this.http.post<any>(`${this.apiUrl}/stock/products/${productId}/add`, body, { headers });
  }

  consumeProductById(productId: number, amount: number = 1): Observable<any> {
    const headers = new HttpHeaders({
      'GROCY-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });
    const body = {
      amount: amount,
      transaction_type: 'consume'
    };
    return this.http.post<any>(`${this.apiUrl}/stock/products/${productId}/consume`, body, { headers });
  }

  getAllLocations(): Observable<any[]> {
    const headers = new HttpHeaders({
      'GROCY-API-KEY': this.apiKey
    });
    return this.http.get<any[]>(`${this.apiUrl}/objects/locations`, { headers });
  }

  getAllProductGroups(): Observable<any[]> {
    const headers = new HttpHeaders({
      'GROCY-API-KEY': this.apiKey
    });
    return this.http.get<any[]>(`${this.apiUrl}/objects/product_groups`, { headers });   }

  openProductById(productId: number, amount: number = 1): Observable<any> {
    const headers = new HttpHeaders({
      'GROCY-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });
    const body = {
      amount: amount
    };
    return this.http.post<any>(`${this.apiUrl}/stock/products/${productId}/open`, body, { headers });   }
}