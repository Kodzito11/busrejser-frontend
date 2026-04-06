export type UserRole = "Kunde" | "Medarbejder" | "Admin";

export interface UserProfile {
  username: string;
  email: string;
  role: string;
}