import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  Status as StatusUser,
  User,
} from '@app/auth/interfaces/user.interface';
import { Meeting } from '@app/meetings/interfaces/meeting.interface';
import { MeetingsService } from '@app/meetings/services/meetings.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';

@Component({
  selector: 'app-attendance-dialog',
  imports: [DialogModule, ButtonModule, PickListModule],
  templateUrl: './attendance-dialog.component.html',
  styleUrl: './attendance-dialog.component.css',
})
export class AttendanceDialogComponent implements OnInit {
  private readonly meetingsService = inject(MeetingsService);

  meeting = input.required<Meeting>();
  visible = true;

  participants: User[] = [];
  attendants: User[] = [];

  onUpdate = output<Meeting>();
  onHide = output<void>();

  ngOnInit(): void {
    this.participants = this.meeting().participants!.filter(
      (p) => p.status?.toLowerCase() !== StatusUser.PRESENT.toLowerCase()
    );
    this.attendants = this.meeting().participants!.filter(
      (p) => p.status?.toLowerCase() === StatusUser.PRESENT.toLowerCase()
    );
  }

  hideDialog(meet?: Meeting) {
    if (meet) {
      this.onUpdate.emit(meet);
      this.onHide.emit();
    }
    this.onHide.emit();
  }

  save() {
    this.meetingsService
      .setAttendance(this.meeting().id, {
        attendants: [...this.attendants.map((a) => a.id)],
      })
      .subscribe((meet) => {
        console.log('NEW_MEETING:', meet);
        if (meet) {
          this.hideDialog(meet);
        }
      });
  }
}
