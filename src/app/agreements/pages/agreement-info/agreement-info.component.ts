import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Agreement } from '@app/agreements/interfaces';
import { ResponseFormComponent } from '@app/responses/components/response-form/response-form.component';
import { getSeverity, getStatus } from '@app/shared/severity-status';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { AgreementsService } from '../../services/agreements.service';

@Component({
  selector: 'app-agreement-info',
  imports: [
    DialogModule,
    TagModule,
    DividerModule,
    DatePipe,
    ButtonModule,
    UpperCasePipe,
    ResponseFormComponent,
  ],
  templateUrl: './agreement-info.component.html',
  styleUrls: ['./agreement-info.component.css'],
})
export class AgreementInfoComponent implements OnInit {
  // responses: Response[] = [];

  // agreement: Agreement = {
  //   id: '',
  //   content: '',
  //   compilanceDate: new Date(),
  //   state: true,
  // };
  // createdBy: string = '';
  // meeting: string = '';
  // responsible: string = '';

  formDialogVisible: boolean = false;
  responseDialogVisible: boolean = false;
  infoVisible: boolean = true;
  loading: boolean = true;
  visible: boolean = true;

  isLeader: boolean = false;

  agreement = input.required<Agreement>();
  onHide = output<void>();

  // TODO: poner un delay para k no se vea el estado inicial al abrir la pagina

  constructor(
    private fb: FormBuilder,
    private agreementsService: AgreementsService,
    private meetingsService: MeetingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.activatedRoute.params
    //   .pipe(
    //     tap(({ id }) => {
    //       this.agreementsService
    //         .getResponses(id)
    //         .subscribe((resp) => (this.responses = resp.arg as Response[]));
    //     }),
    //     switchMap(({ id }) => this.agreementsService.getInfo(id)),
    //     switchMap((resp2) => {
    //       this.agreement = resp2.arg as Agreement;
    //       return this.meetingsService.getOrganization(
    //         this.agreement.meeting!.id
    //       );
    //     })
    //   )
    //   .subscribe((resp3) => {
    //     this.authService.getIdUser().subscribe((resp4) => {
    //       this.isLeader = (resp3.arg as Organization).idLeader === resp4;
    //       this.loading = false;
    //     });
    //   });
  }

  // get severity(): string {
  //   return getSeverity(this.agreement, null);
  // }

  // setSeverity(status: Status) {
  //   return getSeverity(null, status);
  // }

  // get status(): Status {
  //   return getStatus(this.agreement);
  // }

  showFormDialog() {
    this.formDialogVisible = true;
  }

  hideForm() {
    this.formDialogVisible = false;
  }

  showResponseDialog() {
    this.infoVisible = false;
    this.responseDialogVisible = true;
  }

  hideResponseDialog() {
    this.responseDialogVisible = false;
    this.infoVisible = true;
  }

  reloadInfo(event: boolean) {
    // if (event) {
    //   this.activatedRoute.params
    //     .pipe(
    //       tap(({ id }) => {
    //         this.agreementsService
    //           .getResponses(id)
    //           .subscribe((resp) => (this.responses = resp.arg as Response[]));
    //       }),
    //       switchMap(({ id }) => this.agreementsService.getInfo(id))
    //     )
    //     .subscribe((resp) => (this.agreement = resp.arg as Agreement));
    // }
  }

  save() {
    // if (this.responseForm.valid) {
    //   this.agreementsService
    //     .addResponse({
    //       idAgreement: this.agreement.id,
    //       content: this.content.value,
    //     })
    //     .subscribe((resp) => {
    //       this.messageService.add(getNotification(resp.msg!, resp.ok));
    //       if (resp.ok) {
    //         this.reloadInfo(true);
    //         this.hideResponseDialog();
    //       }
    //     });
    // }
  }

  setCompleted() {
    // this.agreementsService.setCompleted(this.agreement.id).subscribe((resp) => {
    //   this.messageService.add(getNotification(resp.msg!, resp.ok));
    //   if (resp.ok) {
    //     this.reloadInfo(true);
    //   }
    // });
  }

  cancel(): void {
    // this.confirmationService.confirm({
    //   message: 'Está seguro de que desea anular este acuerdo?',
    //   header: 'Anular Acuerdo',
    //   icon: 'pi pi-exclamation-triangle',
    //   acceptLabel: 'Sí',
    //   accept: () => {
    //     this.messageService.add({
    //       severity: 'info',
    //       detail: 'El acuerdo ha sido anulado',
    //       summary: 'Acuerdo Anulado',
    //     });
    //     this.agreement.state = false;
    //     this.agreementsService.update(this.agreement).subscribe();
    //   },
    //   reject: () => {},
    //   rejectButtonStyleClass: 'mx-3',
    // });
  }

  hide() {
    this.onHide.emit();
  }

  getStatusLocal(agreement: Agreement) {
    return getStatus(agreement);
  }

  getSeverityLocal(agreement: Agreement) {
    const status = getStatus(agreement);
    return getSeverity(status);
  }
}
