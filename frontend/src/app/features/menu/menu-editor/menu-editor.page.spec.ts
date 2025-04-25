import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuEditorPage } from './menu-editor.page';

describe('MenuEditorPage', () => {
  let component: MenuEditorPage;
  let fixture: ComponentFixture<MenuEditorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
