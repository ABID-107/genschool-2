import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const existingPlans = await prisma.subscriptionPlan.count();
  if (existingPlans > 0) {
    console.log("Plans already exist, skipping plan seed.");
  } else {
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: "Starter",
          slug: "starter",
          description: "For small schools getting started",
          price: 29,
          period: "monthly",
          maxStudents: 200,
          maxTeachers: 10,
          maxAdmins: 1,
          features: ["Up to 200 students", "Up to 10 teachers", "Basic analytics", "Email support", "1 school"],
          isPopular: false,
        },
        {
          name: "Professional",
          slug: "professional",
          description: "For growing institutions",
          price: 79,
          period: "monthly",
          maxStudents: 1000,
          maxTeachers: 50,
          maxAdmins: 3,
          features: ["Up to 1,000 students", "Up to 50 teachers", "Advanced analytics", "Priority support", "1 school", "Custom branding"],
          isPopular: true,
        },
        {
          name: "Enterprise",
          slug: "enterprise",
          description: "For large institutions & chains",
          price: 199,
          period: "monthly",
          maxStudents: 999999,
          maxTeachers: 9999,
          maxAdmins: 10,
          features: ["Unlimited students", "Unlimited teachers", "Full analytics suite", "24/7 dedicated support", "Multi-school support", "API access", "Custom integrations"],
          isPopular: false,
        },
      ],
    });
    console.log("Subscription plans created.");
  }

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@genschool.com";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin123!";

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 12);
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: "Super Admin",
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
    console.log("Super admin user created.");
  } else {
    console.log("Super admin user already exists.");
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
