export type UserRole = "Kunde" | "Medarbejder" | "Admin";

export interface UserProfile {
  userId: string | number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  fullName?: string | null;
  phone?: string | null;
}

export interface UpdateMyProfileRequest {
  username: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}