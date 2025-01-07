import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectorPage } from './collector.page';

describe('CollectorPage', () => {
  let component: CollectorPage;
  let fixture: ComponentFixture<CollectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
