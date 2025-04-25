import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CartService, CartItem } from '../../../services/cart.service';
import { NavController, ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CheckoutPage implements OnInit, AfterViewInit, AfterViewChecked {
  cartItems: CartItem[] = [];
  total = 0;
  address = '';

  stripe?: Stripe | null;
  elements?: StripeElements;
  card?: StripeCardElement;
  clientSecret = ''; 
  mounted = false;

  constructor(
    private cartService: CartService,
    private nav: NavController,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadCart();
    await this.getClientSecret();
  }

  ngAfterViewInit(): void {}

  async ngAfterViewChecked(): Promise<void> {
    if (this.clientSecret && !this.mounted) {
      await this.setupStripeElements();
    }
  }

  loadCart(): void {
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    if (this.cartItems.length === 0) {
      this.presentToast('Your cart is empty.', 'warning');
      this.nav.navigateBack('/menu');
    }
  }

  async getClientSecret(): Promise<void> {
    const response = await this.http.post<{ clientSecret: string }>('/api/checkout', {
      items: this.cartItems
    }).toPromise();
    this.clientSecret = response?.clientSecret || '';
  }

  async setupStripeElements(): Promise<void> {
    this.stripe = await loadStripe(environment.stripePublicKey);
    if (this.stripe) {
      this.elements = this.stripe.elements();
      const cardElement = this.elements.create('card');
      cardElement.mount('#card-element');
      this.card = cardElement;
      this.mounted = true;
    }
  }

  async confirmPayment(): Promise<void> {
    if (!this.stripe || !this.card || !this.clientSecret) return;
    const { paymentIntent, error } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: { card: this.card }
    });
    if (error) {
      this.presentToast(error.message || 'Payment failed', 'danger');
    } else if (paymentIntent?.status === 'succeeded') {
      this.presentToast('Payment successful!', 'success');
      this.cartService.clear();
      this.nav.navigateBack('/menu');
    }
  }

  async presentToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.presentToast('Geolocation not supported', 'danger');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => this.reverseGeocode(position.coords.latitude, position.coords.longitude),
      (error) => {
        console.error('Geolocation error:', error);
        this.presentToast('Unable to retrieve location', 'danger');
      }
    );
  }

  reverseGeocode(lat: number, lon: number): void {
    this.http.get<{ display_name: string }>('/api/location/reverse-geocode', {
      params: { lat, lon }
    }).subscribe({
      next: (res) => {
        this.address = res.display_name;
        this.presentToast('Address autofilled from location.');
      },
      error: (err) => {
        console.error('Reverse geocoding failed:', err);
        this.presentToast('Failed to get address from location', 'danger');
      }
    });
  }
}
