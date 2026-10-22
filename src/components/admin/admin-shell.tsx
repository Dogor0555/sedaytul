"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Boxes,
  ChevronDown,
  FileText,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navigation: {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}[] = [
  { label: "Resumen", href: "/admin", icon: LayoutDashboard },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Categorías", href: "/admin/categorias", icon: FolderTree },
  { label: "Galería", href: "/admin/galeria", icon: ImageIcon },
  { label: "Contenido", href: "/admin/contenido", icon: FileText },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users, adminOnly: true },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
];

const titles: Record<string, string> = {
  "/admin": "Resumen",
  "/admin/productos": "Productos",
  "/admin/productos/nuevo": "Nuevo producto",
  "/admin/categorias": "Categorías",
  "/admin/galeria": "Galería",
  "/admin/contenido": "Contenido",
  "/admin/usuarios": "Usuarios",
  "/admin/configuracion": "Configuración",
};

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3" aria-label="Seda y Tul, administración">
      <span className="grid size-10 place-items-center rounded-full border border-[#d6b5ae] bg-[#fffaf7] font-serif text-xl italic text-[#855d59]">S</span>
      <span>
        <span className="block font-serif text-[21px] leading-5 tracking-wide text-[#3e302e]">Seda <i className="font-normal text-[#a77670]">y</i> Tul</span>
        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.25em] text-[#9b8d88]">Administración</span>
      </span>
    </Link>
  );
}

function Navigation({ pathname, role, onNavigate }: { pathname: string; role: "ADMIN" | "EDITOR"; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="Navegación administrativa">
      {navigation.filter((item) => !item.adminOnly || role === "ADMIN").map(({ label, href, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-[#f1e5df] text-[#704e4a]" : "text-[#716562] hover:bg-[#f8f4f1] hover:text-[#3f302e]"}`}
          >
            <Icon className={`size-[18px] ${active ? "text-[#9a6b68]" : "text-[#9b8e89] group-hover:text-[#705c57]"}`} aria-hidden="true" />
            {label}
            {active && <span className="ml-auto size-1.5 rounded-full bg-[#a46f69]" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children, user, onLogout }: { children: React.ReactNode; user: { name: string; role: "ADMIN" | "EDITOR" }; onLogout: () => Promise<void> }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const title = titles[pathname] ?? "Administración";
  const initials = user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const roleLabel = user.role === "ADMIN" ? "Administradora general" : "Editora";

  return (
    <div className="min-h-screen bg-[#f8f6f3] text-[#352b29]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-[#e5ddd8] bg-[#fdfbf9] px-5 py-6 lg:flex lg:flex-col">
        <Brand />
        <div className="my-7 h-px bg-[#eee7e3]" />
        <Navigation pathname={pathname} role={user.role} />
        <div className="mt-auto rounded-2xl border border-[#eadfd8] bg-[#faf3ee] p-3.5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-[#9a6b68] text-xs font-bold text-white">{initials}</span>
            <span className="min-w-0 flex-1"><strong className="block truncate text-xs text-[#493936]">{user.name}</strong><span className="text-[11px] text-[#8b7b76]">{roleLabel}</span></span>
            <ChevronDown className="size-4 text-[#9b8c87]" />
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-[#2f2422]/35 backdrop-blur-sm" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />
          <aside className="absolute inset-y-0 left-0 flex w-[min(82vw,320px)] flex-col bg-[#fdfbf9] p-5 shadow-2xl">
            <div className="flex items-center justify-between"><Brand /><button onClick={() => setMenuOpen(false)} className="grid size-10 place-items-center rounded-xl border border-[#e5ddd8]" aria-label="Cerrar menú"><X className="size-5" /></button></div>
            <div className="my-6 h-px bg-[#eee7e3]" />
            <Navigation pathname={pathname} role={user.role} onNavigate={() => setMenuOpen(false)} />
            <form action={onLogout} className="mt-auto"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#716562]"><LogOut className="size-[18px]" />Cerrar sesión</button></form>
          </aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#e8e1dd] bg-[#f8f6f3]/90 px-4 backdrop-blur-md sm:px-7 lg:h-[72px] lg:px-9">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center rounded-xl border border-[#ded5d0] bg-white lg:hidden" aria-label="Abrir menú"><Menu className="size-5" /></button>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a0928d]">Panel</p><p className="text-sm font-semibold text-[#463936]">{title}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-[#eee5df] px-3 py-1.5 text-[11px] font-semibold text-[#795f58] sm:inline-flex">Panel privado</span>
            <Link href="/" className="grid size-10 place-items-center rounded-xl border border-[#ded5d0] bg-white text-[#645652]" title="Ver tienda"><ShoppingBag className="size-[18px]" /></Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 pb-24 pt-7 sm:px-7 lg:px-9 lg:pb-10 lg:pt-9">{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-2xl border border-[#e4dad5] bg-white/95 p-1.5 shadow-[0_12px_35px_rgba(57,41,37,0.16)] backdrop-blur lg:hidden" aria-label="Navegación móvil">
        {[
          { label: "Inicio", href: "/admin", icon: LayoutDashboard },
          { label: "Productos", href: "/admin/productos", icon: Boxes },
          { label: "Galería", href: "/admin/galeria", icon: ImageIcon },
          { label: "Ajustes", href: "/admin/configuracion", icon: Settings },
        ].map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold ${active ? "bg-[#f2e7e1] text-[#79534f]" : "text-[#887b77]"}`}><Icon className="size-[18px]" />{label}</Link>;
        })}
      </nav>
    </div>
  );
}
