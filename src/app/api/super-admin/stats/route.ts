import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySuperAdminSession } from "@/lib/super-admin-auth";

export async function GET() {
  const isAuth = await verifySuperAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [
      totalSchools,
      activeSchools,
      totalAdmins,
      activeAdmins,
      totalTeachers,
      totalStudents,
      recentSchools,
      planDistribution,
    ] = await Promise.all([
      prisma.school.count(),
      prisma.school.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "SCHOOL_ADMIN" } }),
      prisma.user.count({
        where: { role: "SCHOOL_ADMIN", isActive: true },
      }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.school.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          isActive: true,
        },
      }),
      prisma.subscriptionPlan.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              schools: { where: { status: "active" } },
            },
          },
        },
      }),
    ]);

    const plans = planDistribution.map((p) => ({
      name: p.name,
      count: p._count.schools,
    }));

    return NextResponse.json({
      stats: {
        totalSchools,
        activeSchools,
        inactiveSchools: totalSchools - activeSchools,
        totalAdmins,
        activeAdmins,
        totalTeachers,
        totalStudents,
        totalUsers: totalAdmins + totalTeachers + totalStudents,
      },
      recentSchools,
      planDistribution: plans,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
