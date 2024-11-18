import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCooperativasPage } from './admin-cooperativas.page';

describe('AdminCooperativasPage', () => {
  let component: AdminCooperativasPage;
  let fixture: ComponentFixture<AdminCooperativasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCooperativasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
