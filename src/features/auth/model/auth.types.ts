export type RegisterRequest = {
  FirstName: string;
  LastName : string;
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

export type LoginResponse = {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: {
    userId: number;
    email: string;
    role: string;
  };
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
  userId: string;
  firstName: string;
  lastName : string;
  email: string;
  role: string;
  createdAt : string;
  phone? : string;
};