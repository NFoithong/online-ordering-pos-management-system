import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../../services/cart.service';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ CommonModule, IonicModule],
  selector: 'app-cart',
  templateUrl: './cart.page.html',
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private nav: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    this.recalculateTotal(); // 🔥 Use this instead of directly setting total
  }

  // updateQuantity(itemId: string, event: any) {
  //   const rawValue = event?.detail?.value;
  //   const qty = parseInt(rawValue, 10) || 1; // fallback to 1 if invalid

  //   this.cartService.updateQuantity(itemId, qty);
  //   this.loadCart();
  // }

  recalculateTotal(): void {
    this.total = this.cartItems.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  }  

  updateQuantity(itemId: string, event: any): void {
    const rawValue = event?.detail?.value;
    const qty = parseInt(rawValue, 10) || 1; // Fallback to 1 if invalid
  
    this.cartService.updateQuantity(itemId, qty);
    this.recalculateTotal(); // 🔥 Call this instead of loadCart
  }  

  async removeItem(itemId: string) {
    this.cartService.remove(itemId);
    this.loadCart();
    await this.presentToast('Item removed from cart', 'danger');
  }

  checkout() {
    this.nav.navigateForward('/cart/checkout');
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}