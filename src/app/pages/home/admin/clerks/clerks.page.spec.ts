import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClerksPage } from './clerks.page';

describe('ClerksPage', () => {
  let component: ClerksPage;
  let fixture: ComponentFixture<ClerksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClerksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
