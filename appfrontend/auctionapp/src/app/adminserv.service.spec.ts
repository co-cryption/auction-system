import { TestBed } from '@angular/core/testing';

import { AdminservService } from './adminserv.service';

describe('AdminservService', () => {
  let service: AdminservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
