import { TestBed } from '@angular/core/testing';

import { MetamaskHandlerService } from './metamask-handler.service';

describe('MetamaskHandlerService', () => {
  let service: MetamaskHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetamaskHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
