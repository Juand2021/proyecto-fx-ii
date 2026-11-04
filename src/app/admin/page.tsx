import type { Metadata } from "next";
import Link from "next/link";
import { esAdmin } from "@/lib/admin-auth";
import { APAGADO, COLOR, type Accion, debe, va } from "@/lib/estado";
import { listarPersonas, modoDemo } from "@/lib/personas";
import { agregar, borrar, entrar, marcar, salir } from "./acciones";

export const metadata: Metadata = {
  title: "Admin · Proyecto F(x) II",
  robots: { index: false },
};

const VOLVER =
  "inline-flex items-center gap-1.5 rounded-full border-[3px] border-tinta bg-crema px-4 py-2 text-sm font-black sombra-dura transition-transform active:translate-x-0.5 active:translate-y-0.5";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const { error } = await searchParams;

  if (!(await esAdmin())) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 bg-crema p-6 text-tinta">
        <Link href="/cuentas" className={`${VOLVER} self-start`}>
          ← Volver a Las cuentas
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Zona del admin</h1>
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
  const van = personas.filter(va).length;
  const deben = personas.filter(debe).length;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-5 bg-crema p-4 pb-16 text-tinta">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/cuentas" className={VOLVER}>
          ← Volver a Las cuentas
        </Link>
        <form action={salir}>
          <button className={`${VOLVER} bg-rojo text-crema`}>Cerrar sesión</button>
        </form>
      </header>
      <h1 className="text-2xl font-bold">Panel admin</h1>

      {modoDemo() && (
        <p className="rounded-lg bg-amber-100 p-3 text-sm text-amber-900">
          Modo prueba: Firebase no está configurado. Los cambios se pierden al reiniciar.
        </p>
      )}

      <p className="text-sm">
        {personas.length} personas · {van} van · {personas.length - van} no van · {deben} deben
      </p>
      <p className="-mt-3 text-xs opacity-70">
        VA / NO VA es la asistencia. DEBE se prende o apaga aparte: tóquelo cuando alguien le pague el cupo a Perdomo.
      </p>

      <form action={agregar} className="flex gap-2">
        <input name="nombre" placeholder="Nombre" className="flex-1 rounded-lg border px-3 py-2" required maxLength={60} />
        <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">Agregar</button>
      </form>

      <ul className="flex flex-col divide-y rounded-lg border">
        {personas.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-2 p-3">
            <span className="min-w-0 flex-1 font-medium">{p.nombre}</span>
            <div className="flex gap-1.5">
              <Boton id={p.id} accion="va" activo={va(p)} color={COLOR.va} texto="VA" />
              <Boton id={p.id} accion="no" activo={!va(p)} color={COLOR.no} texto="NO VA" />
              <Boton id={p.id} accion={debe(p) ? "pagado" : "debe"} activo={debe(p)} color={COLOR.debe} texto="DEBE" />
            </div>
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

function Boton({ id, accion, activo, color, texto }: { id: string; accion: Accion; activo: boolean; color: string; texto: string }) {
  return (
    <form action={marcar}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="accion" value={accion} />
      <button
        aria-pressed={activo}
        className={`rounded-full border-[3px] px-3 py-1 text-xs font-black transition-transform active:scale-95 ${
          activo ? `border-tinta ${color}` : `bg-transparent ${APAGADO}`
        }`}
      >
        {texto}
      </button>
    </form>
  );
}
