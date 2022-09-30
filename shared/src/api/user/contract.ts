import { initContract } from "@ts-rest/core";

import { EditableSchema } from "./schema";

const c = initContract();

const UserContract = c.router({
  me: {
    method: "GET",
    path: "/me",
    summary: "Verifies that JWT token passed in request is valid",
    responses: {
      201: c.response<{ message: string }>(),
      401: c.response<{ message: string }>(),
      404: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
  },
  getUser: {
    method: "GET",
    path: "/:id",
    summary: "Returns info of user with the given id",
    responses: {
      201: c.response<{ message: string }>(),
      401: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      404: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
  },
  updateUser: {
    method: "PATCH",
    path: "/:id",
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
    path: "/:id",
    summary: "Delete data of specified user",
    body: null,
    responses: {
      200: c.response<{ message: string }>(),
      400: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      404: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
  },
});

export { UserContract };
