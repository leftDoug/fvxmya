import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { Organization } from '@app/organizations/interfaces/organization.interface';
import { ConfirmRemoveComponent } from '@app/shared/confirm-remove/confirm-remove.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { OrganizationsService } from '../../services/organizations.service';
import { OrganizationFormComponent } from '../organization-form/organization-form.component';

@Component({
  selector: 'app-organizations',
  imports: [
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CardModule,
    DialogModule,
    ConfirmRemoveComponent,
    RouterLink,
    OrganizationFormComponent,
  ],
  templateUrl: './organizations-table.component.html',
  styleUrl: './organizations-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsTableComponent implements OnInit {
  private readonly organizationsService = inject(OrganizationsService);
  private readonly authService = inject(AuthService);

  loading: boolean = true;
  // FIXME: setear esto para k se carguen solo a las k puede acceder el usuario y usar el loading para la tabla
  organizations = computed(() => {
    if (this.authService.isAdmin()) {
      return this.organizationsService.getAllFormatted();
    }
    return this.organizationsService
      .getAllFormatted()
      .filter((org) => org.leader?.id === this.authService.getCurrentUserId());
  });
  formDialogVisible: boolean = false;
  selectedOrg: Organization | null = null;
  confirmDialogVisible: boolean = false;
  removeEntityName: string | null = null;
  removeEntityId: number | null = null;
  removeEntityEvent: Event | null = null;

  isAdmin = false;

  constructor() {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    if (this.authService.isLeader()) {
      this.organizationsService.getAllFromLeader();
    }

    if (this.isAdmin) {
      this.organizationsService.getAll();
    }
  }

  showRemoveConfirmation(event: Event, id: number, name: string) {
    this.removeEntityEvent = event;
    this.removeEntityName = name;
    this.removeEntityId = id;
    this.confirmDialogVisible = true;
  }

  remove(ok: boolean) {
    if (ok) {
      this.organizationsService.remove(this.removeEntityId!);
    }

    this.removeEntityId = null;
    this.removeEntityName = null;
    this.confirmDialogVisible = false;
  }

  showFormDialog(organization?: Organization) {
    if (organization) {
      this.selectedOrg = organization;
    }
    this.formDialogVisible = true;
  }

  hideFormDialog() {
    this.formDialogVisible = false;
    this.selectedOrg = null;
  }
}
