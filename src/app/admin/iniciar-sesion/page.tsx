import { ArrowRight, Eye, LockKeyhole, Mail } from "lucide-react";
import { login } from "./actions";

export default function LoginPage() {
  return <main className="grid min-h-screen bg-[#f9f6f3] text-[#3d302e] lg:grid-cols-[1.05fr_0.95fr]">
    <section className="relative hidden overflow-hidden bg-[#a97872] p-12 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,.24),transparent_35%),linear-gradient(145deg,transparent_30%,rgba(72,42,38,.25))]" />
      <div className="absolute -bottom-32 -right-20 size-[540px] rounded-full border border-white/20" /><div className="absolute -bottom-16 -right-8 size-[380px] rounded-full border border-white/20" />
      <div className="relative flex items-center gap-3 text-white"><span className="grid size-11 place-items-center rounded-full border border-white/50 font-serif text-2xl italic">S</span><span><span className="block font-serif text-2xl tracking-wide">Seda <i className="font-normal">y</i> Tul</span><span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-white/70">Administración</span></span></div>
      <div className="relative max-w-lg"><p className="font-serif text-4xl leading-tight text-white">Cada detalle cuenta una historia de elegancia.</p><p className="mt-5 max-w-md text-sm leading-6 text-white/75">Gestiona el catálogo y la expresión digital de Seda y Tul desde un solo lugar.</p></div>
      <p className="relative text-[11px] text-white/60">Panel administrativo · Acceso privado</p>
    </section>
    <section className="flex items-center justify-center px-5 py-12 sm:px-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 flex items-center justify-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-full border border-[#d6b5ae] font-serif text-xl italic text-[#855d59]">S</span><span className="font-serif text-2xl">Seda <i className="font-normal text-[#a77670]">y</i> Tul</span></div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a6b68]">Bienvenida de nuevo</p><h1 className="mt-3 font-serif text-4xl">Iniciar sesión</h1><p className="mt-3 text-sm leading-6 text-[#80736f]">Ingresa tus datos para acceder al panel administrativo.</p>
        <form action={login} className="mt-7 space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-semibold">Correo electrónico</span><span className="relative block"><Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9b8e89]" /><input name="email" required type="email" autoComplete="email" className="min-h-12 w-full rounded-xl border border-[#ddd4cf] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#9a6b68] focus:ring-2 focus:ring-[#ead8d3]" placeholder="nombre@sedaytul.com" /></span></label>
          <label className="block"><span className="mb-2 flex justify-between text-sm font-semibold"><span>Contraseña</span></span><span className="relative block"><LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9b8e89]" /><input name="password" required type="password" autoComplete="current-password" className="min-h-12 w-full rounded-xl border border-[#ddd4cf] bg-white px-10 text-sm outline-none focus:border-[#9a6b68] focus:ring-2 focus:ring-[#ead8d3]" placeholder="••••••••" /><Eye className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9b8e89]" /></span></label>
          <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#42322f] px-4 text-sm font-bold text-white hover:bg-[#59423f]">Entrar al panel <ArrowRight className="size-4" /></button>
        </form>
        <p className="mt-8 text-center text-xs text-[#9a8d88]">¿Necesitas acceso? Contacta a la administradora.</p>
      </div>
    </section>
  </main>;
}
