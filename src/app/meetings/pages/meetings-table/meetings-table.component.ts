import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Meeting, Session } from '../../interfaces/meeting.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { MeetingsService } from '../../services/meetings.service';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MeetingFormComponent } from '../meeting-form/meeting-form.component';
import { Organization } from '@app/organizations/interfaces/organization.interface';
import { OrganizationsService } from '@app/organizations/services/organizations.service';

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

  formDialogVisible: boolean = false;

  selectedMeeting: Meeting | null = null;

  constructor() {
    this.meetingsService.getAll();
  }

  ngOnInit(): void {
    this.organizationsService
      .getInfo(this.typeOfMeeting().organization!.id)
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

  goToInfo(id: number) {
    this.router.navigateByUrl('/reuniones/info/' + id);
  }

  goBack() {
    this.router.navigateByUrl(
      `organizaciones/info/${this.typeOfMeeting().organization!.id}`
    );
  }
}
