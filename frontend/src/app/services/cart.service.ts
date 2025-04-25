import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu-item';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  [x: string]: any;
  private items: CartItem[] = [];

  add(item: MenuItem): void {
    const existing = this.items.find(i => i.item.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ item, quantity: 1 });
    }
  }

  updateQuantity(itemId: string, quantity: number): void {
    const cartItem = this.items.find(i => i.item.id === itemId);
    if (cartItem && quantity > 0) {
      cartItem.quantity = quantity;
    } else if (cartItem && quantity === 0) {
      this.remove(itemId);
    }
  }

  remove(itemId: string): void {
    this.items = this.items.filter(i => i.item.id !== itemId);
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  }

  clear(): void {
    this.items = [];
  }
}