import "server-only";
import { type Cuentas, type Gasto, type Ingreso, type Origen, calcularCuentas, esRegistrador, fechaHoy } from "./finanzas";
import { listarPersonas } from "./personas";
import { type Celda, agregarFila, borrarFilas, leerFilas, sheetConfigurado } from "./sheets";
import { VIAJE } from "./viaje";

export type NuevoIngreso = Pick<Ingreso, "persona" | "monto"> & { origen?: Origen };
export type NuevoGasto = Pick<Gasto, "motivo" | "monto" | "evidencia" | "registradoPor">;

// Pestañas del Sheet (las crea scripts/preparar-sheet.mjs). La fila 1 son los encabezados.
const INGRESOS = { leer: "Ingresos!A2:D", agregar: "Ingresos!A:D" };
const GASTOS = { leer: "Gastos!A2:E", agregar: "Gastos!A:E" };

// Datos de prueba: se usan mientras el Sheet no esté configurado (solo en memoria).
const ingresosDemo: Ingreso[] = [
  { fecha: "2026-11-01", persona: "Perdomo", monto: 50_000, origen: "Cupo" },
  { fecha: "2026-11-03", persona: "Perdomo", monto: 200_000, origen: "Abono" },
  { fecha: "2026-11-02", persona: "Juan", monto: 50_000, origen: "Cupo" },
];
const gastosDemo: Gasto[] = [
  { fecha: "2026-11-04", motivo: "Mercado para el sancocho", monto: 120_000, evidencia: "", registradoPor: "Albert" },
];

// Los datos de ejemplo son solo para desarrollo. En producción, sin Sheet configurado, es mejor mostrar
// un error que plata inventada: las páginas ya lo manejan con un aviso.
export function movimientosEnDemo(): boolean {
  return !sheetConfigurado() && process.env.NODE_ENV !== "production";
}

const texto = (c: Celda | undefined) => (c === undefined ? "" : String(c).trim());
const numero = (c: Celda | undefined) => (typeof c === "number" ? c : Number(texto(c).replace(/[^\d.-]/g, "")));

// Una fila a medias o mal escrita a mano en el Sheet se ignora, no tumba la página.
// Sin Origen (filas viejas o escritas a mano) cuenta como Abono: solo las filas "Cupo" se borran solas.
function aIngreso([fecha, persona, monto, origen]: Celda[]): Ingreso | null {
  const m = numero(monto);
  if (!texto(persona) || !Number.isFinite(m) || m <= 0) return null;
  return { fecha: texto(fecha), persona: texto(persona), monto: m, origen: texto(origen) === "Cupo" ? "Cupo" : "Abono" };
}

function aGasto([fecha, motivo, monto, evidencia, registradoPor]: Celda[]): Gasto | null {
  const m = numero(monto);
  const quien = texto(registradoPor);
  if (!texto(motivo) || !Number.isFinite(m) || m <= 0 || !esRegistrador(quien)) return null;
  return { fecha: texto(fecha), motivo: texto(motivo), monto: m, evidencia: texto(evidencia), registradoPor: quien };
}

const noNulo = <T>(x: T | null): x is T => x !== null;

/** ¿Esta fila de Ingresos es el cupo automático de esa persona? Exige Origen exactamente "Cupo". */
const esCupoDe = (persona: string) => (fila: Celda[]) => texto(fila[1]) === persona && texto(fila[3]) === "Cupo";

export async function obtenerCuentas(): Promise<Cuentas> {
  const personas = (await listarPersonas()).map((p) => p.nombre);
  if (movimientosEnDemo()) return calcularCuentas([...ingresosDemo], [...gastosDemo], personas);
  const [filasIngresos, filasGastos] = await Promise.all([leerFilas(INGRESOS.leer), leerFilas(GASTOS.leer)]);
  return calcularCuentas(filasIngresos.map(aIngreso).filter(noNulo), filasGastos.map(aGasto).filter(noNulo), personas);
}

export async function registrarIngreso(nuevo: NuevoIngreso): Promise<void> {
  const fecha = fechaHoy();
  const origen = nuevo.origen ?? "Abono";
  if (movimientosEnDemo()) {
    ingresosDemo.push({ fecha, persona: nuevo.persona, monto: nuevo.monto, origen });
    return;
  }
  await agregarFila(INGRESOS.agregar, [fecha, nuevo.persona, nuevo.monto, origen]);
}

/**
 * La persona pagó el cupo: agrega su fila de $50.000 (Origen "Cupo") si todavía no la tiene.
 * Es idempotente: pulsar dos veces no duplica. Devuelve true si agregó una fila.
 */
export async function asegurarCupo(persona: string): Promise<boolean> {
  persona = persona.trim(); // el Sheet se compara recortado; un nombre con espacios sobrantes nunca coincidiría
  if (movimientosEnDemo()) {
    if (ingresosDemo.some((i) => i.persona === persona && i.origen === "Cupo")) return false;
    ingresosDemo.push({ fecha: fechaHoy(), persona, monto: VIAJE.cupo, origen: "Cupo" });
    return true;
  }
  const filas = await leerFilas(INGRESOS.leer);
  if (filas.some(esCupoDe(persona))) return false;
  await agregarFila(INGRESOS.agregar, [fechaHoy(), persona, VIAJE.cupo, "Cupo"]);
  return true;
}

/**
 * La persona volvió a DEBE: borra su fila de cupo automático. Nunca toca abonos (Origen "Abono",
 * vacío o escrito a mano) ni filas de otras personas. Devuelve cuántas filas borró.
 */
export async function quitarCupo(persona: string): Promise<number> {
  persona = persona.trim();
  if (movimientosEnDemo()) {
    const antes = ingresosDemo.length;
    const quedan = ingresosDemo.filter((i) => !(i.persona === persona && i.origen === "Cupo"));
    ingresosDemo.splice(0, ingresosDemo.length, ...quedan);
    return antes - ingresosDemo.length;
  }
  const filas = await leerFilas(INGRESOS.leer);
  // Los datos empiezan en la fila 2 de la hoja, que es el índice 1 (el 0 es el encabezado).
  const indices = filas.flatMap((fila, i) => (esCupoDe(persona)(fila) ? [i + 1] : []));
  await borrarFilas("Ingresos", indices);
  return indices.length;
}

export async function registrarGasto(nuevo: NuevoGasto): Promise<void> {
  const fecha = fechaHoy();
  if (movimientosEnDemo()) {
    gastosDemo.push({ fecha, ...nuevo });
    return;
  }
  await agregarFila(GASTOS.agregar, [fecha, nuevo.motivo, nuevo.monto, nuevo.evidencia, nuevo.registradoPor]);
}
