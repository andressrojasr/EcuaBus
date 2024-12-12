import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CooperativePage } from './cooperative.page';

describe('CooperativePage', () => {
  let component: CooperativePage;
  let fixture: ComponentFixture<CooperativePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperativePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
