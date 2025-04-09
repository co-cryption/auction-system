import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerActiveitemsComponent } from './seller-activeitems.component';

describe('SellerActiveitemsComponent', () => {
  let component: SellerActiveitemsComponent;
  let fixture: ComponentFixture<SellerActiveitemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerActiveitemsComponent]
    });
    fixture = TestBed.createComponent(SellerActiveitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
