import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CooperativasPage } from './cooperativas.page';

describe('CooperativasPage', () => {
  let component: CooperativasPage;
  let fixture: ComponentFixture<CooperativasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperativasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
