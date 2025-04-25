import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from '../../../models/menu-item';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-menu-editor',
  templateUrl: './menu-editor.page.html',
})
export class MenuEditorPage implements OnInit {
  form!: FormGroup;
  isEdit = false;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private nav: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: [''],
      available: [true]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.menuService.getById(id).subscribe(item => {
        this.form.patchValue(item);
        this.previewUrl = item.imageUrl || null;
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.form.patchValue({ imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
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

  async submit() {
    if (this.form.invalid) return;
    const data: MenuItem = this.form.value;

    if (this.isEdit) {
      await this.menuService.update(data).toPromise();
      await this.presentToast('Item updated successfully!');
    } else {
      const { id, ...rest } = data;
      await this.menuService.create(rest as Omit<MenuItem, 'id'>).toPromise();
      await this.presentToast('Item created successfully!');
    }

    this.nav.navigateBack('/menu');
  }

  async delete() {
    if (!this.isEdit) return;
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            const id = this.form.value.id;
            await this.menuService.delete(id).toPromise();
            await this.presentToast('Item deleted successfully!');
            this.nav.navigateBack('/menu');
          }
        }
      ]
    });
    await alert.present();
  }
}
