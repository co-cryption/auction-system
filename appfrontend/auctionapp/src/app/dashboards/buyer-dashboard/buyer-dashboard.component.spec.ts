import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDashboardComponent } from './buyer-dashboard.component';

describe('BuyerDashboardComponent', () => {
  let component: BuyerDashboardComponent;
  let fixture: ComponentFixture<BuyerDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyerDashboardComponent]
    });
    fixture = TestBed.createComponent(BuyerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
