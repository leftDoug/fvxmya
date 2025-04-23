import { Topic } from '@app/topics/interfaces/topic.interface';
import { TypeOfMeeting } from '@app/types-of-meetings/interfaces/type-of-meeting.interface';

export interface Agenda {
  id: number;
  year: Date | number;
  typeOfMeeting?: TypeOfMeeting;
  idTypeOfMeeting?: number;
  topics?: Topic[];
}

export interface AgendaResponse {
  data?: Agenda | Agenda[];
  message?: string;
}

// export interface MonthWithId {
//   id: number;
//   name: MonthName;
// }

// export interface MonthWithTopics {
//   name: MonthName;
//   topics: string[];
// }

// export enum MonthName {
//   january = 'Enero',
//   february = 'Febrero',
//   march = 'Marzo',
//   april = 'Abril',
//   may = 'Mayo',
//   june = 'Junio',
//   july = 'Julio',
//   august = 'Agosto',
//   september = 'Septiembre',
//   october = 'Octubre',
//   november = 'Noviembre',
//   december = 'Diciembre',
// }
