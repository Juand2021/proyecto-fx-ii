// Tipos y cálculos del control de gastos. Sin acceso a datos: se puede usar en servidor y cliente.
// Los movimientos viven en un Google Sheet (ver movimientos.ts); aquí solo se calculan los totales.

import { VIAJE } from "./viaje";

/** Quiénes pueden registrar gastos (solo gastos; los ingresos eligen a la persona que pagó). */
export const REGISTRADORES = ["Juan Diego", "Albert"] as const;
export type Registrador = (typeof REGISTRADORES)[number];

export function esRegistrador(v: unknown): v is Registrador {
  return REGISTRADORES.some((r) => r === v);
}

export type Ingreso = {
  fecha: string; // YYYY-MM-DD, hora de Colombia
  persona: string;
  monto: number; // pesos colombianos
};

export type Gasto = {
  fecha: string;
  motivo: string;
  monto: number;
  evidencia: string; // link a la foto ("" si no hay)
  registradoPor: Registrador;
};

export type AbonoPersona = {
  persona: string;
  abonado: number;
  falta: number; // lo que le queda para llegar a la meta
  completo: boolean;
};

export type Cuentas = {
  ingresos: Ingreso[];
  gastos: Gasto[];
  porPersona: AbonoPersona[];
  totalIngresos: number;
  totalGastos: number;
  saldo: number; // plata disponible para gastar: ingresos − gastos
};

const suma = (xs: { monto: number }[]) => xs.reduce((t, x) => t + x.monto, 0);

/**
 * Totales por persona (todas las de la lista, aunque no hayan abonado, más cualquier nombre
 * que aparezca en un ingreso) y saldo general. La lista sale en orden alfabético.
 */
export function calcularCuentas(
  ingresos: Ingreso[],
  gastos: Gasto[],
  personas: string[],
  meta: number = VIAJE.costoTotal,
): Cuentas {
  const abonado = new Map<string, number>(personas.map((p) => [p, 0]));
  for (const i of ingresos) abonado.set(i.persona, (abonado.get(i.persona) ?? 0) + i.monto);

  const porPersona = [...abonado]
    .map(([persona, total]) => ({
      persona,
      abonado: total,
      falta: Math.max(0, meta - total),
      completo: total >= meta,
    }))
    .sort((a, b) => a.persona.localeCompare(b.persona, "es", { sensitivity: "base" }));

  const totalIngresos = suma(ingresos);
  const totalGastos = suma(gastos);
  return { ingresos, gastos, porPersona, totalIngresos, totalGastos, saldo: totalIngresos - totalGastos };
}

/** Convierte lo que escribe el admin ("50.000", "$ 50000") en pesos enteros; null si no es válido. */
export function parsearPesos(v: unknown): number | null {
  const digitos = String(v ?? "").replace(/[^\d]/g, "");
  if (!digitos) return null;
  const n = Number(digitos);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

/** Fecha de hoy en Colombia (YYYY-MM-DD), sin depender de la zona horaria del servidor. */
export function fechaHoy(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
}
