import { http } from "../../../shared/api/http";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
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

  me: () => http<MeResponse>("/api/user/me"),
};