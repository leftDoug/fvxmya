export interface TypeOfMeeting {
  id: number;
  name: string;
  organization?: string;
  idOrganization?: string;
}

export interface TypeOfMeetingResponse {
  ok: boolean;
  data?: TypeOfMeeting | TypeOfMeeting[];
  message?: string;
}
