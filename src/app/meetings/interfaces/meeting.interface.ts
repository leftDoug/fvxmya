import { User } from '@app/auth/interfaces/user.interface';
import { Organization } from '@app/organizations/interfaces/organization.interface';
import { TypeOfMeeting } from '@app/types-of-meetings/interfaces/type-of-meeting.interface';

export interface Meeting {
  id: number;
  name: string;
  session: Session | string;
  date: Date;
  startTime: Date;
  endTime: Date;
  typeOfMeeting?: TypeOfMeeting;
  organization?: Organization;
  secretary?: User;
  idTypeOfMeeting?: number;
  idSecretary?: string;
  participants: User[] | string[];
  status?: Status | string;
}

export enum Session {
  ORDINARY = 'ordinaria',
  EXTRAORDINARY = 'extraordinaria',
}

export enum Status {
  PENDENT = 'pendiente',
  IN_PROCESS = 'en proceso',
  CLOSED = 'completada',
}

export interface MeetingResponse {
  data?: Meeting | Meeting[];
  message?: string;
}
