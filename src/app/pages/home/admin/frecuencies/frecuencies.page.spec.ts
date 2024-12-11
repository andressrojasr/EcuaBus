import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrecuenciesPage } from './frecuencies.page';

describe('FrecuenciesPage', () => {
  let component: FrecuenciesPage;
  let fixture: ComponentFixture<FrecuenciesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FrecuenciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
