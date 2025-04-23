import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfMeetingFormComponent } from './type-of-meeting-form.component';

describe('TypeOfMeetingFormComponent', () => {
  let component: TypeOfMeetingFormComponent;
  let fixture: ComponentFixture<TypeOfMeetingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeOfMeetingFormComponent]
    });
    fixture = TestBed.createComponent(TypeOfMeetingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
