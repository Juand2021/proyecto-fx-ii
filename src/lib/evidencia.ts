import "server-only";
import { firebaseConfigurado, getDb } from "./firebase";

// Fotos de evidencia de los gastos. Se guardan comprimidas en Firestore (colección `evidencias`)
// y se sirven desde /evidencia/[id]; el Sheet guarda ese link. Sin Storage, sin costo extra.

const COLECCION = "evidencias";

/** Tope por foto. Firestore permite 1 MiB por documento; la foto ya llega achicada desde el navegador. */
export const MAX_BYTES = 700 * 1024;
const TIPOS = ["image/jpeg", "image/png", "image/webp"] as const;

export type Evidencia = { mime: string; bytes: Buffer };

// Datos de prueba: se usan mientras Firebase no esté configurado (solo en memoria).
const demo = new Map<string, Evidencia>();

export function esTipoValido(mime: string): boolean {
  return TIPOS.some((t) => t === mime);
}

/** Guarda la foto y devuelve su id. */
export async function guardarEvidencia(ev: Evidencia): Promise<string> {
  if (!esTipoValido(ev.mime)) throw new Error("La evidencia debe ser una imagen JPG, PNG o WebP");
  if (ev.bytes.length === 0 || ev.bytes.length > MAX_BYTES) throw new Error("La foto es demasiado grande");
  if (!firebaseConfigurado()) {
    const id = `demo-${Date.now()}`;
    demo.set(id, ev);
    return id;
  }
  const ref = await getDb().collection(COLECCION).add({ mime: ev.mime, datos: ev.bytes, creada: Date.now() });
  return ref.id;
}

export async function leerEvidencia(id: string): Promise<Evidencia | null> {
  if (!firebaseConfigurado()) return demo.get(id) ?? null;
  const doc = await getDb().collection(COLECCION).doc(id).get();
  const x = doc.data();
  if (!x || typeof x.mime !== "string" || !x.datos) return null;
  return { mime: x.mime, bytes: Buffer.from(x.datos) };
}

/** Link absoluto a la foto, el que se escribe en la columna Evidencia del Sheet. */
export function urlEvidencia(id: string): string {
  const base =
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  return `${base.replace(/\/$/, "")}/evidencia/${id}`;
}
