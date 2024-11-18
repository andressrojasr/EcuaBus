import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAdminCooperativasPage } from './create-admin-cooperativas.page';

describe('CreateAdminCooperativasPage', () => {
  let component: CreateAdminCooperativasPage;
  let fixture: ComponentFixture<CreateAdminCooperativasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdminCooperativasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
