import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorsPage } from './errors.page';

describe('ErrorsPage', () => {
  let component: ErrorsPage;
  let fixture: ComponentFixture<ErrorsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
