// Datos fijos del paseo. Cambiar aquí cambia toda la app.

export const VIAJE = {
  titulo: "Proyecto F(x) II",
  subtitulo: "El Reencuentro",
  universidad: "Universidad Jorge Tadeo Lozano",
  destino: "Finca en Villeta, Cundinamarca",
  // Hora de Colombia (UTC-5)
  salida: "2026-11-14T07:00:00-05:00",
  regreso: "2026-11-17T12:00:00-05:00",
  puntoSalida: "Bogotá",
  duracion: "4 días y 3 noches",
  costoTotal: 250_000,
  cupo: 50_000,
  // El resto (costoTotal - cupo) se paga el mismo sábado
  recaudador: "Perdomo",
  plan: "Finca, piscina y no hacer ni mierda",
} as const;

export function formatoPesos(valor: number): string {
  return `$${valor.toLocaleString("es-CO")}`;
}
