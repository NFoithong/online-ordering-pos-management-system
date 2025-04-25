import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private zone: NgZone) {}

  getOrderStream(): Observable<Order> {
    return new Observable<Order>(observer => {
      const eventSource = new EventSource('http://localhost:3000/orders/stream');

      eventSource.onmessage = (event) => {
        const order: Order = JSON.parse(event.data);
        this.zone.run(() => observer.next(order));  // Run in Angular zone
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
        observer.error(error);
      };

      return () => eventSource.close();
    });
  }
}
