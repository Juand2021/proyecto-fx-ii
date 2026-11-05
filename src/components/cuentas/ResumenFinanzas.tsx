import { formatoPesos } from "@/lib/viaje";

type ResumenFinanzasProps = {
  totalIngresos: number;
  totalGastos: number;
  saldo: number;
};

export function ResumenFinanzas({ totalIngresos, totalGastos, saldo }: ResumenFinanzasProps) {
  const sheetId = process.env.GOOGLE_SHEET_ID ?? "";
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Saldo disponible destacado */}
      <div className="rounded-xl border-[3px] border-tinta bg-sol p-4 text-center sombra-dura">
        <p className="text-xs font-black uppercase tracking-wider text-tinta/80">Saldo disponible</p>
        <p className="font-display text-4xl sm:text-5xl tabular-nums text-tinta">{formatoPesos(saldo)}</p>
        <p className="mt-1 text-xs font-bold text-tinta/80">Plata disponible para gastar en el paseo</p>
      </div>

      {/* Total recaudado y Total gastado */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border-[3px] border-tinta bg-crema p-3 text-center">
          <p className="text-[11px] font-black uppercase tracking-wide text-tinta/70">Total recaudado</p>
          <p className="font-display text-2xl sm:text-3xl tabular-nums text-[#0f8a3c]">{formatoPesos(totalIngresos)}</p>
        </div>
        <div className="rounded-xl border-[3px] border-tinta bg-crema p-3 text-center">
          <p className="text-[11px] font-black uppercase tracking-wide text-tinta/70">Total gastado</p>
          <p className="font-display text-2xl sm:text-3xl tabular-nums text-rojo">{formatoPesos(totalGastos)}</p>
        </div>
      </div>

      {/* Botón Ver el Excel: solo si hay Sheet configurado */}
      {sheetId && (
        <div className="mt-1">
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-tinta bg-sol px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-tinta sombra-dura transition-transform hover:-rotate-1 active:translate-x-0.5 active:translate-y-0.5"
          >
            <span aria-hidden="true">📊</span>
            <span>Ver el Excel</span>
            <span className="text-xs">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}
