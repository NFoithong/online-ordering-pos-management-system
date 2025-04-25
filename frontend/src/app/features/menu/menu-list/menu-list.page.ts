import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from '../../../models/menu-item';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { AuthService, User } from '../../../services/auth.service'; // Include User

@Component({
  standalone: true,
  selector: 'app-menu-list',
  templateUrl: './menu-list.page.html',
  imports: [CommonModule, IonicModule, FormsModule]
})
export class MenuListPage implements OnInit {
  items: MenuItem[] = [];
  categories: string[] = [];
  selectedCategory = 'All';
  isLoading = true;
  error?: string;

  cartCount = 0;
  isGridView = false;
  isAdmin = false; // Dynamically determined
  currentUser: User | null = null;
 // For welcome message
  searchQuery = '';

  constructor(
    private menuService: MenuService,
    private nav: NavController,
    private cartService: CartService,
    public auth: AuthService // Public for template access
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin(); // Set isAdmin based on user role
    this.loadData();
    this.updateCartCount();
  }

  onSearchChange(): void {
    this.selectedCategory = 'All';
    this.loadData();
  }

  updateCartCount(): void {
    this.cartCount = this.cartService.getItems().reduce((sum, i) => sum + i.quantity, 0);
  }

  loadData(): void {
    this.isLoading = true;
    const query = this.searchQuery.trim();
    this.menuService.getAll(query).subscribe({
      next: (data) => {
        console.log('API Response:', data);
        if (Array.isArray(data)) {
          this.items = data;
          this.categories = Array.from(new Set(data.map(i => i.category)));
        } else {
          this.error = 'Invalid data format received';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  get filteredItems(): MenuItem[] {
    const categoryFiltered = this.selectedCategory === 'All'
      ? this.items
      : this.items.filter(i => i.category.toLowerCase() === this.selectedCategory.toLowerCase());
    return categoryFiltered;
  }

  addToCart(item: MenuItem): void {
    this.cartService.add(item);
    this.updateCartCount();
  }

  addNew(): void {
    this.nav.navigateForward('/menu/editor');
  }

  edit(item: MenuItem): void {
    (document.activeElement as HTMLElement)?.blur();
    this.nav.navigateForward(`/menu/editor/${item.id}`);
  }

  openDetail(item: MenuItem): void {
    (document.activeElement as HTMLElement)?.blur();
    this.nav.navigateForward(`/menu/detail/${item.id}`);
  }

  doRefresh(event: any): void {
    this.loadData();
    event.target.complete();
  }

  goToCart(): void {
    this.nav.navigateForward('/cart');
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  goToOrders(): void {
    this.nav.navigateForward('/order/history');
  }

  goToDashboard(): void {
    this.nav.navigateForward('/pos/dashboard');
  }  

  logout(): void {
    this.auth.logout();
  }
}
