"use server";

import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db";

export type UserActionResult = { ok: boolean; message: string };

const createSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(100),
  email: z.email("Introduce un correo válido.").trim().toLowerCase(),
  password: z.string().min(12, "La contraseña debe tener al menos 12 caracteres.").max(200),
  role: z.enum(UserRole),
});

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(100),
  role: z.enum(UserRole),
  active: z.boolean(),
});

function failure(error: unknown): UserActionResult {
  if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Datos inválidos." };
  if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { ok: false, message: "Ya existe un usuario con ese correo." };
  return { ok: false, message: error instanceof Error ? error.message : "No fue posible guardar los cambios." };
}

export async function createUser(input: unknown): Promise<UserActionResult> {
  const admin = await requireAdmin();
  try {
    const data = createSchema.parse(input);
    const passwordHash = await hash(data.password, 12);
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name: data.name, email: data.email, passwordHash, role: data.role },
        select: { id: true },
      });
      await tx.activityLog.create({
        data: { userId: admin.id, action: "CREATE", entityType: "User", entityId: user.id, metadata: { email: data.email, role: data.role } },
      });
    });
    revalidatePath("/admin/usuarios");
    return { ok: true, message: "Usuario creado." };
  } catch (error) {
    return failure(error);
  }
}

export async function updateUser(input: unknown): Promise<UserActionResult> {
  const admin = await requireAdmin();
  try {
    const data = updateSchema.parse(input);
    if (data.id === admin.id && !data.active) return { ok: false, message: "No puedes desactivar tu propia cuenta." };

    await db.$transaction(async (tx) => {
      const current = await tx.user.findUnique({ where: { id: data.id }, select: { role: true, active: true } });
      if (!current) throw new Error("El usuario ya no existe.");

      if (current.role === "ADMIN" && current.active && (data.role !== "ADMIN" || !data.active)) {
        const otherActiveAdmins = await tx.user.count({ where: { id: { not: data.id }, role: "ADMIN", active: true } });
        if (otherActiveAdmins === 0) throw new Error("Debe quedar al menos un administrador activo.");
      }

      await tx.user.update({ where: { id: data.id }, data: { name: data.name, role: data.role, active: data.active } });
      await tx.activityLog.create({
        data: { userId: admin.id, action: "UPDATE", entityType: "User", entityId: data.id, metadata: { role: data.role, active: data.active } },
      });
    }, { isolationLevel: "Serializable" });
    revalidatePath("/admin/usuarios");
    return { ok: true, message: "Usuario actualizado." };
  } catch (error) {
    return failure(error);
  }
}
