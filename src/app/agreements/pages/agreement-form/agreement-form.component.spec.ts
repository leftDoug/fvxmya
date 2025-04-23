import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementFormComponent } from './agreement-form.component';

describe('AgreementFormComponent', () => {
  let component: AgreementFormComponent;
  let fixture: ComponentFixture<AgreementFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgreementFormComponent]
    });
    fixture = TestBed.createComponent(AgreementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
