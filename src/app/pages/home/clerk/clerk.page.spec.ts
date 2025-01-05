import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClerkPage } from './clerk.page';

describe('ClerkPage', () => {
  let component: ClerkPage;
  let fixture: ComponentFixture<ClerkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClerkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
