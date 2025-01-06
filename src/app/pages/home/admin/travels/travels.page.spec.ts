import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelsPage } from './travels.page';

describe('TravelsPage', () => {
  let component: TravelsPage;
  let fixture: ComponentFixture<TravelsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
