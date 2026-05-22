import { http } from "../../../shared/api/http";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  MeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../model/auth.types";

export const authApi = {
  register: (payload: RegisterRequest) =>
    http<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginRequest) =>
    http<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  refresh: (payload: RefreshTokenRequest) =>
    http<RefreshTokenResponse>(
      "/api/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      { skipAuthRefresh: true }
    ),

  logout: (payload: LogoutRequest) =>
    http<LogoutResponse>(
      "/api/auth/logout",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      { skipAuthRefresh: true }
    ),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    http<ForgotPasswordResponse>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: ResetPasswordRequest) =>
    http<ResetPasswordResponse>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => http<MeResponse>("/api/user/me"),
};