import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { logout } from "./actions";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/iniciar-sesion");

  return <AdminShell user={{ name: session.user.name ?? "Ivon Mena de Castro", role: session.user.role }} onLogout={logout}>{children}</AdminShell>;
}
