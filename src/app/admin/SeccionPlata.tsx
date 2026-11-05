import { REGISTRADORES } from "@/lib/finanzas";
import { movimientosEnDemo, obtenerCuentas } from "@/lib/movimientos";
import { formatoPesos } from "@/lib/viaje";
import { agregarGasto, agregarIngreso } from "./acciones";
import { FotoInput } from "./FotoInput";

const AVISOS: Record<string, { texto: string; bueno: boolean }> = {
  "ok:ingreso": { texto: "Ingreso guardado en el Sheet.", bueno: true },
  "ok:gasto": { texto: "Gasto guardado en el Sheet.", bueno: true },
  "error:ingreso": { texto: "Revise la persona y el monto del ingreso.", bueno: false },
  "error:gasto": { texto: "Al gasto le falta el motivo, el monto o quién lo registra.", bueno: false },
  "error:foto": { texto: "Falta la foto de evidencia o no se pudo guardar.", bueno: false },
  "error:sheet": { texto: "No se pudo escribir en el Sheet. Revise que esté compartido con la cuenta de servicio.", bueno: false },
};

const CAMPO = "rounded-lg border px-3 py-2";
const BOTON = "rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white";

export async function SeccionPlata({ personas, ok, error }: { personas: string[]; ok?: string; error?: string }) {
  const cuentas = await obtenerCuentas().catch(() => null);
  const aviso = (ok && AVISOS[`ok:${ok}`]) || (error && AVISOS[`error:${error}`]) || null;

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-3">
      <h2 className="text-lg font-bold">Plata del paseo</h2>

      {movimientosEnDemo() && (
        <p className="rounded-lg bg-amber-100 p-3 text-sm text-amber-900">
          Modo prueba: el Sheet no está configurado (falta GOOGLE_SHEET_ID). Los movimientos se pierden al reiniciar.
        </p>
      )}

      {aviso && (
        <p className={`rounded-lg p-3 text-sm ${aviso.bueno ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>
          {aviso.texto}
        </p>
      )}

      {cuentas ? (
        <p className="text-sm">
          Recaudado {formatoPesos(cuentas.totalIngresos)} · Gastado {formatoPesos(cuentas.totalGastos)} ·{" "}
          <b>Disponible {formatoPesos(cuentas.saldo)}</b>
        </p>
      ) : (
        <p className="text-sm text-red-700">No se pudieron leer los totales del Sheet.</p>
      )}

      <form action={agregarIngreso} className="flex flex-col gap-2">
        <h3 className="font-semibold">Registrar ingreso</h3>
        <select name="persona" className={CAMPO} required defaultValue="">
          <option value="" disabled>
            ¿Quién abonó?
          </option>
          {personas.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
        <input name="monto" inputMode="numeric" placeholder="Monto en pesos (ej. 50000)" className={CAMPO} required />
        <button className={BOTON}>Guardar ingreso</button>
      </form>

      <form action={agregarGasto} className="flex flex-col gap-2">
        <h3 className="font-semibold">Registrar gasto</h3>
        <input name="motivo" placeholder="Motivo o título de la compra" className={CAMPO} required maxLength={120} />
        <input name="monto" inputMode="numeric" placeholder="Total en pesos (ej. 120000)" className={CAMPO} required />
        <select name="registradoPor" className={CAMPO} required defaultValue="">
          <option value="" disabled>
            Registrado por
          </option>
          {REGISTRADORES.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
        <FotoInput />
        <button className={BOTON}>Guardar gasto</button>
      </form>
    </section>
  );
}
