import { PageHeader } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db";
import { UsersManager } from "./users-manager";

export default async function UsersPage() {
  const admin = await requireAdmin();
  const users = await db.user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  return <div className="space-y-7">
    <PageHeader eyebrow="Equipo" title="Usuarios" description="Crea cuentas y administra sus permisos y acceso. Esta sección es exclusiva para administradores." />
    <UsersManager users={users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() }))} currentUserId={admin.id} />
  </div>;
}
