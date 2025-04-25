import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [CommonModule, IonicModule, FormsModule]
})
export class LoginPage {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async login() {
    this.auth.login(this.username, this.password).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({ message: 'Login successful!', duration: 2000, color: 'success' });
        await toast.present();
        this.router.navigate(['/menu/list']);
      },
      error: async () => {
        const toast = await this.toastCtrl.create({ message: 'Invalid credentials', duration: 2000, color: 'danger' });
        await toast.present();
      }
    });
    
  }
}
