import { inject, Injectable } from '@angular/core';
import { AgreementsService } from '@app/agreements/services/agreements.service';
import { MeetingsService } from '@app/meetings/services/meetings.service';
import { OrganizationsService } from '@app/organizations/services/organizations.service';
import { TypesOfMeetingsService } from '@app/types-of-meetings/services/types-of-meetings.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly organizationService = inject(OrganizationsService);
  private readonly tomService = inject(TypesOfMeetingsService);
  private readonly meetingService = inject(MeetingsService);
  private readonly agreementService = inject(AgreementsService);

  constructor() {}

  loadData(): void {
    this.organizationService.getAllFromLeader();
    this.tomService.getAllFromLeader();
    this.meetingService.getAllFromLeader();
    this.agreementService.getAllFromLeader();
  }
}
