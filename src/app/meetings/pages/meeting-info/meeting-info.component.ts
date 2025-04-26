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
import { AgreementsService } from '@app/agreements/services/agreements.service';
import {
  Status as StatusUser,
  User,
} from '@app/auth/interfaces/user.interface';
import { AttendanceDialogComponent } from '@app/meetings/components/attendance-dialog/attendance-dialog.component';
import { Organization } from '@app/organizations/interfaces/organization.interface';
import { OrganizationsService } from '@app/organizations/services/organizations.service';
import { DocumentExportService } from '@app/services/document-export.service';
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
  Session,
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
  private readonly organizationsService = inject(OrganizationsService);
  private readonly agreementsService = inject(AgreementsService);
  private readonly docExpService = inject(DocumentExportService);

  idMeeting = input.required<string>({ alias: 'id' });

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
  organization!: Organization;
  agreements = computed(() => {
    if (this.meeting()?.id) {
      return this.agreementsService
        .getAllFormatted()
        .filter((agr) => agr.meeting?.id === this.meeting()?.id);
    }

    return [];
  });

  formDialogVisible: boolean = false;
  attendanceDialogVisible: boolean = false;
  agreementsVisible: boolean = false;
  infoVisible: boolean = true;
  loading: boolean = true;

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

            if (
              this.meeting()?.status?.toLowerCase() ===
              StatusMeeting.CLOSED.toLowerCase()
            ) {
              this.organizationsService
                .getInfo(this.typeOfMeeting.organization?.id!)
                .subscribe((org) => {
                  if (org) {
                    this.organization = org;
                  }
                });

              this.agreementsService.getAllFromMeeting(this.meeting()?.id!);
            }
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

        this.organizationsService
          .getInfo(this.typeOfMeeting!.organization?.id!)
          .subscribe((org) => {
            if (org) {
              this.organization = org;
            }
          });

        this.agreementsService.getAllFromMeeting(this.meeting()?.id!);
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

  exportDocument() {
    const date = new Date(this.meeting()?.date!);
    const time = new Date(this.meeting()?.startTime!);
    const members = [
      this.organization.leader,
      ...this.meeting()!.participants!.filter((p) => p.member),
    ];

    if (this.organization.leader?.id !== this.meeting()?.secretary?.id) {
      members.push(this.meeting()?.secretary);
    }

    const data = {
      reunion: this.meeting()?.name,
      organizacion: this.organization.name,
      fecha: `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`,
      inicio: `${time.getHours().toString().padStart(2, '0')}:${time
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      extra:
        this.meeting()?.session.toLowerCase() ===
        Session.EXTRAORDINARY.toLowerCase()
          ? 'X'
          : '',
      ord:
        this.meeting()?.session.toLowerCase() === Session.ORDINARY.toLowerCase()
          ? 'X'
          : '',
      lider_nombre: this.organization.leader?.name,
      miembros: members.map((m) => ({
        nombre: m?.name,
        cargo: m?.occupation,
      })),
      //  [
      // {
      //   nombre: this.organization.leader?.name,
      //   cargo: this.organization.leader?.occupation,
      // },
      // this.organization.leader?.id !== this.meeting()?.secretary?.id && {
      //   nombre: this.meeting()?.secretary?.name,
      //   cargo: this.meeting()?.secretary?.occupation,
      // },
      // // [
      // ...this.meeting()!
      //   .participants!.filter((p) => p.member)
      //   .map((p2) => ({
      //     nombre: p2.name,
      //     cargo: p2.occupation,
      //   })),
      // // ],
      // ],
      miembros_ausentes: this.meeting()!
        .participants!.filter(
          (p) =>
            p.member &&
            p.status?.toLowerCase() === StatusUser.ABSENT.toLowerCase()
        )
        .map((p2) => ({
          nombre: p2.name,
          cargo: p2.occupation,
        })),
      invitados: this.meeting()!
        .participants!.filter((p) => !p.member)
        .map((p2) => ({
          nombre: p2.name,
          cargo: p2.occupation,
        })),
      temas: this.meeting()?.topics.map((t) => ({
        nombre: t.name,
      })),
      acuerdos: this.agreements().map((a) => {
        const cDate = new Date(a.compilanceDate);
        return {
          contenido: a.content,
          responsable: a.responsible?.name,
          fecha_cumplimiento: `${cDate
            .getDate()
            .toString()
            .padStart(2, '0')}/${(cDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${cDate.getFullYear()}`,
        };
      }),
      lider_cargo: this.organization.leader?.occupation,
    };

    console.log(data);

    this.docExpService.generateDocument(data);
  }
}
