export interface User {
  id: string;
  name?: string;
}

export interface UserResponse {
  data?: User | User[];
  message?: string;
}
