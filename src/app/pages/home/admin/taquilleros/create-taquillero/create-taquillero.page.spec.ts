import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTaquilleroPage } from './create-taquillero.page';

describe('CreateTaquilleroPage', () => {
  let component: CreateTaquilleroPage;
  let fixture: ComponentFixture<CreateTaquilleroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaquilleroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
