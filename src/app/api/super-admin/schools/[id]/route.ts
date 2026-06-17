import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySuperAdminSession } from "@/lib/super-admin-auth";

async function checkAuth() {
  const isAuth = await verifySuperAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        users: {
          where: { role: "SCHOOL_ADMIN" },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
          },
        },
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        classes: {
          select: { id: true, name: true, numericId: true },
        },
      },
    });

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ school });
  } catch (error) {
    console.error("Failed to fetch school:", error);
    return NextResponse.json(
      { error: "Failed to fetch school details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    const updatableFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "country",
      "eiin",
      "isActive",
      "schoolType",
    ];

    const data: Record<string, unknown> = {};
    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    if (body.slug && body.slug !== school.slug) {
      const existingSlug = await prisma.school.findUnique({
        where: { slug: body.slug },
      });
      if (existingSlug) {
        return NextResponse.json(
          { error: "A school with this slug already exists" },
          { status: 409 }
        );
      }
      data.slug = body.slug;
    }

    const updated = await prisma.school.update({
      where: { id },
      data,
    });

    if (body.planId) {
      const existingSub = await prisma.schoolSubscription.findFirst({
        where: { schoolId: id, status: "active" },
      });

      if (existingSub && existingSub.planId !== body.planId) {
        await prisma.schoolSubscription.update({
          where: { id: existingSub.id },
          data: { status: "cancelled", cancelledAt: new Date() },
        });

        await prisma.schoolSubscription.create({
          data: {
            schoolId: id,
            planId: body.planId,
            status: "active",
            startDate: new Date(),
          },
        });
      } else if (!existingSub) {
        await prisma.schoolSubscription.create({
          data: {
            schoolId: id,
            planId: body.planId,
            status: "active",
            startDate: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      message: "School updated successfully",
      school: updated,
    });
  } catch (error) {
    console.error("Failed to update school:", error);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;

    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    await prisma.school.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "School deactivated successfully",
    });
  } catch (error) {
    console.error("Failed to deactivate school:", error);
    return NextResponse.json(
      { error: "Failed to deactivate school" },
      { status: 500 }
    );
  }
}
