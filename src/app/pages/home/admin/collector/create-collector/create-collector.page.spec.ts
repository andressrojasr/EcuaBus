import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCollectorPage } from './create-collector.page';

describe('CreateCollectorPage', () => {
  let component: CreateCollectorPage;
  let fixture: ComponentFixture<CreateCollectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
