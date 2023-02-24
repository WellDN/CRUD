import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DiscordProfile, GoogleProfile } from "remix-auth-socials";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  active?: boolean;
  githubId?: string;
  googleId?: string;
  avatarURL?: string;
  locale?: string;
}) {
  const { email, password, firstName, lastName, active, githubId, googleId, avatarURL, locale } = data;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      avatar: avatarURL ?? "",
      phone: "",
      active,
      githubId,
      googleId,
      locale,
    },
  });
  return { id: user.id, email, defaultTenantId: "", locale };
}


export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}


export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}


