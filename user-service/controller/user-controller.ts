//import { ormCreateUser as _createUser } from "../model/user-orm";
import { PrismaClient } from "@prisma/client";
import e, { Request, Response } from "express";

const prisma = new PrismaClient();

enum AuthType {
  CUSTOM = "Custom",
}

export async function createUser(req: Request, res: Response) {
  const { email, password, displayName } = req.body;
  const user = await prisma.user.create({
    data: {
      email: email,
      password: password,
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
  console.log(numberUserId);
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
