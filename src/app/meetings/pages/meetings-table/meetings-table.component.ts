import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Organization } from '@app/organizations/interfaces/organization.interface';
import { OrganizationsService } from '@app/organizations/services/organizations.service';
import { ConfirmRemoveComponent } from '@app/shared/confirm-remove/confirm-remove.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { Meeting, Session } from '../../interfaces/meeting.interface';
import { MeetingsService } from '../../services/meetings.service';
import { MeetingFormComponent } from '../meeting-form/meeting-form.component';

@Component({
  selector: 'app-meetings-table',
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    DatePipe,
    FormsModule,
    InputTextModule,
    MeetingFormComponent,
    ConfirmRemoveComponent,
  ],
  templateUrl: './meetings-table.component.html',
  styleUrls: ['./meetings-table.component.css'],
})
export class MeetingsTableComponent implements OnInit {
  private readonly meetingsService = inject(MeetingsService);
  private readonly organizationsService = inject(OrganizationsService);
  private readonly router = inject(Router);

  typeOfMeeting = input.required<TypeOfMeeting>();
  organization!: Organization;
  meetings = computed(() => {
    return this.meetingsService
      .getAllFormatted()
      .filter((m) => m.typeOfMeeting?.id === this.typeOfMeeting().id);
  });
  sessions: Session[] = [Session.ORDINARY, Session.EXTRAORDINARY];
  selectedMeeting?: Meeting;

  confirmDialogVisible: boolean = false;
  tableIsSorted: boolean | null = null;
  removeEntityName: string | null = null;
  removeEntityId: number | null = null;
  removeEntityEvent: Event | null = null;

  formDialogVisible: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.meetingsService.getAllFrom(this.typeOfMeeting().id);
    this.organizationsService
      .getById(this.typeOfMeeting().organization!.id)
      .subscribe((resp) => {
        if (resp) {
          this.organization = resp;
        }
      });
  }

  showFormDialog() {
    this.formDialogVisible = true;
  }

  hideFormDialog() {
    this.formDialogVisible = false;
  }

  // reloadTable(ok: boolean) {
  //   this.hideDialog();

  //   if (ok) {
  //     this.typesOfMeetingsService
  //       .getMeetings(this.typeOfMeeting!.id)
  //       .subscribe((resp) => (this.meetings = resp.arg as Meeting[]));
  //   }
  // }

  goToDetails(id: number) {
    this.router.navigate(['reuniones/detalles', id]);
  }

  goBack() {
    this.router.navigate([
      'organizaciones/detalles',
      this.typeOfMeeting().organization!.id,
    ]);
  }

  showRemoveConfirmation(event: Event, id: number, name: string) {
    this.removeEntityEvent = event;
    this.removeEntityName = name;
    this.removeEntityId = id;
    this.confirmDialogVisible = true;
  }

  remove(ok: boolean) {
    if (ok) {
      this.meetingsService.remove(this.removeEntityId!);
    }

    this.removeEntityId = null;
    this.removeEntityName = null;
    this.confirmDialogVisible = false;
  }
}
