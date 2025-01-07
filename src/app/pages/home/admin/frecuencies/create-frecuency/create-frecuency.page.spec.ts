import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateFrecuencyPage } from './create-frecuency.page';

describe('CreateFrecuencyPage', () => {
  let component: CreateFrecuencyPage;
  let fixture: ComponentFixture<CreateFrecuencyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFrecuencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
