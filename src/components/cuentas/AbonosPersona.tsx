import type { AbonoPersona } from "@/lib/finanzas";
import { VIAJE, formatoPesos } from "@/lib/viaje";

type AbonosPersonaProps = {
  porPersona: AbonoPersona[];
};

export function AbonosPersona({ porPersona }: AbonosPersonaProps) {
  if (porPersona.length === 0) {
    return (
      <p className="py-4 text-center text-sm font-bold text-tinta/70">
        Todavía no hay abonos registrados.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-bold text-tinta/70">
        Meta: {formatoPesos(VIAJE.costoTotal)} por persona para el viaje completo.
      </p>
      <ul className="divide-y-2 divide-tinta/15">
        {porPersona.map((p) => (
          <li
            key={p.persona}
            className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-base font-bold leading-tight">{p.persona}</span>
              {p.completo ? (
                <span className="rounded-md border-[2.5px] border-tinta bg-[#0f8a3c] px-2 py-0.5 text-[10px] font-black uppercase text-crema sombra-estado">
                  COMPLETO
                </span>
              ) : (
                <span className="rounded-md border-[2.5px] border-tinta bg-sol px-2 py-0.5 text-[10px] font-black uppercase text-tinta sombra-estado">
                  DEBE
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-semibold text-tinta/80">
              <span>
                Abonado:{" "}
                <strong className="font-black tabular-nums text-[#0f8a3c]">
                  {formatoPesos(p.abonado)}
                </strong>
              </span>
              <span>
                Falta:{" "}
                <strong
                  className={`font-black tabular-nums ${p.falta > 0 ? "text-rojo" : "text-tinta/50"}`}
                >
                  {formatoPesos(p.falta)}
                </strong>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
