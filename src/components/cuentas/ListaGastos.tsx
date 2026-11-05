import type { Gasto } from "@/lib/finanzas";
import { formatoPesos } from "@/lib/viaje";

type ListaGastosProps = {
  gastos: Gasto[];
};

export function ListaGastos({ gastos }: ListaGastosProps) {
  if (gastos.length === 0) {
    return (
      <p className="py-4 text-center text-sm font-bold text-tinta/70">
        No hay gastos registrados todavía.
      </p>
    );
  }

  return (
    <ul className="divide-y-2 divide-tinta/15">
      {gastos.map((g, idx) => (
        <li key={`${g.fecha}-${g.motivo}-${idx}`} className="py-3 first:pt-0 last:pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold leading-snug">{g.motivo}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-tinta/70">
                <span>📅 {g.fecha}</span>
                <span>•</span>
                <span>
                  Registrado por: <strong className="font-bold text-tinta">{g.registradoPor}</strong>
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1 text-right">
              <span className="font-display text-xl tabular-nums text-rojo">
                {formatoPesos(g.monto)}
              </span>
              {g.evidencia ? (
                <a
                  href={g.evidencia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded border-2 border-tinta bg-sol px-2 py-0.5 text-[10px] font-black uppercase text-tinta sombra-estado transition-transform hover:-rotate-1 active:translate-y-0.5"
                >
                  <span>Evidencia</span>
                  <span className="text-[9px]">↗</span>
                </a>
              ) : (
                <span className="text-[10px] font-semibold text-tinta/40">Sin evidencia</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
