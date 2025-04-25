import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceDialogComponent } from './attendance-dialog.component';

describe('AttendanceDialogComponent', () => {
  let component: AttendanceDialogComponent;
  let fixture: ComponentFixture<AttendanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
