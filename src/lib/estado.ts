// Estado de cada persona, a partir de los dos campos guardados en Firestore.
//   va   → confirmó y pagó el cupo   (verde)
//   debe → confirmó pero no ha pagado (amarillo)
//   no   → no va                      (rojo)

export type Estado = "va" | "debe" | "no";

export const ESTADOS: { id: Estado; etiqueta: string }[] = [
  { id: "va", etiqueta: "VA" },
  { id: "no", etiqueta: "NO VA" },
  { id: "debe", etiqueta: "DEBE" },
];

export function estadoDe(p: { confirmo: boolean; pagoCupo: boolean }): Estado {
  if (!p.confirmo) return "no";
  return p.pagoCupo ? "va" : "debe";
}

export function camposDe(e: Estado): { confirmo: boolean; pagoCupo: boolean } {
  if (e === "va") return { confirmo: true, pagoCupo: true };
  if (e === "debe") return { confirmo: true, pagoCupo: false };
  return { confirmo: false, pagoCupo: false };
}

export function esEstado(v: unknown): v is Estado {
  return v === "va" || v === "debe" || v === "no";
}

/** Colores: fondo y texto para el estado activo. */
export const COLOR: Record<Estado, string> = {
  va: "bg-[#0f8a3c] text-crema",
  debe: "bg-sol text-tinta",
  no: "bg-rojo text-crema",
};
