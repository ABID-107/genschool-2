import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { createSession, deleteSession } from "./session";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid email or password" };
  if (!user.isActive) return { error: "Account is deactivated" };
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid email or password" };
  await createSession(user.id, user.role, user.schoolId ?? undefined);
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      schoolId: user.schoolId,
    },
  };
}

export async function logoutUser() {
  await deleteSession();
}
