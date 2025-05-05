export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
  occupation: string;
  area?: string;
  role?: Role;
  member?: boolean;
  status?: string;
  state?: boolean;
}

export interface UserState {
  data: User | undefined;
  loading: boolean;
}

export interface WorkerState {
  data: UserWorker | undefined;
  loading: boolean;
}

export interface UserWorker {
  id: string;
  name: string;
  occupation: string;
  member?: boolean;
  status?: string;
}

export interface CreateUser {
  name: string;
  username: string;
  password: string;
  occupation: string;
  area: string;
  role: Role;
}

export interface UpdateUser {
  name?: string;
  occupation?: string;
  area?: string;
  role?: Role;
}

export interface UserInfo {
  id: string;
  username: string;
  role: Role;
}

export interface UserResponse {
  data?: User | User[] | UserWorker | UserWorker[];
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
