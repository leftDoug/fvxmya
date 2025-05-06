import { NgIf } from '@angular/common';
import {
  Component,
  computed,
  inject,
  model,
  OnInit,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PickListModule } from 'primeng/picklist';
import { SelectModule } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { ToastModule } from 'primeng/toast';

import { Role, User } from '@app/auth/interfaces/user.interface';
import { NotificatorService } from '@app/services/notificator.service';
import { UserService } from '@app/shared/services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Organization } from '../../interfaces/organization.interface';
import { OrganizationsService } from '../../services/organizations.service';

@Component({
  selector: 'app-organization-form',
  imports: [
    StepperModule,
    ReactiveFormsModule,
    NgIf,
    DialogModule,
    ButtonModule,
    PickListModule,
    InputTextModule,
    SelectModule,
    ToastModule,
  ],
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.css'],
  providers: [],
  standalone: true,
})
export class OrganizationFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificatorService = inject(NotificatorService);
  private readonly organizationsService = inject(OrganizationsService);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  visible = true;
  onHide = output<void>();
  onChanges = output<boolean>();
  submitted: boolean = false;

  organization = model<Organization | undefined>(undefined);
  organizationForm: FormGroup;
  workers = computed(() => this.userService.getAllWorkersFormatted());
  leaders = computed(() =>
    this.userService
      .getAllUsersFormatted()
      .filter((usr) => usr.role === Role.ORG_LEADER)
  );
  // workers = computed(() => this.authService.getAllWorkersFormatted());
  workersSource: User[] = [];
  workersSelected: User[] = [];
  newOrganization: Organization;

  constructor() {
    this.organizationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      idLeader: ['', Validators.required],
    });

    this.newOrganization = {
      id: 0,
      name: '',
      members: [],
      idLeader: '',
    };

    this.userService.getAllUsers();
    // this.authService.getAll();
  }

  ngOnInit(): void {
    // console.log(this.workers());
    if (this.organization()?.id) {
      if (this.route.snapshot.routeConfig?.path?.includes('info')) {
        this.workersSelected = [...this.organization()!.members!];
      } else {
        this.organizationsService
          .getById(this.organization()!.id)
          .subscribe((resp) => {
            if (resp) {
              this.organization.set(resp);
              this.workersSelected = [...this.organization()!.members!];
            }
          });
      }
      this.organizationForm.patchValue({
        name: this.organization()!.name,
        idLeader: this.organization()!.leader!.id,
      });
    }

    this.leader.setValue(this.authService.getCurrentUserId());
    this.leader.disable();
    console.log(this.leader.value);
  }

  get name(): AbstractControl {
    return this.organizationForm.get('name')!;
  }

  get leader(): AbstractControl {
    return this.organizationForm.get('idLeader')!;
  }

  get nameErrorMsg(): string {
    this.name.markAsDirty();
    if (this.name.hasError('required')) {
      return 'El nombre es requerido';
    } else if (this.name.hasError('minlength')) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    return '';
  }

  get leaderErrorMsg(): string {
    this.leader.markAsDirty();
    if (this.leader.hasError('required')) {
      return 'El Líder es requerido';
    }
    return '';
  }

  hideDialog(hasChanges?: boolean) {
    this.submitted = false;
    this.organizationForm.reset();
    this.workersSource = [...this.workers()];
    this.workersSelected = [];
    if (hasChanges) {
      this.onChanges.emit(hasChanges);
    }
    this.onHide.emit();
  }

  submit() {
    this.submitted = true;
    this.organizationForm.valid && this.setSourceWorkers();
  }

  setSourceWorkers() {
    this.workersSource = [
      ...this.workers().filter((w) => {
        return (
          w.id !== this.leader.value &&
          !this.workersSelected.some((worker) => worker.id === w.id)
        );
      }),
    ];
    this.workersSelected = [
      ...this.workersSelected.filter((w) => w.id !== this.leader.value),
    ];
  }

  clearSelectedWorkers() {
    this.workersSelected = [];
  }

  saveOrganization() {
    if (this.workersSelected.length === 0) {
      this.notificatorService.notificate({
        severity: 'error',
        detail: 'Por favor, seleccione al menos un Trabajador como miembro',
      });
    } else {
      this.newOrganization = {
        id: this.organization()?.id || 0,
        name: this.name.value.trim(),
        members: this.workersSelected,
        idLeader: this.leader.value,
      };

      if (this.organization()?.id) {
        this.organizationsService
          .update(this.newOrganization)
          .subscribe((resp) => {
            if (resp) {
              this.hideDialog(true);
            }
          });
      } else {
        this.organizationsService
          .add(this.newOrganization)
          .subscribe((resp) => {
            if (resp) {
              this.hideDialog();
            }
          });
      }
    }
  }
}
