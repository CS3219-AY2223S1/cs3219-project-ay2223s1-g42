import { UserModel } from "src/types";

const EditableSchema = UserModel.pick({
  email: true,
  username: true,
  hashRt: true,
}).partial();

export { EditableSchema };
