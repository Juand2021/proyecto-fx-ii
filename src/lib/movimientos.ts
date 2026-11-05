import "server-only";
import { type Cuentas, type Gasto, type Ingreso, calcularCuentas, esRegistrador, fechaHoy } from "./finanzas";
import { listarPersonas } from "./personas";
import { type Celda, agregarFila, leerFilas, sheetConfigurado } from "./sheets";

export type NuevoIngreso = Pick<Ingreso, "persona" | "monto">;
export type NuevoGasto = Pick<Gasto, "motivo" | "monto" | "evidencia" | "registradoPor">;

// Pestañas del Sheet (las crea scripts/preparar-sheet.mjs). La fila 1 son los encabezados.
const INGRESOS = { leer: "Ingresos!A2:C", agregar: "Ingresos!A:C" };
const GASTOS = { leer: "Gastos!A2:E", agregar: "Gastos!A:E" };

// Datos de prueba: se usan mientras el Sheet no esté configurado (solo en memoria).
const ingresosDemo: Ingreso[] = [
  { fecha: "2026-11-01", persona: "Perdomo", monto: 50_000 },
  { fecha: "2026-11-03", persona: "Perdomo", monto: 200_000 },
  { fecha: "2026-11-02", persona: "Juan", monto: 50_000 },
];
const gastosDemo: Gasto[] = [
  { fecha: "2026-11-04", motivo: "Mercado para el sancocho", monto: 120_000, evidencia: "", registradoPor: "Albert" },
];

export function movimientosEnDemo(): boolean {
  return !sheetConfigurado();
}

const texto = (c: Celda | undefined) => (c === undefined ? "" : String(c).trim());
const numero = (c: Celda | undefined) => (typeof c === "number" ? c : Number(texto(c).replace(/[^\d.-]/g, "")));

// Una fila a medias o mal escrita a mano en el Sheet se ignora, no tumba la página.
function aIngreso([fecha, persona, monto]: Celda[]): Ingreso | null {
  const m = numero(monto);
  if (!texto(persona) || !Number.isFinite(m) || m <= 0) return null;
  return { fecha: texto(fecha), persona: texto(persona), monto: m };
}

function aGasto([fecha, motivo, monto, evidencia, registradoPor]: Celda[]): Gasto | null {
  const m = numero(monto);
  const quien = texto(registradoPor);
  if (!texto(motivo) || !Number.isFinite(m) || m <= 0 || !esRegistrador(quien)) return null;
  return { fecha: texto(fecha), motivo: texto(motivo), monto: m, evidencia: texto(evidencia), registradoPor: quien };
}

const noNulo = <T>(x: T | null): x is T => x !== null;

export async function obtenerCuentas(): Promise<Cuentas> {
  const personas = (await listarPersonas()).map((p) => p.nombre);
  if (movimientosEnDemo()) return calcularCuentas([...ingresosDemo], [...gastosDemo], personas);
  const [filasIngresos, filasGastos] = await Promise.all([leerFilas(INGRESOS.leer), leerFilas(GASTOS.leer)]);
  return calcularCuentas(filasIngresos.map(aIngreso).filter(noNulo), filasGastos.map(aGasto).filter(noNulo), personas);
}

export async function registrarIngreso(nuevo: NuevoIngreso): Promise<void> {
  const fecha = fechaHoy();
  if (movimientosEnDemo()) {
    ingresosDemo.push({ fecha, ...nuevo });
    return;
  }
  await agregarFila(INGRESOS.agregar, [fecha, nuevo.persona, nuevo.monto]);
}

export async function registrarGasto(nuevo: NuevoGasto): Promise<void> {
  const fecha = fechaHoy();
  if (movimientosEnDemo()) {
    gastosDemo.push({ fecha, ...nuevo });
    return;
  }
  await agregarFila(GASTOS.agregar, [fecha, nuevo.motivo, nuevo.monto, nuevo.evidencia, nuevo.registradoPor]);
}
