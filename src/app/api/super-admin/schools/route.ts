import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifySuperAdminSession } from "@/lib/super-admin-auth";

async function checkAuth() {
  const isAuth = await verifySuperAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    const schools = await prisma.school.findMany({
      include: {
        users: {
          where: { role: "SCHOOL_ADMIN" },
          select: { id: true, name: true, email: true },
          take: 1,
        },
        subscriptions: {
          include: { plan: true },
          where: { status: "active" },
          take: 1,
        },
        classes: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = schools.map((school) => {
      const studentCount = 0;
      const teacherCount = school.users.length;

      return {
        id: school.id,
        name: school.name,
        slug: school.slug,
        schoolType: school.schoolType,
        email: school.email,
        phone: school.phone,
        address: school.address,
        city: school.city || "",
        status: school.isActive ? "active" : "inactive",
        plan: school.subscriptions[0]?.plan?.name || "N/A",
        planId: school.subscriptions[0]?.planId || null,
        admin: school.users[0]
          ? { name: school.users[0].name, email: school.users[0].email }
          : null,
        students: studentCount,
        teachers: teacherCount,
        joined: new Date(school.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        createdAt: school.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ schools: formatted });
  } catch (error) {
    console.error("Failed to fetch schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    const {
      name,
      slug,
      schoolType,
      email,
      phone,
      address,
      city,
      state,
      country,
      eiin,
      adminName,
      adminEmail,
      adminPhone,
      adminPassword,
      planId,
    } = body;

    const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!slug) missingFields.push("slug");
    if (!adminName) missingFields.push("adminName");
    if (!adminEmail) missingFields.push("adminEmail");
    if (!adminPassword) missingFields.push("adminPassword");
    if (!planId) missingFields.push("planId");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
          fields: missingFields,
        },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.school.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: "A school with this slug already exists" },
        { status: 409 }
      );
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
    }

    const existingAdminEmail = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (existingAdminEmail) {
      return NextResponse.json(
        { error: "A user with this admin email already exists" },
        { status: 409 }
      );
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      return NextResponse.json(
        { error: "Selected subscription plan not found" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const school = await prisma.school.create({
      data: {
        name,
        slug,
        schoolType: schoolType || "SCHOOL",
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        country: country || null,
        eiin: eiin || null,
        isActive: true,
        users: {
          create: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            phone: adminPhone || null,
            role: "SCHOOL_ADMIN",
            isActive: true,
          },
        },
        subscriptions: {
          create: {
            planId,
            status: "active",
            startDate: new Date(),
          },
        },
      },
      include: {
        users: {
          where: { role: "SCHOOL_ADMIN" },
          select: { id: true, name: true, email: true },
        },
        subscriptions: {
          include: { plan: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "School registered successfully",
        school: {
          id: school.id,
          name: school.name,
          slug: school.slug,
          email: school.email,
          admin: school.users[0],
          plan: school.subscriptions[0]?.plan?.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register school:", error);
    return NextResponse.json(
      { error: "Failed to register school. Please try again." },
      { status: 500 }
    );
  }
}
