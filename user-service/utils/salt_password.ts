import * as argon2 from "argon2";

export async function hashPassword(password) {
  const hash = await argon2.hash(password);
  return hash;
}

export async function verifyPassword(userPw, inputPw) {
  return argon2.verify(inputPw, userPw);
}
