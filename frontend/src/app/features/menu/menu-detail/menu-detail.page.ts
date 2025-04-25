import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from '../../../models/menu-item';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular'; // toast notifications to the delete flow in your MenuDetailPage for success/error feedback
import { AlertController } from '@ionic/angular'; // <-- Add this
import { ViewWillEnter } from '@ionic/angular'; // Subscribe to Ionic lifecycle hook


@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.page.html'
})
export class MenuDetailPage implements OnInit, ViewWillEnter  {
  item?: MenuItem;
  isLoading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private nav: NavController, // <-- Inject NavController here
    private toastController: ToastController, // <-- Inject here
    private alertController: AlertController // <-- Inject here
  ) {}

  ionViewWillEnter(): void {
    this.loadItem(); // <-- Refresh data every time page is entered
  }

  ngOnInit(): void {
    this.loadItem(); // Reuse this
  }

  private loadItem(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.menuService.getById(id).subscribe({
        next: (data) => {
          this.item = data; // <-- Re-assign the updated item
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load item';
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'Invalid item ID';
      this.isLoading = false;
    }
  }
  

  // ngOnInit(): void {

  //   this.loadItem(); // Reuse this

  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id) {
  //     this.menuService.getById(id).subscribe({
  //       next: (data) => {
  //         this.item = data;
  //         this.isLoading = false;
  //       },
  //       error: (err) => {
  //         this.error = 'Failed to load item';
  //         console.error(err);
  //         this.isLoading = false;
  //       }
  //     });
  //   } else {
  //     this.error = 'Invalid item ID';
  //     this.isLoading = false;
  //   }
  // }
  
  edit(): void {
    if (this.item) {
      this.nav.navigateForward(`/menu/editor/${this.item.id}`);
    }
  }

  // Add a helper method for toasts
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }  

  // confirmDelete(): void {
  //   if (this.item && confirm('Are you sure you want to delete this item?')) {
  //     this.menuService.delete(this.item.id).subscribe({
  //       next: () => {
  //         this.presentToast('Item deleted successfully!');
  //         this.nav.navigateBack('/menu');
  //       },
  //       error: () => {
  //         this.presentToast('Failed to delete item', 'danger');
  //       }
  //     });
  //   }

  async confirmDelete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteItem()
        }
      ]
    });
    await alert.present();
  }
  
  private deleteItem(): void {
    if (this.item) {
      this.menuService.delete(this.item.id).subscribe({
        next: () => {
          this.presentToast('Item deleted successfully!');
          this.nav.navigateBack('/menu');
        },
        error: () => {
          this.presentToast('Failed to delete item', 'danger');
        }
      });
    }
  

  // ngOnInit(): void {
  //   const name = this.route.snapshot.paramMap.get('name');
  //   console.log('Item Name from Route:', name); // Debug log
  
  //   if (name) {
  //     this.menuService.getByName(name).subscribe({
  //       next: (data) => {
  //         this.item = data;
  //         this.isLoading = false;
  //       },
  //       error: (err) => {
  //         this.error = 'Failed to load item from Spoonacular';
  //         console.error(err);
  //         this.isLoading = false;
  //       }
  //     });
  //   } else {
  //     this.error = 'Invalid item name';
  //     this.isLoading = false;
  //   }
  // }
  }
}
