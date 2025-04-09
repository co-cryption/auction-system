import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerNewitemComponent } from './seller-newitem.component';

describe('SellerNewitemComponent', () => {
  let component: SellerNewitemComponent;
  let fixture: ComponentFixture<SellerNewitemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerNewitemComponent]
    });
    fixture = TestBed.createComponent(SellerNewitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
