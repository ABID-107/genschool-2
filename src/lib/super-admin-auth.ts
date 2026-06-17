import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function verifySuperAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return false;

    const payload = await decrypt(sessionCookie);
    return payload?.role === "SUPER_ADMIN";
  } catch {
    return false;
  }
}
