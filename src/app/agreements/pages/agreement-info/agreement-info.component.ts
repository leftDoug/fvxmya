import { DatePipe, UpperCasePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Agreement } from '@app/agreements/interfaces';
import { ResponseFormComponent } from '@app/responses/components/response-form/response-form.component';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { getSeverity, getStatus } from '@app/shared/severity-status';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { AgreementsService } from '../../services/agreements.service';
import { AgreementFormComponent } from '../agreement-form/agreement-form.component';

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
    LoadingComponent,
    AgreementFormComponent,
  ],
  templateUrl: './agreement-info.component.html',
  styleUrls: ['./agreement-info.component.css'],
})
export class AgreementInfoComponent implements OnInit {
  private readonly agreementsService = inject(AgreementsService);

  id = input.required<string>();

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

  agreement = computed(() => {
    if (!this.id()) {
      return {
        isLoading: true,
        data: undefined,
      };
    } else {
      return {
        isLoading: false,
        data: this.agreementsService.getInfo(this.id()),
      };
    }
  });

  formDialogVisible: boolean = false;
  responseDialogVisible: boolean = false;
  infoVisible: boolean = true;
  loading: boolean = true;
  visible: boolean = true;

  isLeader: boolean = false;

  onHide = output<void>();

  // TODO: poner un delay para k no se vea el estado inicial al abrir la pagina

  constructor(
    private fb: FormBuilder,
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
    this.infoVisible = false;
    this.formDialogVisible = true;
  }

  hideForm() {
    this.formDialogVisible = false;
    this.infoVisible = true;
  }

  showResponseDialog() {
    this.infoVisible = false;
    this.responseDialogVisible = true;
  }

  hideResponseDialog() {
    this.responseDialogVisible = false;
    this.infoVisible = true;
  }

  reloadInfo(agr: Agreement) {
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

  setCompleted() {
    this.agreementsService.setCompleted(this.agreement().data!.id);
  }

  setCancelled(): void {
    this.agreementsService.setCancelled(this.agreement().data!.id);
  }

  hideDialog() {
    this.onHide.emit();
  }

  get status() {
    return getStatus(this.agreement().data!);
  }

  get severity() {
    return getSeverity(this.status);
  }
}
