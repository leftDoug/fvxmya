import { TestBed } from '@angular/core/testing';

import { NotificatorService } from './notificator.service';

describe('NotificatorService', () => {
  let service: NotificatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
