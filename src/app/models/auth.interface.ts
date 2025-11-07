export interface AuthResponse {
  token: string;
  type: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}
