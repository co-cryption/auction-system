import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAllnotifComponent } from './seller-allnotif.component';

describe('SellerAllnotifComponent', () => {
  let component: SellerAllnotifComponent;
  let fixture: ComponentFixture<SellerAllnotifComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerAllnotifComponent]
    });
    fixture = TestBed.createComponent(SellerAllnotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
