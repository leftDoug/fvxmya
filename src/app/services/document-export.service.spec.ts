import { TestBed } from '@angular/core/testing';

import { DocumentExportService } from './document-export.service';

describe('DocumentExportService', () => {
  let service: DocumentExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
