import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
const secretKey = process.env.SESSION_SECRET;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!superAdminEmail || !superAdminPassword || !secretKey) {
      return NextResponse.json(
        { error: "Super admin is not configured" },
        { status: 500 }
      );
    }

    if (email !== superAdminEmail || password !== superAdminPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const encodedKey = new TextEncoder().encode(secretKey);

    const session = await new SignJWT({
      userId: "super-admin",
      role: "SUPER_ADMIN",
      expiresAt,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      user: {
        id: "super-admin",
        email: superAdminEmail,
        name: "Super Admin",
        role: "SUPER_ADMIN",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
