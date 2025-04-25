import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// import { Order } from '../../../models/order';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {
  orders: Order[] = [];
  isLoading = true;
  eventSource?: EventSource;
  private orderSub?: Subscription;


  constructor(private http: HttpClient, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.orderSub = this.dashboardService.getOrderStream().subscribe({
      next: (order) => {
        console.log('New Order:', order);
        this.orders.unshift(order);  // Add new orders to the top
      },
      error: (err) => console.error('Stream error:', err)
    });
    this.loadInitialOrders();
    this.subscribeToOrderStream();
  }

  loadInitialOrders(): void {
    this.http.get<Order[]>(`${environment.apiUrl}/orders`).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  subscribeToOrderStream(): void {
    this.eventSource = new EventSource(`${environment.apiUrl}/orders/stream`);
    this.eventSource.onmessage = (event) => {
      const newOrder: Order = JSON.parse(event.data);
      this.orders.unshift(newOrder); // Add new orders at the top
    };
  }

  markAsCompleted(order: Order): void {
    this.http.put(`${environment.apiUrl}/orders/${order.id}`, { status: 'Completed' }).subscribe(() => {
      order.status = 'Completed';
    });
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }
}
