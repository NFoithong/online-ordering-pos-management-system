import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MenuEditorPageRoutingModule } from './menu-editor-routing.module';
import { MenuEditorPage } from './menu-editor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,    // ← add
    IonicModule,
    MenuEditorPageRoutingModule,
    MenuEditorPage
  ],
  // no declarations, since it's a standalone page
})
export class MenuEditorPageModule {}
