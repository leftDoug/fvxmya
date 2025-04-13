import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ConfirmationService,
  MessageService,
  PrimeTemplate,
} from 'primeng/api';
// import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { OrganizationsService } from '../../services/organizations.service';
// import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Organization } from '../../interfaces/organization.interface';
// import { User } from '../../../screen/interfaces/organization.interface';
import { User } from '../../../auth/interfaces/user.interface';
import { Button } from 'primeng/button';
// import { TypesOfMeetingsTableComponent } from '../../../types-of-meetings/pages/types-of-meetings-table/types-of-meetings-table.component';
import { NgFor, NgStyle } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TypesOfMeetingsTableComponent } from '@app/types-of-meetings/pages/types-of-meetings-table/types-of-meetings-table.component';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { OrganizationFormComponent } from '../organization-form/organization-form.component';
// import { OrganizationsService } from '../../../screen/services/organizations.service';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.css'],
  providers: [ConfirmationService, MessageService],
  imports: [
    CardModule,
    PrimeTemplate,
    DividerModule,
    NgFor,
    NgStyle,
    // TypesOfMeetingsTableComponent,
    Button,
    RouterLink,
    TypesOfMeetingsTableComponent,
    LoadingComponent,
    OrganizationFormComponent,
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationInfoComponent implements OnInit {
  organizationsService = inject(OrganizationsService);
  organization!: Organization;
  route = inject(ActivatedRoute);
  loading = true;
  loadingTable = true;
  formDialogVisible: boolean = false;

  constructor() {}

  ngOnInit(): void {
    const idOrg = this.route.snapshot.paramMap.get('id');
    this.organizationsService.getInfoSignal(Number(idOrg)).subscribe((resp) => {
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
        .getInfo(this.organization.id)
        .subscribe((resp) => {
          console.log(resp.data);
          this.organization = resp.data as Organization;
          this.loading = false;
        });
    }
  }
}
