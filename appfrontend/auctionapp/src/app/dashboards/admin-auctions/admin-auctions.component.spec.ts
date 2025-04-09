import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuctionsComponent } from './admin-auctions.component';

describe('AdminAuctionsComponent', () => {
  let component: AdminAuctionsComponent;
  let fixture: ComponentFixture<AdminAuctionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAuctionsComponent]
    });
    fixture = TestBed.createComponent(AdminAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
