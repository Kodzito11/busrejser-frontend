import { getCurrentUser } from "../../auth/utils/auth.storage";
import type { UserProfile } from "../models/user.types";

export const userApi = {
  getMe(): UserProfile | null {
    return getCurrentUser();
  },
};