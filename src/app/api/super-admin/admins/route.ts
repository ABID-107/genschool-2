import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifySuperAdminSession } from "@/lib/super-admin-auth";

export async function GET() {
  const isAuth = await verifySuperAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const admins = await prisma.user.findMany({
      where: { role: "SCHOOL_ADMIN" },
      include: {
        school: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone || "",
      school: admin.school?.name || "N/A",
      schoolId: admin.school?.id || null,
      role: "Admin",
      status: admin.isActive ? "active" : "inactive",
      lastActive: "N/A",
    }));

    return NextResponse.json({ admins: formatted });
  } catch (error) {
    console.error("Failed to fetch admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch school admins" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const isAuth = await verifySuperAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, password, schoolId, isActive } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    if (schoolId) {
      const school = await prisma.school.findUnique({
        where: { id: schoolId },
      });
      if (!school) {
        return NextResponse.json(
          { error: "Selected school not found" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "SCHOOL_ADMIN",
        schoolId: schoolId || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        school: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone || "",
          school: admin.school?.name || "N/A",
          schoolId: admin.school?.id || null,
          role: "Admin",
          status: admin.isActive ? "active" : "inactive",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin. Please try again." },
      { status: 500 }
    );
  }
}
