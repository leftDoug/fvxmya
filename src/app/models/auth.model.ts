export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  authToken?: string;
  refreshToken?: string;
}

export interface TokenResponse {
  message?: string;
  authToken?: string;
  refreshToken?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}
