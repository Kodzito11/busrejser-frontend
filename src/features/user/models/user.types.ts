export type UserRole = "Kunde" | "Medarbejder" | "Admin";

export interface UserProfile {
  userId: string | number;
  email: string;
  role: UserRole;
  createdAt: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}

export interface UpdateMyProfileRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}