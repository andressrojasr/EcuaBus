import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaquillerosPage } from './taquilleros.page';

describe('TaquillerosPage', () => {
  let component: TaquillerosPage;
  let fixture: ComponentFixture<TaquillerosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaquillerosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
