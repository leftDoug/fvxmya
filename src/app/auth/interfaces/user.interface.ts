export interface User {
  id: string;
  name?: string;
  occupation?: string;
  member?: boolean;
  status?: string;
}

export interface UserResponse {
  data?: User | User[];
  message?: string;
}

export enum Status {
  ABSENT = 'AUSENTE',
  PRESENT = 'PRESENTE',
  PENDENT = 'PENDIENTE',
}
