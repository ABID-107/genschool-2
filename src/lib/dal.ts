import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { decrypt } from "./session";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);
  if (!session?.userId) {
    redirect("/login");
  }
  return { userId: session.userId, role: session.role, schoolId: session.schoolId };
});

export async function getCurrentUser() {
  const session = await verifySession();
  const { prisma } = await import("./prisma");
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, schoolId: true, avatar: true },
  });
  return user;
}
