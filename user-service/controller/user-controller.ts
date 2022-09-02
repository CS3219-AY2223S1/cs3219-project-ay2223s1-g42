import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { hashPassword, verifyPassword } from "../utils/salt_password";

const prisma = new PrismaClient();

enum AuthType {
  CUSTOM = "Custom",
}

export async function createUser(req: Request, res: Response) {
  const { email, password, displayName } = req.body;
  const user = await prisma.user.create({
    data: {
      email: email,
      password: await hashPassword(password),
      displayName: displayName,
      authType: AuthType.CUSTOM,
    },
  });
  res.json(user);
}

export async function findUser(req: Request, res: Response) {
  // By unique identifier
  const { userId } = req.params;
  const numberUserId = parseInt(userId);
  const user = await prisma.user.findUnique({
    where: {
      userId: numberUserId,
    },
  });
  res.json(user);
}

export async function updateUser(req: Request, res: Response) {
  const { userId, displayName } = req.body;
  const numberUserId = parseInt(userId);
  const user = await prisma.user.update({
    where: {
      userId: numberUserId,
    },
    data: {
      displayName,
    },
  });
  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const { userId } = req.body;
  const numberUserId = parseInt(userId);
  const user = await prisma.user.delete({
    where: {
      userId: numberUserId,
    },
  });
  res.json(user);
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  const isPassword = await verifyPassword(password, user?.password);

  //If is password ....
  //else ...

  console.log(isPassword);
  res.json(user);
}
