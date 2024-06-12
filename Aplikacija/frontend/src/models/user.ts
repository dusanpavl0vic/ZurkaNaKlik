import { Role } from "./role";

export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
};
