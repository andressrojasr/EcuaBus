import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusMapPage } from './bus-map.page';

describe('BusMapPage', () => {
  let component: BusMapPage;
  let fixture: ComponentFixture<BusMapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
