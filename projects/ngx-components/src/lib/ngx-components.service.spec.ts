import { TestBed } from '@angular/core/testing';

import { NgxComponentsService } from './ngx-components.service';

describe('NgxComponentsService', () => {
  let service: NgxComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
