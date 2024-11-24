import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBusPage } from './create-bus.page';

describe('CreateBusPage', () => {
  let component: CreateBusPage;
  let fixture: ComponentFixture<CreateBusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
