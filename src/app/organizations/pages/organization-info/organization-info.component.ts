import { NgFor, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { LoadingComponent } from '@app/shared/loading/loading.component';
import { TypesOfMeetingsTableComponent } from '@app/types-of-meetings/pages/types-of-meetings-table/types-of-meetings-table.component';
import { Organization } from '../../interfaces/organization.interface';
import { OrganizationsService } from '../../services/organizations.service';
import { OrganizationFormComponent } from '../organization-form/organization-form.component';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.css'],
  providers: [ConfirmationService, MessageService],
  imports: [
    NgFor,
    NgStyle,
    LoadingComponent,
    OrganizationFormComponent,
    TypesOfMeetingsTableComponent,
    CardModule,
    ButtonModule,
    DividerModule,
    RouterLink,
  ],
})
export class OrganizationInfoComponent implements OnInit {
  organizationsService = inject(OrganizationsService);
  organization!: Organization;
  route = inject(ActivatedRoute);
  loading = true;
  loadingTable = true;
  formDialogVisible: boolean = false;
  agendasTableVisible: boolean = false;
  reunionesTableVisible: boolean = false;

  constructor() {}

  ngOnInit(): void {
    const idOrg = this.route.snapshot.paramMap.get('id');
    this.organizationsService.getById(Number(idOrg)).subscribe((resp) => {
      if (resp) {
        this.organization = resp;
        this.loading = false;
        this.loadingTable = false;
      }
    });
  }

  showFormDialog() {
    this.formDialogVisible = true;
  }

  hideFormDialog() {
    this.formDialogVisible = false;
  }

  reloadInfo(hasChanges: boolean) {
    if (hasChanges) {
      this.loading = true;
      this.organizationsService
        .getById(this.organization.id)
        .subscribe((resp) => {
          if (resp) {
            this.organization = resp;
            this.loading = false;
          }
        });
    }
  }
}
