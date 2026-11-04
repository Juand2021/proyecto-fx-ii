"use client";

import { useEffect, useState } from "react";
import { VIAJE } from "@/lib/viaje";

const SALIDA = new Date(VIAJE.salida).getTime();

function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    seg: s % 60,
  };
}

const dos = (n: number) => String(n).padStart(2, "0");

export function Countdown({ className = "", numero = "" }: { className?: string; numero?: string }) {
  // null en el servidor para no generar diferencias de hidratación
  const [ahora, setAhora] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setAhora(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const p = ahora === null ? null : partes(SALIDA - ahora);
  const celdas = [
    { v: p ? String(p.dias) : "--", l: "días" },
    { v: p ? dos(p.horas) : "--", l: "horas" },
    { v: p ? dos(p.min) : "--", l: "min" },
    { v: p ? dos(p.seg) : "--", l: "seg" },
  ];

  if (p && SALIDA - (ahora ?? 0) <= 0) {
    return <p className={`font-display text-3xl ${numero}`}>¡Ya arrancamos, hijueputa!</p>;
  }

  return (
    <div className={`grid grid-cols-4 gap-2 text-center ${className}`} aria-label="Cuenta regresiva para la salida">
      {celdas.map((c) => (
        <div key={c.l}>
          <b className={`block font-display tabular-nums leading-none ${numero}`}>{c.v}</b>
          <span className="text-[11px] font-black uppercase tracking-widest">{c.l}</span>
        </div>
      ))}
    </div>
  );
}
