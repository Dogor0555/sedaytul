import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { categories } from "../src/config/demo-content";

const db = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error("Define SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD (mínimo 12 caracteres).");
  }

  const passwordHash = await hash(password, 12);
  await db.user.upsert({
    where: { email },
    update: { name: process.env.SEED_ADMIN_NAME?.trim() || "Ivon Mena de Castro", passwordHash, active: true, role: UserRole.ADMIN },
    create: {
      name: process.env.SEED_ADMIN_NAME?.trim() || "Ivon Mena de Castro",
      email,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  await Promise.all(
    categories.map((category, sortOrder) =>
      db.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name, description: category.description, sortOrder, active: true },
        create: { name: category.name, slug: category.slug, description: category.description, sortOrder, active: true },
      }),
    ),
  );

  await db.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main", businessName: "Seda y Tul" },
  });
}

main().finally(() => db.$disconnect());
