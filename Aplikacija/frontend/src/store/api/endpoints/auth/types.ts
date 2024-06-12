import { User } from "@/models/user";

export type LoginPayload = {
  email: string;
  password: string;
};

export interface LoginResponse {
  accessToken: string;
  loginResult: User;
}

export type CreateUserDTO = Required<Omit<User, "id">> & {
  lastName: string;
  location: string;
  password: string;
  repeatPassword: string;
};


export type CreateAgencyDTO = Required<Omit<User, "id">> & {
  location: string;
  password: string;
  repeatPassword: string;
};


// TODO fali updateUserDTO
