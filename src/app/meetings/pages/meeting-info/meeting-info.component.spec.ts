import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingInfoComponent } from './meeting-info.component';

describe('MeetingInfoComponent', () => {
  let component: MeetingInfoComponent;
  let fixture: ComponentFixture<MeetingInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingInfoComponent]
    });
    fixture = TestBed.createComponent(MeetingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
