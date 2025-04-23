import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfMeetingInfoComponent } from './type-of-meeting-info.component';

describe('TypeOfMeetingInfoComponent', () => {
  let component: TypeOfMeetingInfoComponent;
  let fixture: ComponentFixture<TypeOfMeetingInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeOfMeetingInfoComponent]
    });
    fixture = TestBed.createComponent(TypeOfMeetingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
