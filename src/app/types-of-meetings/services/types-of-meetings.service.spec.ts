import { TestBed } from '@angular/core/testing';

import { TypesOfMeetingsService } from './types-of-meetings.service';

describe('TypesOfMeetingsService', () => {
  let service: TypesOfMeetingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypesOfMeetingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
