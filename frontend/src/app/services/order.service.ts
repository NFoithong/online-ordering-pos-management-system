import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: string;
  items: any[];
  total: number;
  createdAt: string;
  paymentIntentId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = '/api/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  reorder(order: Order): Observable<any> {
    return this.http.post('/api/cart/reorder', { items: order.items });
  }
  
}
