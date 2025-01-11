import { TestBed } from '@angular/core/testing';

import { FirebaseSecondaryService } from './firebase-secondary.service';

describe('FirebaseSecondaryService', () => {
  let service: FirebaseSecondaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseSecondaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
