export interface User {
  id: string;
  name?: string;
  member?: boolean;
  status?: string;
}

export interface UserResponse {
  data?: User | User[];
  message?: string;
}

export enum Status {
  ABSENT = 'ausente',
  PRESENT = 'presente',
  PENDENT = 'pendiente',
}
