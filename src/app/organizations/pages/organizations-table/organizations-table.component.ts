import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { OrganizationsService } from '../../services/organizations.service';
import { Organization } from '@app/organizations/interfaces/organization.interface';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ConfirmRemoveComponent } from '@app/shared/confirm-remove/confirm-remove.component';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
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
export class OrganizationsTableComponent {
  private readonly _organizationsService = inject(OrganizationsService);
  loading: boolean = true;
  // FIXME: setear esto para k se carguen solo a las k puede acceder el usuario y usar el loading para la tabla
  organizations = computed(() => {
    return this._organizationsService.getAllFormatted();
  });
  confirmDialogVisible: boolean = false;
  formDialogVisible: boolean = false;
  selectedOrg: Organization | null = null;

  table = viewChild.required('tOrganization');
  tableIsSorted: boolean | null = null;
  removeEntityName: string | null = null;
  removeEntityId: number | null = null;
  removeEntityEvent: Event | null = null;

  constructor() {
    this._organizationsService.getAllSignal();
  }

  showRemoveConfirmation(event: Event, id: number, name: string) {
    this.removeEntityEvent = event;
    this.removeEntityName = name;
    this.removeEntityId = id;
    this.confirmDialogVisible = true;
  }

  remove(ok: boolean) {
    if (ok) {
      this._organizationsService.remove(this.removeEntityId!);
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
