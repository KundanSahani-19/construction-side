import { TestBed } from '@angular/core/testing';

import { Labour } from './labour';

describe('Labour', () => {
  let service: Labour;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Labour);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
