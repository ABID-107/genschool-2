import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySuperAdminSession } from "@/lib/super-admin-auth";

export async function GET() {
  const isAuth = await verifySuperAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription plans" },
      { status: 500 }
    );
  }
}
