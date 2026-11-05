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

/** Filas del rango (por ejemplo "Gastos!A2:E"). Los números llegan como número, sin formato. */
export async function leerFilas(rango: string): Promise<Celda[][]> {
  const url = `${API}/${idHoja()}/values/${encodeURIComponent(rango)}?valueRenderOption=UNFORMATTED_VALUE`;
  const res = await getCliente().request<{ values?: Celda[][] }>({ url });
  return res.data.values ?? [];
}

/** Agrega una fila al final de la tabla de esa pestaña (por ejemplo "Gastos!A:E"). */
export async function agregarFila(rango: string, fila: Celda[]): Promise<void> {
  const url = `${API}/${idHoja()}/values/${encodeURIComponent(rango)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  await getCliente().request({ url, method: "POST", data: { values: [fila] } });
}
