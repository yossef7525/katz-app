import { TestBed } from '@angular/core/testing';

import { PoepleService } from './poeple.service';

describe('PoepleService', () => {
  let service: PoepleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoepleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
