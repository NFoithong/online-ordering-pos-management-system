import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuEditorPage } from './menu-editor.page';

const routes: Routes = [
  {
    path: '',
    component: MenuEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuEditorPageRoutingModule {}
