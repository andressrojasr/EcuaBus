import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePartnerPage } from './create-partner.page';

describe('CreatePartnerPage', () => {
  let component: CreatePartnerPage;
  let fixture: ComponentFixture<CreatePartnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
