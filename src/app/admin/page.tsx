import type { Metadata } from "next";
import Link from "next/link";
import { esAdmin } from "@/lib/admin-auth";
import { listarPersonas, modoDemo } from "@/lib/personas";
import { COLOR, ESTADOS, estadoDe } from "@/lib/estado";
import { agregar, borrar, entrar, marcar, salir } from "./acciones";

export const metadata: Metadata = {
  title: "Admin · Proyecto F(x) II",
  robots: { index: false },
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const { error } = await searchParams;

  if (!(await esAdmin())) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 bg-crema p-6 text-tinta">
        <h1 className="text-2xl font-bold">Zona del admin</h1>
        <p className="text-sm opacity-70">Si no eres Juan, devuélvase, sapo.</p>
        <form action={entrar} className="flex flex-col gap-3">
          <input
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            placeholder="PIN"
            className="rounded-lg border px-4 py-3 text-lg"
            required
          />
          <button className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white">Entrar</button>
          {error && <p className="text-sm text-red-600">PIN equivocado. Siga intentando, campeón.</p>}
        </form>
      </main>
    );
  }

  const personas = await listarPersonas();
  const cuenta = (e: string) => personas.filter((p) => estadoDe(p) === e).length;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 bg-crema p-4 text-tinta">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel admin</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/cuentas" className="underline">
            Ver página
          </Link>
          <form action={salir}>
            <button className="underline">Salir</button>
          </form>
        </div>
      </header>

      {modoDemo() && (
        <p className="rounded-lg bg-amber-100 p-3 text-sm text-amber-900">
          Modo prueba: Firebase no está configurado. Los cambios se pierden al reiniciar.
        </p>
      )}

      <p className="text-sm">
        {personas.length} personas · {cuenta("va")} van · {cuenta("debe")} deben · {cuenta("no")} no van
      </p>

      <form action={agregar} className="flex gap-2">
        <input name="nombre" placeholder="Nombre" className="flex-1 rounded-lg border px-3 py-2" required maxLength={60} />
        <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">Agregar</button>
      </form>

      <ul className="flex flex-col divide-y rounded-lg border">
        {personas.map((p) => {
          const actual = estadoDe(p);
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-2 p-3">
              <span className="min-w-0 flex-1 font-medium">{p.nombre}</span>
              <div className="flex gap-1.5">
                {ESTADOS.map((e) => (
                  <form key={e.id} action={marcar}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="estado" value={e.id} />
                    <button
                      aria-pressed={actual === e.id}
                      className={`rounded-full border-[3px] px-3 py-1 text-xs font-black transition-transform active:scale-95 ${
                        actual === e.id ? `border-tinta ${COLOR[e.id]}` : "border-tinta/25 bg-transparent text-tinta/60"
                      }`}
                    >
                      {e.etiqueta}
                    </button>
                  </form>
                ))}
              </div>
              <form action={borrar}>
                <input type="hidden" name="id" value={p.id} />
                <button className="px-2 text-sm text-red-600" aria-label={`Eliminar a ${p.nombre}`}>
                  ✕
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
