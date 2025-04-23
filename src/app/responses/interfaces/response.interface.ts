import { Agreement } from '@app/agreements/interfaces/agreement.interface';

export interface Response {
  id: number;
  content: string;
  agreement?: Agreement;
  idAgreement?: number;
}

export interface ResponseResponse {
  data?: Response | Response[];
  message?: string;
}
