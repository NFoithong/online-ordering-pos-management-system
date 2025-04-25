import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../../services/order.service';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  imports: [CommonModule, IonicModule]
})
export class OrderHistoryPage implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  error?: string;

  constructor(
    private orderService: OrderService,
    private nav: NavController,
    private toast: ToastController
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load orders';
        this.isLoading = false;
      }
    });
  }

  async reorder(order: Order): Promise<void> {
    await this.orderService.reorder(order).toPromise();
    const toast = await this.toast.create({
      message: 'Items added to cart!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
    this.nav.navigateForward('/cart');
  }
}
