<<<<<<< HEAD
import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
=======
import * as z from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod/dto";
>>>>>>> chore: fix rebase pull conflicts

export const UserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  username: z.string().min(4).max(20),
  email: z.string().email({ message: "Invalid email address" }),
  hash: z.string(),
  hashRt: z.string().nullish(),
<<<<<<< HEAD
})

export class UserDto extends createZodDto(UserModel) {
}
=======
});

const PublicUserInfo = UserModel.pick({
  id: true,
  email: true,
  username: true,
});

export type PublicUserInfo = z.infer<typeof PublicUserInfo>;

export class UserDto extends createZodDto(UserModel) {}
>>>>>>> chore: fix rebase pull conflicts
