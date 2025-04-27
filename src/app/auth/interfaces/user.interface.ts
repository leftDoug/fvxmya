export interface User {
  id: string;
  name?: string;
  username?: string;
  password?: string;
  occupation?: string;
  area?: string;
  role?: Role;
  member?: boolean;
  status?: string;
  state?: boolean;
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

export enum Role {
  ADMIN = 'ADMINISTRADOR',
  ORG_LEADER = 'LÍDER',
  WORKER = 'TRABAJADOR',
}
