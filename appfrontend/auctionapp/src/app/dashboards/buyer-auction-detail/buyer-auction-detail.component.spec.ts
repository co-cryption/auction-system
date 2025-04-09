import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerAuctionDetailComponent } from './buyer-auction-detail.component';

describe('BuyerAuctionDetailComponent', () => {
  let component: BuyerAuctionDetailComponent;
  let fixture: ComponentFixture<BuyerAuctionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyerAuctionDetailComponent]
    });
    fixture = TestBed.createComponent(BuyerAuctionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
