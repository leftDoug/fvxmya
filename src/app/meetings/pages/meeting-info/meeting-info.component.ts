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
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import {
  Meeting,
  Status as StatusMeeting,
} from '../../interfaces/meeting.interface';
import { MeetingsService } from '../../services/meetings.service';

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
  ],
  templateUrl: './meeting-info.component.html',
  styleUrls: ['./meeting-info.component.css'],
})
export class MeetingInfoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly meetingsService = inject(MeetingsService);

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
      return this.participants().filter((w) => w.status === StatusUser.PRESENT);
    }
    return [];
  });
  missing = computed(() => {
    if (this.participants().length > 0) {
      return this.participants().filter((w) => w.status === StatusUser.ABSENT);
    }
    return [];
  });
  status = StatusMeeting;

  formVisible: boolean = false;
  attendanceVisible: boolean = false;
  agreementsVisible: boolean = false;
  infoVisible: boolean = true;

  idMeeting = input.required<string>({ alias: 'id' });

  constructor() {}

  ngOnInit(): void {
    // const idMeeting = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.meetingsService.getInfo(Number(this.idMeeting())).subscribe((resp) => {
      if (resp) {
        this.meeting.set(resp);
        // this.participants=resp.participants as User[]
        // this.members=this.participants.filter(w=>w.member)
        // this.guests=this.participants.filter(w=>!w.member)
        // this.attendants=this.participants.filter(w=>w.status===Status.PRESENT)
        // this.missing=this.participants.filter(w=>w.status===Status.ABSENT)
      }
    });
    // this.activatedRoute.params
    //   .pipe(switchMap(({ id }) => this.meetingsService.getInfo(id)))
    //   .subscribe((resp3) => {
    //     if (resp3.ok) {
    //       this.meeting = resp3.arg as Meeting;

    //       const workers = [...(this.meeting.participants as User[])];

    //       this.members = [...workers].filter(
    //         (worker) => (worker as User).member!
    //       );

    //       this.guests = [...workers].filter(
    //         (worker) => !(worker as User).member!
    //       );

    //       this.missing = [...workers].filter(
    //         (worker) => (worker as User).status === 'ausente'
    //       );

    //       this.participants = [...workers].filter(
    //         (worker) => (worker as User).status !== 'presente'
    //       );

    //       this.attendants = [...workers].filter(
    //         (worker) => (worker as User).status === 'presente'
    //       );
    //     }
    //   });
  }

  showAttendanceDialog() {
    this.attendanceVisible = true;
  }

  showFormDialog() {
    this.formVisible = true;
  }

  // hideDialog() {
  //   this.formVisible = false;
  //   this.attendanceVisible = false;
  // }

  hideFormDialog() {
    this.formVisible = false;
  }

  hideAttendanceDialog() {
    this.attendanceVisible = false;
  }

  // reloadInfo(ok: boolean) {
  //   if (ok) {
  //     // this.activatedRoute.params
  //     //   .pipe(switchMap(({ id }) => this.meetingsService.getInfo(id)))
  //     //   .subscribe((resp3) => {
  //     //     if (resp3.ok) {
  //     //       this.meeting = resp3.arg as Meeting;
  //     //       this.members = (this.meeting.participants as User[]).filter(
  //     //         (worker) => worker.member
  //     //       );
  //     //       this.guests = (this.meeting.participants as User[]).filter(
  //     //         (worker) => !worker.member
  //     //       );
  //     //       this.missing = (this.meeting.participants as User[]).filter(
  //     //         (worker) => worker.status === 'ausente'
  //     //       );
  //     //     }
  //     //   });

  //     this.hideDialog();
  //   }
  // }

  saveAttendance() {
    this.meetingsService
      .setAttendance(this.meeting()!.id, {
        attendants: [...this.attendants().map((w) => w.id)],
      })
      .subscribe((resp) => {
        if (resp) {
          this.meeting.set(resp);
        }
      });
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
    switch (status) {
      case StatusMeeting.PENDENT:
        return 'warn';
      case StatusMeeting.IN_PROCESS:
        return 'info';
      case StatusMeeting.CLOSED:
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
}
