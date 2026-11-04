"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export type DatosRecuerdo = {
  src: string;
  ancho: number;
  alto: number;
  pie: string;
  nota: string;
};

// Fotos de recuerdo que aparecen entre secciones mientras se hace scroll.
export const RECUERDOS: DatosRecuerdo[] = [
  { src: "/recuerdos/parche-piscina.jpg", ancho: 1280, alto: 960, pie: "El parche en remojo", nota: "Nadie salió de la piscina en 6 horas" },
  { src: "/recuerdos/caido-cocina.jpg", ancho: 960, alto: 1280, pie: "Caído en combate", nota: "Cocina, 2 a.m. Iba por agua" },
  { src: "/recuerdos/piso-cama.jpg", ancho: 1280, alto: 960, pie: "El piso también es cama", nota: "Dijo que era la última. Mintió" },
  { src: "/recuerdos/dormida.jpg", ancho: 1280, alto: 960, pie: "Recargando pila", nota: "Pa' la segunda noche, obvio" },
  { src: "/recuerdos/salud.jpg", ancho: 1280, alto: 960, pie: "¡Salud, parceros!", nota: "Que se repita. Y se va a repetir" },
];

type Props = {
  n: number; // índice en RECUERDOS
  desde: string; // color de la sección de arriba
  hasta: string; // color de la sección de abajo
  lado?: "izq" | "der";
};

export function Recuerdo({ n, desde, hasta, lado = n % 2 ? "der" : "izq" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const r = RECUERDOS[n];
  const giro = lado === "izq" ? -1 : 1;
  const vertical = r.alto > r.ancho;

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top 90%", end: "bottom 10%", scrub: 0.6 },
      });
      // Entra girando desde un lado, se acomoda en el centro y sigue subiendo un poco
      tl.fromTo(
        ".r-foto",
        { xPercent: 45 * giro, yPercent: 30, rotate: 22 * giro, scale: 0.75 },
        { xPercent: 0, yPercent: 0, rotate: -4 * giro, scale: 1, duration: 0.45, ease: "power2.out" },
      )
        .fromTo(".r-flash", { opacity: 0.9 }, { opacity: 0, duration: 0.2 }, 0.3)
        .fromTo(".r-cinta", { scaleX: 0 }, { scaleX: 1, duration: 0.1 }, 0.42)
        .fromTo(".r-nota", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.45)
        .to(".r-foto", { yPercent: -12, rotate: -1 * giro, duration: 0.55 }, 0.45);
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="relative flex min-h-[90svh] items-center justify-center overflow-hidden px-6 py-16"
      style={{ background: `linear-gradient(180deg, ${desde} 0%, ${hasta} 100%)` }}
    >
      <figure
        className={`r-foto relative border-[4px] border-tinta bg-crema p-3 pb-4 text-tinta sombra-dura will-change-transform ${
          vertical ? "w-[min(72vw,320px)]" : "w-[min(86vw,420px)]"
        }`}
      >
        {/* cinta pegante */}
        <span
          className={`r-cinta absolute -top-4 left-1/2 z-10 h-8 w-28 -translate-x-1/2 border-2 border-tinta/30 bg-sol/80 ${
            lado === "izq" ? "rotate-3" : "-rotate-3"
          }`}
        />
        <span className="absolute -right-3 -top-3 z-10 rotate-12 rounded-full border-[3px] border-tinta bg-rosa px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-crema">
          Evidencia #{String(n + 1).padStart(2, "0")}
        </span>
        <div className="relative overflow-hidden border-[3px] border-tinta" style={{ aspectRatio: `${r.ancho} / ${r.alto}` }}>
          <Image src={r.src} alt={r.pie} fill sizes="(max-width: 640px) 86vw, 420px" className="object-cover" />
          <div className="r-flash pointer-events-none absolute inset-0 bg-white opacity-0" />
        </div>
        <figcaption className="mt-3 text-center font-display text-2xl leading-none">{r.pie}</figcaption>
      </figure>

      <p
        className={`r-nota absolute bottom-[8%] max-w-[70%] rounded-xl border-[3px] border-tinta bg-lima px-3 py-1.5 text-sm font-black leading-tight text-tinta sombra-dura ${
          lado === "izq" ? "right-5 rotate-2 text-right" : "left-5 -rotate-2"
        }`}
      >
        {r.nota}
      </p>
    </div>
  );
}
