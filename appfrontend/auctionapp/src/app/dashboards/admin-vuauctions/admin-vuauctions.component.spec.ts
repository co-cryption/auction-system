import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVuauctionsComponent } from './admin-vuauctions.component';

describe('AdminVuauctionsComponent', () => {
  let component: AdminVuauctionsComponent;
  let fixture: ComponentFixture<AdminVuauctionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminVuauctionsComponent]
    });
    fixture = TestBed.createComponent(AdminVuauctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
