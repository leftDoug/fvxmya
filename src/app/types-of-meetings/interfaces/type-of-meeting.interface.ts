import { Organization } from '@app/organizations/interfaces/organization.interface';

export interface TypeOfMeeting {
  id: number;
  name: string;
  organization?: Organization;
  idOrganization?: number;
}

export interface TypeOfMeetingResponse {
  data?: TypeOfMeeting | TypeOfMeeting[];
  message?: string;
}
