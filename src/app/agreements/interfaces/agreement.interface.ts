import { User } from '@app/auth/interfaces/user.interface';
import { Meeting } from '@app/meetings/interfaces/meeting.interface';
import { Response } from '@app/responses/interfaces';

export interface Agreement {
  id: number;
  number?: number;
  content: string;
  state?: boolean;
  compilanceDate: Date;
  completed?: boolean;
  status?: Status;
  meeting?: Meeting;
  responsible?: User;
  responses?: Response[];
  idMeeting?: number;
  idResponsible?: string;
}

export interface AgreementResponse {
  data?: Agreement | Agreement[];
  message?: string;
}

export enum Status {
  CANCELLED = 'ANULADO',
  FULFILLED = 'CUMPLIDO',
  IN_PROCESS = 'EN PROCESO',
  UNFULFILLED = 'INCUMPLIDO',
}
