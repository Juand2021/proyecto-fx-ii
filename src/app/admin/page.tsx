import type { Metadata } from "next";
import Link from "next/link";
import { esAdmin } from "@/lib/admin-auth";
import { listarPersonas, modoDemo } from "@/lib/personas";
import { agregar, borrar, cambiar, entrar, salir } from "./acciones";

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
  const pagaron = personas.filter((p) => p.pagoCupo).length;
  const confirmaron = personas.filter((p) => p.confirmo).length;

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
        {personas.length} personas · {confirmaron} confirmaron · {pagaron} pagaron el cupo
      </p>

      <form action={agregar} className="flex gap-2">
        <input name="nombre" placeholder="Nombre" className="flex-1 rounded-lg border px-3 py-2" required maxLength={60} />
        <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">Agregar</button>
      </form>

      <ul className="flex flex-col divide-y rounded-lg border">
        {personas.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-2 p-3">
            <span className="flex-1 font-medium">{p.nombre}</span>
            <Toggle id={p.id} campo="confirmo" activo={p.confirmo} etiqueta="Confirmó" />
            <Toggle id={p.id} campo="pagoCupo" activo={p.pagoCupo} etiqueta="Pagó cupo" />
            <form action={borrar}>
              <input type="hidden" name="id" value={p.id} />
              <button className="px-2 text-sm text-red-600" aria-label={`Eliminar a ${p.nombre}`}>
                ✕
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Toggle({ id, campo, activo, etiqueta }: { id: string; campo: string; activo: boolean; etiqueta: string }) {
  return (
    <form action={cambiar}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="campo" value={campo} />
      <input type="hidden" name="valor" value={String(!activo)} />
      <button
        className={`rounded-full px-3 py-1 text-sm font-semibold ${activo ? "bg-emerald-600 text-white" : "bg-red-100 text-red-700"}`}
      >
        {activo ? "✓" : "✗"} {etiqueta}
      </button>
    </form>
  );
}
