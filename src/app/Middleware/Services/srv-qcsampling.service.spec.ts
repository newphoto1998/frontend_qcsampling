import { TestBed } from '@angular/core/testing';

import { SrvQcsamplingService } from './srv-qcsampling.service';

describe('SrvQcsamplingService', () => {
  let service: SrvQcsamplingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrvQcsamplingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
