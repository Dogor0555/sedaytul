import { MailPlus, MoreHorizontal, ShieldCheck, UserPlus } from "lucide-react";
import { users } from "@/config/admin-demo";
import { DemoNotice, PageHeader, Panel, StatusBadge, primaryButton } from "@/components/admin/admin-ui";

export default function UsersPage() {
  return <div className="space-y-7">
    <PageHeader eyebrow="Equipo" title="Usuarios" description="Gestiona quién puede acceder y editar el contenido de Seda y Tul." actions={<button className={primaryButton}><UserPlus className="size-4" />Invitar usuario demo</button>} />
    <DemoNotice compact />
    <section className="grid gap-3 sm:grid-cols-3">
      {[{ label: "Miembros", value: "4", icon: ShieldCheck }, { label: "Administradores", value: "1", icon: UserPlus }, { label: "Invitaciones", value: "1", icon: MailPlus }].map(({ label, value, icon: Icon }) => <Panel key={label} className="flex items-center gap-4 p-5"><span className="grid size-10 place-items-center rounded-xl bg-[#f1e5df] text-[#8e615c]"><Icon className="size-[18px]" /></span><div><p className="font-serif text-2xl text-[#413432]">{value}</p><p className="text-xs text-[#8b7e79]">{label}</p></div></Panel>)}
    </section>
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-[#fbf9f7] text-[10px] font-bold uppercase tracking-[0.14em] text-[#948681]"><tr><th className="px-6 py-4">Usuario</th><th className="px-4 py-4">Rol</th><th className="px-4 py-4">Estado</th><th className="px-4 py-4">Último acceso</th><th className="w-16"><span className="sr-only">Acciones</span></th></tr></thead><tbody className="divide-y divide-[#eee8e4]">
        {users.map((user, index) => <tr key={user.email} className="hover:bg-[#fdfaf8]"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-full text-xs font-bold ${index === 0 ? "bg-[#936661] text-white" : "bg-[#eee3de] text-[#7d5853]"}`}>{user.initials}</span><div><p className="text-sm font-semibold text-[#493b38]">{user.name}</p><p className="mt-0.5 text-xs text-[#948681]">{user.email}</p></div></div></td><td className="px-4 py-4 text-sm text-[#70635f]">{user.role}</td><td className="px-4 py-4"><StatusBadge status={user.status} /></td><td className="px-4 py-4 text-xs text-[#887b77]">{user.lastSeen}</td><td><button className="grid size-9 place-items-center rounded-xl text-[#8e817d] hover:bg-[#f2e9e5]" aria-label={`Opciones de ${user.name}`}><MoreHorizontal className="size-4" /></button></td></tr>)}
      </tbody></table></div>
    </Panel>
  </div>;
}
