import { User } from '@app/auth/interfaces/user.interface';

export interface Organization {
  id: number;
  name: string;
  leader?: User;
  members?: User[];
  idLeader?: string;
}

export interface OrganizationResponse {
  ok: boolean;
  message: string;
  data: Organization | Organization[];
}
