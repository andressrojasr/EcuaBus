import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateClerkPage } from './create-clerk.page';

describe('CreateClerkPage', () => {
  let component: CreateClerkPage;
  let fixture: ComponentFixture<CreateClerkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClerkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
