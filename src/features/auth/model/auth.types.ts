export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  userId: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthenticatedUserResponse = {
  userId: number;
  email: string;
  role: string;
};

export type LoginResponse = {
  toksenType: string;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: AuthenticatedUserResponse;
};

export type RefreshTokenResponse = LoginResponse;

export type LogoutResponse = {
  message: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type MeResponse = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};