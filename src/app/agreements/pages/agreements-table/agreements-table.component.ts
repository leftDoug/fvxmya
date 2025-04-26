import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Agreement,
  Status as StatusAgreement,
} from '@app/agreements/interfaces';
import { User } from '@app/auth/interfaces/user.interface';
import {
  Meeting,
  Status as StatusMeeting,
} from '@app/meetings/interfaces/meeting.interface';
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
  private readonly agreementsService = inject(AgreementsService);
  private readonly router = inject(Router);
  meeting = input.required<Meeting>();

  agreements = computed(() =>
    this.agreementsService
      .getAllFormatted()
      .filter((a) => a.meeting?.id === this.meeting().id)
      .sort((a, b) => a.number! - b.number!)
      .map((a2) => ({
        id: a2.id,
        number: a2.number,
        content: a2.content,
        responsible: a2.responsible?.name,
        meeting: a2.meeting?.name,
        status: this.getStatus(a2),
      }))
  );
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

  formDialogVisible: boolean = false;
  loading: boolean = true;
  infoDialogVisible: boolean = false;

  onGoBack = output<void>();

  constructor() {}

  ngOnInit(): void {
    this.agreementsService.getAllFromMeeting(this.meeting().id);
    this.workers = this.meeting().participants as User[];
    // this.workersService
    //   .testgetById(this.authService.testUser.id)
    //   .subscribe((w) => (this.worker = w));
    // this.user = this.authService.user;
    // this.authService.getRole(this.user.id).subscribe((r) => (this.role = r));
    // let tempAgreements: Agreement[] = [];
    // let tempMeetings: Meeting[] = [];
    // let tempWorkers: Worker[] = [];
    // if (this.role === 'Director de Área') {
    //   console.log('hey');
    // }
    // switch (this.role) {
    //   case 'Director de Área':
    //     this.directorArea = true;
    //     this.workersService.getAreas(this.user.id).subscribe((resp) => {
    //       resp.forEach((a) => {
    //         this.areasService
    //           .getWorkers(a.id)
    //           .subscribe((w) => (tempWorkers = tempWorkers.concat(w)));
    //         this.areasService.getToM(a.id).subscribe((resp) => {
    //           resp.forEach((tom) => {
    //             this.typesOfMeetingsService
    //               .getMeetings(tom.id)
    //               .subscribe((resp) => {
    //                 tempMeetings = tempMeetings.concat(resp);
    //                 resp.forEach((m) => {
    //                   this.meetingsService
    //                     .getAgreements(m.id)
    //                     .subscribe(
    //                       (resp) =>
    //                         (tempAgreements = tempAgreements.concat(resp))
    //                     );
    //                 });
    //               });
    //           });
    //         });
    //       });
    //     });
    //     break;
    //   case 'Trabajador':
    //     this.workersService
    //       .getAgreements(this.user.idWorker)
    //       .subscribe((resp) => (tempAgreements = tempAgreements.concat(resp)));
    //     break;
    //   case 'Director General':
    //     this.agreementsService
    //       .getAll()
    //       .subscribe((resp) => (tempAgreements = resp));
    //     break;
    //   default:
    //     break;
    // }
    // if (this.role === 'Director de Área') {
    //   this.directorArea = true;
    // }
    // if (this.directorArea) {
    //   this.areasService.getToM(this.user.idArea).subscribe((resp) => {
    //     resp.forEach((tom) => {
    //       this.typesOfMeetingsService.getMeetings(tom.id).subscribe((resp) => {
    //         resp.forEach((m) => {
    //           this.meetingsService.getAgreements(m.id).subscribe(resp=>tempAgreements=tempAgreements.concat(resp));
    //         });
    //       });
    //     });
    //   });
    // }
    // let aws: AgreementWithStatus[] = [];
    // tempAgreements.forEach((value) => {
    //   const agreement: AgreementWithStatus = {
    //     id: value.id,
    //     number: value.number,
    //     content: value.content,
    //     responsible: value.idResponsible,
    //     meeting: value.idMeeting,
    //     status: this.getStatus(value),
    //   };
    //   aws.push(agreement);
    // });
    // if (this.role === 'Director de Área' || this.role === 'Director General') {
    //   this.workersService.getAll().subscribe((resp) => {
    //     this.workers = resp;
    //     this.workers.sort((a, b) => a.name.localeCompare(b.name));
    //   });
    //   this.meetingsService.getAll().subscribe((resp) => {
    //     this.meetings = resp;
    //     this.meetings.sort((a, b) => a.name.localeCompare(b.name));
    //   });
    // }
    // this.agreementsService.getAll().subscribe((resp) => {
    //   let a: AgreementWithStatus[] = [];
    //   resp.forEach((value) => {
    //     const agreement: AgreementWithStatus = {
    //       id: value.id,
    //       number: value.number,
    //       content: value.content,
    //       responsible: this.workers.find(
    //         (worker) => worker.id === value.idResponsible
    //       )?.name!,
    //       meeting: this.meetings.find(
    //         (meeting) => meeting.id === value.idMeeting
    //       )?.name!,
    //       status: this.getStatus(value),
    //     };
    //     a.push(agreement);
    //   });
    //   this.agreements = aws;
    // });
    // let tempAg: Agreement[] = [];
    // this.activatedRoute.params
    //   .pipe(
    //     tap(({ id }) => {
    //       if (id) {
    //         return this.meetingsService
    //           .getInfo(id)
    //           .subscribe((resp) => (this.meeting = resp.arg as Meeting));
    //       } else {
    //         return id;
    //       }
    //     }),
    //     switchMap(({ id }) => {
    //       if (id) {
    //         return this.meetingsService.getAgreements(id);
    //       } else {
    //         return this.agreementsService.getAllFromUser();
    //       }
    //     })
    //   )
    //   .subscribe((resp) => {
    //     if (resp.ok) {
    //       if ((resp.arg as Agreement[]).length > 0) {
    //         const tempAgreements = resp.arg as Agreement[];
    //         this.meetingsService
    //           .getInfo(tempAgreements[0].meeting!.id)
    //           .subscribe((resp) => (this.meeting = resp.arg as Meeting));
    //         this.agreements = tempAgreements.map((agreement) => {
    //           return {
    //             id: agreement.id,
    //             number: agreement.number,
    //             content: agreement.content,
    //             compilanceDate: agreement.compilanceDate,
    //             responsible: agreement.responsible,
    //             meeting: agreement.meeting,
    //             state: agreement.state,
    //             status: this.getStatus(agreement),
    //           };
    //         });
    //       }
    //       this.loading = false;
    //     } else {
    //       this.messageService.add(getNotification(resp.msg!, false));
    //     }
    //   });
    // this.meetingsService
    //   .getAgreements()
    //   .subscribe((resp) => (this.agreements = resp.arg as Agreement[]));
    // this.workersService.getAll().subscribe((resp) => (this.workers = resp));
    // this.meetingsService
    //   .getAll()
    //   .subscribe((resp) => (this.meetings = resp.arg as Meeting[]));
    // FIXME: aqui esta la llamada al metodo para sacar el status
    // this.agreementsService.getAll().subscribe((resp) => {
    //   let a: AgreementWithStatus[] = [];
    //   console.log(resp);
    //   resp.forEach((value) => {
    //     const agreement: AgreementWithStatus = {
    //       id: value.id,
    //       number: value.number,
    //       content: value.content,
    //       responsible: value.responsible!,
    //       meeting: value.meeting!,
    //       status: this.getStatus(value),
    //     };
    //     a.push(agreement);
    //   });
    //   this.agreementsWS = a;
    // });
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
