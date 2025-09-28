import { DatePipe, UpperCasePipe } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { AgreementState } from '@app/agreements/interfaces';
import { ResponseFormComponent } from '@app/responses/components/response-form/response-form.component';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { getSeverity, getStatus } from '@app/shared/severity-status';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { AuthService } from 'src/app/auth/services/auth.service';
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
  private readonly authservice = inject(AuthService);

  id = input.required<string>();

  formDialogVisible: boolean = false;
  responseDialogVisible: boolean = false;
  infoVisible: boolean = true;
  loading: boolean = true;
  visible: boolean = true;
  isLeader = this.authservice.isLeader();

  onHide = output<void>();
  agreement!: Signal<AgreementState>;

  constructor() {}

  ngOnInit(): void {
    this.agreement = this.agreementsService.getById(this.id());
  }

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

  setCompleted() {
    this.agreementsService.complete(this.agreement().data!.id);
  }

  setCancelled(): void {
    this.agreementsService.cancel(this.agreement().data!.id);
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
