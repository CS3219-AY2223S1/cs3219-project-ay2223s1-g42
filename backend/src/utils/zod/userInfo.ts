import { createZodDto } from "nestjs-zod/dto";

import { UserModel } from "./user";

export const UserInfo = UserModel.pick({ username: true, email: true });
export class UserInfoDto extends createZodDto(UserInfo) {}
