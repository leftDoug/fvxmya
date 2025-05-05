import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Agreement,
  Status as StatusAgreement,
} from '@app/agreements/interfaces';
import { User } from '@app/auth/interfaces/user.interface';
import { AuthService } from '@app/auth/services/auth.service';
import {
  Meeting,
  Status as StatusMeeting,
} from '@app/meetings/interfaces/meeting.interface';
import { MeetingsService } from '@app/meetings/services/meetings.service';
import { OrganizationsService } from '@app/organizations/services/organizations.service';
import { TypesOfMeetingsService } from '@app/types-of-meetings/services/types-of-meetings.service';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { AgreementsService } from '../../services/agreements.service';
import { AgreementFormComponent } from '../agreement-form/agreement-form.component';
import { AgreementInfoComponent } from '../agreement-info/agreement-info.component';

@Component({
  selector: 'app-agreements-table',
  imports: [
    ToolbarModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    FormsModule,
    TagModule,
    AgreementInfoComponent,
    AgreementFormComponent,
  ],
  templateUrl: './agreements-table.component.html',
  styleUrls: ['./agreements-table.component.css'],
})
export class AgreementsTableComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly agreementsService = inject(AgreementsService);
  private readonly meetingService = inject(MeetingsService);
  private readonly tomService = inject(TypesOfMeetingsService);
  private readonly organizationService = inject(OrganizationsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  meeting = input<Meeting>();

  agreements = computed(() => {
    if (this.meeting()) {
      return this.agreementsService
        .getAllFormatted()
        .filter((a) => a.meeting?.id === this.meeting()!.id)
        .sort((a, b) => a.number! - b.number!)
        .map((a2) => ({
          id: a2.id,
          number: a2.number,
          content: a2.content,
          responsible: a2.responsible?.name,
          meeting: a2.meeting?.name,
          status: this.getStatus(a2),
        }));
    } else {
      return this.agreementsService
        .getAllFormatted()
        .filter(
          (agr) => agr.responsible?.id === this.authService.getCurrentUserId()
        )
        .sort((a, b) => a.number! - b.number!)
        .map((a2) => ({
          id: a2.id,
          number: a2.number,
          content: a2.content,
          responsible: a2.responsible?.name,
          meeting: a2.meeting?.name,
          status: this.getStatus(a2),
        }));
    }
  });
  generalAgreements = computed(() =>
    this.agreementsService
      .getAllFormatted()
      .filter((agr) =>
        this.meetingService
          .getAllFormatted()
          .some(
            (meet) =>
              meet.id === agr.meeting?.id &&
              this.tomService
                .getAllFormatted()
                .some(
                  (tom) =>
                    tom.id === meet.typeOfMeeting?.id &&
                    this.organizationService
                      .getAllFormatted()
                      .some(
                        (org) =>
                          org.id === tom.organization?.id &&
                          org.leader?.id === this.authService.getCurrentUserId()
                      )
                )
          )
      )
  );
  // agreements = computed(() =>
  //   this.agreementsService
  //     .getAllFormatted()
  //     .filter((a) => a.meeting?.id === this.meeting().id)
  //     .sort((a, b) => a.number! - b.number!)
  //     .map((a2) => ({
  //       id: a2.id,
  //       number: a2.number,
  //       content: a2.content,
  //       responsible: a2.responsible?.name,
  //       meeting: a2.meeting?.name,
  //       status: this.getStatus(a2),
  //     }))
  // );
  selectedAgreementId?: string;
  status = StatusAgreement;
  statuses = [
    StatusAgreement.FULFILLED,
    StatusAgreement.IN_PROCESS,
    StatusAgreement.UNFULFILLED,
    StatusAgreement.CANCELLED,
  ];
  workers!: User[];
  fulfilled = computed(() => {
    let amount = 0;
    this.agreements().forEach((a) => {
      if (a.status.toLowerCase() === StatusAgreement.FULFILLED.toLowerCase()) {
        amount++;
      }
    });
    return amount;
  });
  unfulfilled = computed(() => {
    let amount = 0;
    this.agreements().forEach((a) => {
      if (
        a.status.toLowerCase() === StatusAgreement.UNFULFILLED.toLowerCase()
      ) {
        amount++;
      }
    });
    return amount;
  });
  inProcess = computed(() => {
    let amount = 0;
    this.agreements().forEach((a) => {
      if (a.status.toLowerCase() === StatusAgreement.IN_PROCESS.toLowerCase()) {
        amount++;
      }
    });
    return amount;
  });
  cancelled = computed(() => {
    let amount = 0;
    this.agreements().forEach((a) => {
      if (a.status.toLowerCase() === StatusAgreement.CANCELLED.toLowerCase()) {
        amount++;
      }
    });
    return amount;
  });
  completed = StatusMeeting.CLOSED;
  // role!: string;
  // user!: UserLogged;
  // directorArea: boolean = false;
  // worker!: testWorker;

  // idAgreement: string = '';

  general = false;

  formDialogVisible: boolean = false;
  loading: boolean = true;
  infoDialogVisible: boolean = false;

  onGoBack = output<void>();

  constructor() {}

  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path?.includes('general')) {
      this.general = true;

      this.agreementsService.getAllFromLeader();
    }
    if (this.meeting()) {
      this.agreementsService.getAllFromMeeting(this.meeting()!.id);
      this.workers = this.meeting()!.participants as User[];
    }
  }

  // get user() {
  //   return this.authService.testUser;
  // }

  // get fulfilledAgreements(): number {
  //   let amount = 0;

  //   this.agreements.forEach((agreement) => {
  //     if (this.getStatus(agreement) === Status.fulfilled) amount++;
  //   });

  //   return amount;
  // }

  // get unfulfilledAgreements(): number {
  //   let amount = 0;

  //   this.agreements.forEach((agreement) => {
  //     if (this.getStatus(agreement) === Status.unfulfilled) amount++;
  //   });

  //   return amount;
  // }

  // get inProcessAgreements(): number {
  //   let amount = 0;

  //   this.agreements.forEach((agreement) => {
  //     if (this.getStatus(agreement) === Status.inProcess) amount++;
  //   });

  //   return amount;
  // }

  // get canceledAgreements(): number {
  //   let amount = 0;

  //   this.agreements.forEach((agreement) => {
  //     if (this.getStatus(agreement) === Status.canceled) amount++;
  //   });

  //   return amount;
  // }

  getStatus(agreement: Agreement): StatusAgreement {
    const date: Date = new Date(agreement.compilanceDate);
    // const date: Date = new Date(agreement.compilanceDate);
    const today: Date = new Date();

    if (agreement.completed) {
      return StatusAgreement.FULFILLED;
    } else if (!agreement.state) {
      return StatusAgreement.CANCELLED;
    } else if (today.getTime() < date.getTime()) {
      return StatusAgreement.IN_PROCESS;
    } else {
      return StatusAgreement.UNFULFILLED;
    }
  }

  // setSeverity(status: Status) {
  //   return getSeverity(null, status);
  // }

  // getMeeting(id: string): string {
  //   return this.meetings.find((meeting) => meeting.id === id)?.name!;
  // }

  getSeverity(status: StatusAgreement) {
    switch (status) {
      case StatusAgreement.CANCELLED:
        return 'secondary';
      case StatusAgreement.FULFILLED:
        return 'success';
      case StatusAgreement.IN_PROCESS:
        return 'info';
      case StatusAgreement.UNFULFILLED:
        return 'danger';
      default:
        return 'warn';
    }
  }

  getSeverityFromAgreement(agreement: Agreement) {
    const status = this.getStatus(agreement);
    return this.getSeverity(status);
  }

  showFormDialog() {
    this.formDialogVisible = true;
  }

  // reloadTable(event: boolean) {
  //   if (event) {
  //     this.meetingsService.getAgreements(this.meeting.id).subscribe((resp) => {
  //       const tempAgreements = resp.arg as Agreement[];

  //       this.agreements = tempAgreements.map((agreement) => {
  //         return {
  //           id: agreement.id,
  //           number: agreement.number,
  //           content: agreement.content,
  //           compilanceDate: agreement.compilanceDate,
  //           responsible: agreement.responsible,
  //           meeting: agreement.meeting,
  //           state: agreement.state,
  //           status: this.getStatus(agreement),
  //         };
  //       });
  //     });
  //   }
  // }

  hideFormDialog() {
    this.formDialogVisible = false;
  }

  goBack() {
    this.onGoBack.emit();
    // this.router.navigateByUrl(`reuniones/info/${this.meeting().id}`);
  }

  showInfoDialog(id: string) {
    this.selectedAgreementId = id;
    this.infoDialogVisible = true;
  }

  hideInfoDialog() {
    this.selectedAgreementId = undefined;
    this.infoDialogVisible = false;
  }
}
