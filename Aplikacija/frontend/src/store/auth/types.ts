import { User } from "@/models/user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  firstLogin: boolean | null;
}