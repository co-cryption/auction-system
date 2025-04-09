import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerCartComponent } from './buyer-cart.component';

describe('BuyerCartComponent', () => {
  let component: BuyerCartComponent;
  let fixture: ComponentFixture<BuyerCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyerCartComponent]
    });
    fixture = TestBed.createComponent(BuyerCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
