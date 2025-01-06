import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTravelsPage } from './create-travels.page';

describe('CreateTravelsPage', () => {
  let component: CreateTravelsPage;
  let fixture: ComponentFixture<CreateTravelsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTravelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
