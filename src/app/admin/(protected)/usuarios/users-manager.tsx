"use client";

import { LoaderCircle, Save, UserPlus } from "lucide-react";
import { FormEvent, startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { inputClass, labelClass, Panel, primaryButton } from "@/components/admin/admin-ui";
import { createUser, updateUser, type UserActionResult } from "./actions";

type UserRecord = { id: string; name: string; email: string; role: "ADMIN" | "EDITOR"; active: boolean; createdAt: string };

export function UsersManager({ users, currentUserId }: { users: UserRecord[]; currentUserId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<UserActionResult | null>(null);

  function finish(result: UserActionResult, form?: HTMLFormElement) {
    setPending(false);
    setNotice(result);
    if (result.ok) {
      form?.reset();
      router.refresh();
    }
  }

  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setNotice(null);
    startTransition(async () => finish(await createUser({ name: data.get("name"), email: data.get("email"), password: data.get("password"), role: data.get("role") }), form));
  }

  function submitUpdate(event: FormEvent<HTMLFormElement>, user: UserRecord) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const active = user.id === currentUserId ? true : data.get("active") === "on";
    if (!window.confirm(`¿Guardar los cambios de ${user.name}?`)) return;
    setPending(true);
    setNotice(null);
    startTransition(async () => finish(await updateUser({ id: user.id, name: data.get("name"), role: data.get("role"), active })));
  }

  return <div className="space-y-6">
    <Panel className="p-5">
      <h2 className="font-serif text-xl text-[#413432]">Crear usuario</h2>
      <p className="mt-1 text-xs text-[#887b77]">La contraseña debe tener al menos 12 caracteres.</p>
      <form onSubmit={submitCreate} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.2fr_1fr_160px_auto]">
        <div><label className={labelClass}>Nombre</label><input name="name" required minLength={2} maxLength={100} autoComplete="off" className={inputClass} /></div>
        <div><label className={labelClass}>Correo</label><input name="email" type="email" required autoComplete="off" className={inputClass} /></div>
        <div><label className={labelClass}>Contraseña</label><input name="password" type="password" required minLength={12} maxLength={200} autoComplete="new-password" className={inputClass} /></div>
        <div><label className={labelClass}>Rol</label><select name="role" defaultValue="EDITOR" className={inputClass}><option value="EDITOR">Editor</option><option value="ADMIN">Administrador</option></select></div>
        <button disabled={pending} className={`${primaryButton} self-end`}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}Crear</button>
      </form>
    </Panel>

    {notice && <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${notice.ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>{notice.message}</p>}

    <Panel className="overflow-hidden">
      <div className="border-b border-[#ece5e1] px-5 py-4 text-xs text-[#8e817d]">{users.length} {users.length === 1 ? "usuario" : "usuarios"} · {users.filter(({ role, active }) => role === "ADMIN" && active).length} administradores activos</div>
      {!users.length ? <p className="p-10 text-center text-sm text-[#8e817d]">No hay usuarios.</p> : <div className="divide-y divide-[#eee8e4]">
        {users.map((user) => <form key={user.id} onSubmit={(event) => submitUpdate(event, user)} className="grid gap-3 p-5 lg:grid-cols-[1.2fr_1.4fr_180px_130px_auto] lg:items-end">
          <div><label className={labelClass}>Nombre</label><input name="name" required minLength={2} maxLength={100} defaultValue={user.name} className={inputClass} /></div>
          <div><span className={labelClass}>Correo</span><p className="flex min-h-11 items-center break-all rounded-xl bg-[#faf7f5] px-3.5 text-sm text-[#655855]">{user.email}</p></div>
          <div><label className={labelClass}>Rol</label><select name="role" defaultValue={user.role} className={inputClass}><option value="EDITOR">Editor</option><option value="ADMIN">Administrador</option></select></div>
          <div className="pb-3"><label className="flex items-center gap-2 text-sm font-semibold text-[#4d403d]"><input name="active" type="checkbox" defaultChecked={user.active} disabled={user.id === currentUserId} />Activo</label>{user.id === currentUserId && <p className="mt-1 text-[10px] text-[#948783]">Tu cuenta</p>}</div>
          <button disabled={pending} className={primaryButton}><Save className="size-4" />Guardar</button>
        </form>)}
      </div>}
    </Panel>
  </div>;
}
