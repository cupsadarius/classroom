import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { roles, userRoles, users } from "./schema";

// Seeds the three global roles and a dev admin user. Idempotent.
async function seed() {
  const roleNames = ["admin", "teacher", "student"] as const;

  for (const name of roleNames) {
    await db.insert(roles).values({ name }).onConflictDoNothing();
  }

  const adminEmail = "admin@classroom.dev";
  const existing = await db.query.users.findFirst({ where: eq(users.email, adminEmail) });

  if (!existing) {
    const passwordHash = await bcrypt.hash("admin", 12);
    const [admin] = await db
      .insert(users)
      .values({
        email: adminEmail,
        firstName: "Dev",
        lastName: "Admin",
        passwordHash,
      })
      .returning();

    const adminRole = await db.query.roles.findFirst({ where: eq(roles.name, "admin") });
    if (admin && adminRole) {
      await db.insert(userRoles).values({ userId: admin.id, roleId: adminRole.id });
    }
    console.log(`Seeded admin user: ${adminEmail} / admin`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
