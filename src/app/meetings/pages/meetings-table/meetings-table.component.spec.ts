import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsTableComponent } from './meetings-table.component';

describe('MeetingsTableComponent', () => {
  let component: MeetingsTableComponent;
  let fixture: ComponentFixture<MeetingsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingsTableComponent]
    });
    fixture = TestBed.createComponent(MeetingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
