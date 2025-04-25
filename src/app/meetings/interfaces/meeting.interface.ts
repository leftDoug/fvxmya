import { User } from '@app/auth/interfaces/user.interface';
import { Topic } from '@app/topics/interfaces/topic.interface';
import { TypeOfMeeting } from '@app/types-of-meetings/interfaces/type-of-meeting.interface';

export interface Meeting {
  id: number;
  name: string;
  session: Session | string;
  date: Date;
  startTime: Date;
  endTime: Date;
  topics: Topic[];
  typeOfMeeting?: TypeOfMeeting;
  // organization?: Organization;
  secretary?: User;
  idTypeOfMeeting?: number;
  idSecretary?: string;
  participants?: User[];
  members?: User[];
  guests?: User[];
  status?: Status | string;
}

export enum Session {
  ORDINARY = 'ORDINARIA',
  EXTRAORDINARY = 'EXTRAORDINARIA',
}

export enum Status {
  PENDENT = 'PENDIENTE',
  IN_PROCESS = 'EN PROCESO',
  CLOSED = 'COMPLETADA',
}

export interface MeetingResponse {
  ok: boolean;
  data?: Meeting | Meeting[];
  message?: string;
}
