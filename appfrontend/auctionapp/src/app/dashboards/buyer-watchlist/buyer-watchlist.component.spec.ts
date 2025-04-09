import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerWatchlistComponent } from './buyer-watchlist.component';

describe('BuyerWatchlistComponent', () => {
  let component: BuyerWatchlistComponent;
  let fixture: ComponentFixture<BuyerWatchlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyerWatchlistComponent]
    });
    fixture = TestBed.createComponent(BuyerWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
