import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDriverPage } from './create-driver.page';

describe('CreateDriverPage', () => {
  let component: CreateDriverPage;
  let fixture: ComponentFixture<CreateDriverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
