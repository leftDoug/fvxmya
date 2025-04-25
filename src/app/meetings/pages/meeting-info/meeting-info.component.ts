import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe, NgStyle, UpperCasePipe } from '@angular/common';
import { AgreementsTableComponent } from '@app/agreements/pages/agreements-table/agreements-table.component';
import {
  Status as StatusUser,
  User,
} from '@app/auth/interfaces/user.interface';
import { AttendanceDialogComponent } from '@app/meetings/components/attendance-dialog/attendance-dialog.component';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { TypeOfMeeting } from '@app/types-of-meetings/interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from '@app/types-of-meetings/services/types-of-meetings.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import {
  Meeting,
  Status as StatusMeeting,
} from '../../interfaces/meeting.interface';
import { MeetingsService } from '../../services/meetings.service';
import { MeetingFormComponent } from '../meeting-form/meeting-form.component';

@Component({
  selector: 'app-meeting-info',
  imports: [
    CardModule,
    TagModule,
    UpperCasePipe,
    DividerModule,
    DatePipe,
    NgStyle,
    ButtonModule,
    // RouterLink,
    AgreementsTableComponent,
    LoadingComponent,
    MeetingFormComponent,
    AttendanceDialogComponent,
    ToolbarModule,
  ],
  templateUrl: './meeting-info.component.html',
  styleUrls: ['./meeting-info.component.css'],
})
export class MeetingInfoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly meetingsService = inject(MeetingsService);
  private readonly tomsService = inject(TypesOfMeetingsService);

  typeOfMeeting?: TypeOfMeeting;
  meeting = signal<Meeting | undefined>(undefined);
  participants = computed(() => {
    if (this.meeting()?.id) {
      return this.meeting()?.participants as User[];
    }
    return [];
  });
  members = computed(() => {
    if (this.participants().length > 0) {
      return this.participants().filter((w) => w.member);
    }
    return [];
  });
  guests = computed(() => {
    if (this.participants().length > 0) {
      return this.participants().filter((w) => !w.member);
    }
    return [];
  });
  attendants = computed(() => {
    if (this.participants().length > 0) {
      return this.participants().filter(
        (w) => w.status?.toLowerCase() === StatusUser.PRESENT.toLowerCase()
      );
    }
    return [];
  });
  missing = computed(() => {
    if (this.participants().length > 0) {
      return this.participants().filter(
        (w) => w.status?.toLowerCase() === StatusUser.ABSENT.toLowerCase()
      );
    }
    return [];
  });
  status = StatusMeeting;

  formDialogVisible: boolean = false;
  attendanceDialogVisible: boolean = false;
  agreementsVisible: boolean = false;
  infoVisible: boolean = true;
  loading: boolean = true;

  idMeeting = input.required<string>({ alias: 'id' });

  constructor() {}

  ngOnInit(): void {
    // const idMeeting = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.meetingsService.getInfo(Number(this.idMeeting())).subscribe((meet) => {
      if (meet) {
        console.log(meet);
        this.meeting.set(meet);
        this.tomsService.getInfo(meet.typeOfMeeting?.id!).subscribe((tom) => {
          if (tom) {
            this.typeOfMeeting = tom;
            this.loading = false;
          }
        });
      }
    });
  }

  showAttendanceDialog() {
    this.attendanceDialogVisible = true;
  }

  showFormDialog() {
    this.formDialogVisible = true;
  }

  // hideDialog() {
  //   this.formVisible = false;
  //   this.attendanceVisible = false;
  // }

  hideFormDialog() {
    this.formDialogVisible = false;
  }

  hideAttendanceDialog() {
    this.attendanceDialogVisible = false;
  }

  openMeeting() {
    this.meetingsService.setOpen(this.meeting()!.id).subscribe((resp) => {
      if (resp) {
        this.meeting.set(resp);
        this.showAttendanceDialog();
      }
    });
  }

  closeMeeting() {
    this.meetingsService.setClose(this.meeting()!.id).subscribe((resp) => {
      if (resp) {
        this.meeting.set(resp);
      }
    });
  }

  getSeverity(status: string) {
    switch (status.toLowerCase()) {
      case StatusMeeting.PENDENT.toLowerCase():
        return 'warn';
      case StatusMeeting.IN_PROCESS.toLowerCase():
        return 'info';
      case StatusMeeting.CLOSED.toLowerCase():
        return 'success';
      default:
        return 'danger';
    }
  }

  goBack() {
    this.router.navigateByUrl(
      'organizaciones/tipo-de-reunion/reuniones/' +
        this.meeting()?.typeOfMeeting?.id
    );
  }

  showAgreements() {
    this.infoVisible = false;
    this.agreementsVisible = true;
  }

  hideAgreements() {
    this.agreementsVisible = false;
    this.infoVisible = true;
  }

  updateInfo(meet: Meeting) {
    this.meeting.set(meet);
  }
}
