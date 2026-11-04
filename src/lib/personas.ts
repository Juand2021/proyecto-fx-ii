import "server-only";
import { firebaseConfigurado, getDb } from "./firebase";

export type Persona = {
  id: string;
  nombre: string;
  confirmo: boolean;
  pagoCupo: boolean; // los $50.000 del cupo
  orden: number;
};

type CambiosPersona = Partial<Pick<Persona, "nombre" | "confirmo" | "pagoCupo">>;

const COLECCION = "personas";

// Datos de prueba: se usan mientras Firebase no esté configurado (solo en memoria).
const demo: Persona[] = [
  { id: "demo-1", nombre: "Perdomo", confirmo: true, pagoCupo: true, orden: 1 },
  { id: "demo-2", nombre: "Juan", confirmo: true, pagoCupo: true, orden: 2 },
  { id: "demo-3", nombre: "El que siempre dice que sí", confirmo: true, pagoCupo: false, orden: 3 },
  { id: "demo-4", nombre: "El fantasma del grupo", confirmo: false, pagoCupo: false, orden: 4 },
];

export function modoDemo(): boolean {
  return !firebaseConfigurado();
}

export async function listarPersonas(): Promise<Persona[]> {
  if (modoDemo()) return [...demo].sort((a, b) => a.orden - b.orden);
  // Sin orderBy en la consulta: así también salen los documentos creados a mano
  // en la consola de Firebase aunque les falte algún campo.
  const snap = await getDb().collection(COLECCION).get();
  return snap.docs
    .map((d) => {
      const x = d.data();
      return {
        id: d.id,
        nombre: String(x.nombre ?? d.id),
        confirmo: x.confirmo === true,
        pagoCupo: x.pagoCupo === true,
        orden: typeof x.orden === "number" ? x.orden : Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, "es"));
}

export async function crearPersona(nombre: string): Promise<void> {
  const limpio = nombre.trim().slice(0, 60);
  if (!limpio) return;
  const orden = Date.now();
  if (modoDemo()) {
    demo.push({ id: `demo-${orden}`, nombre: limpio, confirmo: false, pagoCupo: false, orden });
    return;
  }
  await getDb().collection(COLECCION).add({ nombre: limpio, confirmo: false, pagoCupo: false, orden });
}

export async function actualizarPersona(id: string, cambios: CambiosPersona): Promise<void> {
  if (modoDemo()) {
    const p = demo.find((x) => x.id === id);
    if (p) Object.assign(p, cambios);
    return;
  }
  await getDb().collection(COLECCION).doc(id).update(cambios);
}

export async function eliminarPersona(id: string): Promise<void> {
  if (modoDemo()) {
    const i = demo.findIndex((x) => x.id === id);
    if (i >= 0) demo.splice(i, 1);
    return;
  }
  await getDb().collection(COLECCION).doc(id).delete();
}
