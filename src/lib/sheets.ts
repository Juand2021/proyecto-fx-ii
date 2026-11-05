import "server-only";
import { JWT } from "google-auth-library";
import { cargarCredenciales } from "./firebase";

// Cliente mínimo de Google Sheets (API v4) con la misma cuenta de servicio de Firebase.
// El Sheet debe estar compartido con el correo de esa cuenta como Editor.

const API = "https://sheets.googleapis.com/v4/spreadsheets";

export type Celda = string | number;

let cliente: JWT | undefined;

export function sheetConfigurado(): boolean {
  return Boolean(process.env.GOOGLE_SHEET_ID && process.env.FIREBASE_SERVICE_ACCOUNT);
}

function getCliente(): JWT {
  if (cliente) return cliente;
  const cred = cargarCredenciales();
  if (!cred) throw new Error("Falta FIREBASE_SERVICE_ACCOUNT");
  cliente = new JWT({
    email: cred.clientEmail,
    key: cred.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return cliente;
}

function idHoja(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("Falta GOOGLE_SHEET_ID");
  return id;
}

/**
 * Filas del rango (por ejemplo "Gastos!A2:E"). Por defecto los números llegan como número, sin formato;
 * con "FORMULA" las celdas con fórmula llegan como el texto de la fórmula.
 */
export async function leerFilas(
  rango: string,
  formato: "UNFORMATTED_VALUE" | "FORMULA" | "FORMATTED_VALUE" = "UNFORMATTED_VALUE",
): Promise<Celda[][]> {
  const url = `${API}/${idHoja()}/values/${encodeURIComponent(rango)}?valueRenderOption=${formato}`;
  const res = await getCliente().request<{ values?: Celda[][] }>({ url });
  return res.data.values ?? [];
}

/** Escribe varios bloques a la vez; los textos que empiezan con "=" se guardan como fórmulas. */
export async function escribirBloques(bloques: { range: string; values: Celda[][] }[]): Promise<void> {
  await getCliente().request({
    url: `${API}/${idHoja()}/values:batchUpdate`,
    method: "POST",
    data: { valueInputOption: "USER_ENTERED", data: bloques },
  });
}

/** Vacía el contenido (no el formato) de los rangos. */
export async function limpiarRangos(rangos: string[]): Promise<void> {
  await getCliente().request({ url: `${API}/${idHoja()}/values:batchClear`, method: "POST", data: { ranges: rangos } });
}

/**
 * Borra filas enteras de una pestaña. `filas` son índices desde 0 contando el encabezado
 * (la primera fila de datos es la 1); el encabezado (0) nunca se borra.
 * Se borra de abajo hacia arriba para que los índices no se corran entre sí.
 */
export async function borrarFilas(pestana: string, filas: number[]): Promise<void> {
  if (filas.some((f) => !Number.isInteger(f) || f < 1)) throw new Error("Índice de fila inválido");
  if (filas.length === 0) return;
  const meta = await getCliente().request<{ sheets: { properties: { title: string; sheetId: number } }[] }>({
    url: `${API}/${idHoja()}?fields=sheets.properties(title,sheetId)`,
  });
  const sheetId = meta.data.sheets.find((s) => s.properties.title === pestana)?.properties.sheetId;
  if (sheetId === undefined) throw new Error(`No existe la pestaña ${pestana}`);
  const requests = [...new Set(filas)]
    .sort((a, b) => b - a)
    .map((i) => ({ deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: i, endIndex: i + 1 } } }));
  await getCliente().request({ url: `${API}/${idHoja()}:batchUpdate`, method: "POST", data: { requests } });
}

/**
 * Agrega una fila al final de la tabla de esa pestaña (por ejemplo "Gastos!A:E").
 * Escribe en la primera fila libre (OVERWRITE) en vez de insertar una: insertar en una tabla vacía
 * empuja hacia abajo las fórmulas del Resumen y la fila nueva hereda el verde del encabezado.
 */
export async function agregarFila(rango: string, fila: Celda[]): Promise<void> {
  const url = `${API}/${idHoja()}/values/${encodeURIComponent(rango)}:append?valueInputOption=RAW&insertDataOption=OVERWRITE`;
  await getCliente().request({ url, method: "POST", data: { values: [fila] } });
}
