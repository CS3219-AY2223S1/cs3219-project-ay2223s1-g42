import { initContract } from "@ts-rest/core";

import { EditableSchema, UserInfo } from "./schema";

const c = initContract();

const UserContract = c.router({
  me: {
    method: "GET",
    path: "/users/me",
    summary: "Verifies that JWT token passed in request is valid",
    responses: {
      201: c.response<UserInfo>(),
      401: c.response<{ message: string }>(),
      404: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
  },
  getUser: {
    method: "GET",
    path: "/users/:id",
    summary: "Returns info of user with the given id",
    responses: {
      201: c.response<UserInfo>(),
      401: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      404: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
  },
  editUser: {
    method: "PATCH",
    path: "/users/:id",
    summary: "Edit data of specified user",
    body: EditableSchema,
    responses: {
      201: c.response<{ message: string }>(),
      401: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      404: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
  },
  deleteUser: {
    method: "DELETE",
    path: "/users/:id",
    summary: "Delete data of specified user",
    body: null,
    responses: {
      200: c.response<UserInfo>(),
      400: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      404: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
  },
});

export { UserContract };
