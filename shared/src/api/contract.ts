import { initContract } from "@ts-rest/core";

import { AuthContract } from "./auth";
import { UserContract } from "./user";

const c = initContract();

const ApiContract = c.router({
  auth: AuthContract,
  users: UserContract,
});

export { ApiContract };
