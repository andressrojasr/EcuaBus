import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooleteryPage } from './booletery.page';

describe('BooleteryPage', () => {
  let component: BooleteryPage;
  let fixture: ComponentFixture<BooleteryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleteryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
