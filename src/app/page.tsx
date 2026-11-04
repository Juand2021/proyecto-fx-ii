// Página pública: versión base con los datos. El diseño final llega en la fase de frontend.
import Link from "next/link";
import { listarPersonas } from "@/lib/personas";
import { VIAJE, formatoPesos } from "@/lib/viaje";

// Se regenera al instante cuando el admin cambia algo en /admin,
// o en máximo 1 min si se edita directo en la consola de Firebase.
export const revalidate = 60;

export default async function Home() {
  const personas = await listarPersonas();

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 p-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">{VIAJE.titulo}</h1>
          <p className="text-xl">{VIAJE.subtitulo}</p>
        </div>
        <Link
          href="/admin"
          className="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold"
        >
          Admin
        </Link>
      </header>

      <ul className="text-sm">
        <li>{VIAJE.destino}</li>
        <li>Salida: sábado 14 de noviembre, 7:00 a.m. desde {VIAJE.puntoSalida}</li>
        <li>Regreso: martes 17 de noviembre · {VIAJE.duracion}</li>
        <li>
          Total {formatoPesos(VIAJE.costoTotal)} · Cupo {formatoPesos(VIAJE.cupo)} antes del sábado
        </li>
      </ul>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2 text-center">Confirmó</th>
            <th className="py-2 text-center">Pagó cupo</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2">{p.nombre}</td>
              <td className="py-2 text-center">{p.confirmo ? "✅" : "❌"}</td>
              <td className="py-2 text-center">{p.pagoCupo ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
