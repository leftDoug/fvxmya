import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesOfMeetingsTableComponent } from './types-of-meetings-table.component';

describe('TypesOfMeetingsTableComponent', () => {
  let component: TypesOfMeetingsTableComponent;
  let fixture: ComponentFixture<TypesOfMeetingsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypesOfMeetingsTableComponent]
    });
    fixture = TestBed.createComponent(TypesOfMeetingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
