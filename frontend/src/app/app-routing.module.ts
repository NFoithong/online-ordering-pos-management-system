import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'menu/list', pathMatch: 'full' },

  // Public Menu Routes
  {
    path: 'menu/list',
    loadComponent: () =>
      import('./features/menu/menu-list/menu-list.page').then(m => m.MenuListPage)
  },
  {
    path: 'menu/detail/:id',
    loadComponent: () =>
      import('./features/menu/menu-detail/menu-detail.page').then(m => m.MenuDetailPage)
  },

  // Admin-only Menu Editor Routes
  {
    path: 'menu/editor',
    loadChildren: () =>
      import('./features/menu/menu-editor/menu-editor.module').then(m => m.MenuEditorPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'menu/editor/:id',
    loadComponent: () =>
      import('./features/menu/menu-editor/menu-editor.page').then(m => m.MenuEditorPage),
    canActivate: [AdminGuard]
  },

  // Admin-only POS Dashboard
  {
    path: 'pos/dashboard',
    loadComponent: () =>
      import('./features/pos/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AdminGuard]
  },

  // Customer-only Cart Routes
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart/cart.module').then(m => m.CartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart/checkout',
    loadComponent: () =>
      import('./features/cart/checkout/checkout.page').then(m => m.CheckoutPage),
    canActivate: [AuthGuard]
  },

  // Customer-only Order History
  {
    path: 'order/history',
    loadChildren: () =>
      import('./features/order/order-history/order-history.module').then(m => m.OrderHistoryPageModule),
    canActivate: [AuthGuard]
  },

  // Fallback route
  // { path: '**', redirectTo: 'menu/list' },
  {
    path: 'pos/dashboard',
    loadChildren: () => import('./features/pos/dashboard/dashboard.module').then( m => m.DashboardPageModule), canActivate: [AdminGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then( m => m.LoginPage)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
