import { http } from "../../../shared/api/http";
import type {
  UserProfile,
  UpdateMyProfileRequest,
  ChangePasswordRequest,
} from "../models/user.types";

export const userApi = {
  getMe: () => http<UserProfile>("/api/user/me"),

  updateMe: (payload: UpdateMyProfileRequest) =>
    http<UserProfile>("/api/user/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  changePassword: (payload: ChangePasswordRequest) =>
    http<{ message: string }>("/api/user/change-password", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};