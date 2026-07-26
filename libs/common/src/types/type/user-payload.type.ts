import { Role } from "../enum/role.enum";

export type UserPayload = {
  id: string;
  email: string;
  role: Role;
};
