// Dos cosas independientes por persona (guardadas en Firestore):
//   Asistencia: VA (verde) o NO VA (rojo)  → campo `confirmo`
//   Deuda:      DEBE (amarillo) prendido    → campo `pagoCupo` en false
// Alguien puede ir y deber, o no ir y deber: la deuda no cambia el verde/rojo.

type P = { confirmo: boolean; pagoCupo: boolean };

export const va = (p: P) => p.confirmo;
export const debe = (p: P) => !p.pagoCupo;

/** Acciones del admin. */
export type Accion = "va" | "no" | "debe" | "pagado";

export function camposDe(a: Accion): Partial<P> {
  if (a === "va") return { confirmo: true };
  if (a === "no") return { confirmo: false };
  if (a === "debe") return { pagoCupo: false };
  return { pagoCupo: true };
}

export function esAccion(v: unknown): v is Accion {
  return v === "va" || v === "no" || v === "debe" || v === "pagado";
}

/** Colores del estado encendido. */
export const COLOR = {
  va: "bg-[#0f8a3c] text-crema",
  no: "bg-rojo text-crema",
  debe: "bg-sol text-tinta",
} as const;

export const APAGADO = "border-tinta/20 text-tinta/30";
