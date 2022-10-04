import { TestBed } from '@angular/core/testing';

import { MeekolonyService } from './meekolony.service';

describe('MeekolonyService', () => {
  let service: MeekolonyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeekolonyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
