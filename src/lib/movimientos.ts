import "server-only";
import { type Cuentas, type Gasto, type Ingreso, calcularCuentas, fechaHoy } from "./finanzas";
import { listarPersonas, modoDemo } from "./personas";

export type NuevoIngreso = Pick<Ingreso, "persona" | "monto">;
export type NuevoGasto = Pick<Gasto, "motivo" | "monto" | "evidencia" | "registradoPor">;

// Datos de prueba: se usan mientras Firebase no esté configurado (solo en memoria).
const ingresosDemo: Ingreso[] = [
  { fecha: "2026-11-01", persona: "Perdomo", monto: 50_000 },
  { fecha: "2026-11-03", persona: "Perdomo", monto: 200_000 },
  { fecha: "2026-11-02", persona: "Juan", monto: 50_000 },
];
const gastosDemo: Gasto[] = [
  { fecha: "2026-11-04", motivo: "Mercado para el sancocho", monto: 120_000, evidencia: "", registradoPor: "Albert" },
];

function sinImplementar(): never {
  // T2 conecta el Google Sheet real aquí.
  throw new Error("Control de gastos: falta conectar el Google Sheet (T2)");
}

export async function obtenerCuentas(): Promise<Cuentas> {
  const personas = (await listarPersonas()).map((p) => p.nombre);
  if (modoDemo()) return calcularCuentas([...ingresosDemo], [...gastosDemo], personas);
  return sinImplementar();
}

export async function registrarIngreso(nuevo: NuevoIngreso): Promise<void> {
  if (modoDemo()) {
    ingresosDemo.push({ fecha: fechaHoy(), ...nuevo });
    return;
  }
  sinImplementar();
}

export async function registrarGasto(nuevo: NuevoGasto): Promise<void> {
  if (modoDemo()) {
    gastosDemo.push({ fecha: fechaHoy(), ...nuevo });
    return;
  }
  sinImplementar();
}
