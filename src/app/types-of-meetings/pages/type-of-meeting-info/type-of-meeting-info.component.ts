import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendasTableComponent } from '@app/agendas/pages/agendas-table/agendas-table.component';
import { MeetingsTableComponent } from '@app/meetings/pages/meetings-table/meetings-table.component';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { TypeOfMeeting } from '@app/types-of-meetings/interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from '@app/types-of-meetings/services/types-of-meetings.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-typeOfMeeting-info',
  imports: [
    CardModule,
    ButtonModule,
    LoadingComponent,
    DividerModule,
    MeetingsTableComponent,
    AgendasTableComponent,
    ToolbarModule,
  ],
  templateUrl: './type-of-meeting-info.component.html',
  styleUrls: ['./type-of-meeting-info.component.css'],
})
export class TypeOfMeetingInfoComponent implements OnInit {
  private readonly tomsService = inject(TypesOfMeetingsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  typeOfMeeting!: TypeOfMeeting;
  loading: boolean = true;
  formDialogVisible: boolean = false;
  meetingsVisible: boolean = false;
  agendasVisible: boolean = false;

  constructor() {
    console.log(this.route.snapshot);
    if (this.route.snapshot.parent?.routeConfig?.path?.includes('reuniones')) {
      // if (this.route.snapshot.routeConfig?.path?.includes('reuniones')) {
      this.meetingsVisible = true;
    } else if (
      this.route.parent?.snapshot.routeConfig?.path?.includes('agendas')
    ) {
      this.agendasVisible = true;
    }
  }

  ngOnInit(): void {
    const idTom = this.route.snapshot.paramMap.get('id');
    this.tomsService.getById(Number(idTom)).subscribe((resp) => {
      if (resp) {
        console.log(resp);
        this.typeOfMeeting = resp;
        this.loading = false;
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
      this.tomsService.getById(this.typeOfMeeting.id).subscribe((resp) => {
        if (resp) {
          this.typeOfMeeting = resp;
          this.loading = false;
        }
      });
    }
  }
}
