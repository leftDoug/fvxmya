import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementInfoComponent } from './agreement-info.component';

describe('AgreementComponent', () => {
  let component: AgreementInfoComponent;
  let fixture: ComponentFixture<AgreementInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgreementInfoComponent],
    });
    fixture = TestBed.createComponent(AgreementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
