import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCooperativaPage } from './create-cooperativa.page';

describe('CreateCooperativaPage', () => {
  let component: CreateCooperativaPage;
  let fixture: ComponentFixture<CreateCooperativaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCooperativaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
