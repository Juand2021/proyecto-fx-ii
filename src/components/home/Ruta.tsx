"use client";

import { useRef } from "react";
import { Chiva, Palmera, Sol } from "@/components/arte";
import { gsap, useGSAP } from "@/lib/gsap";

const PARADAS = [
  {
    hora: "Sáb · 7:00 a.m.",
    titulo: "Bogotá",
    texto: "Frío hijueputa, ruana, tinto y el guayabo de nervios. Si llega tarde, la chiva no espera.",
    color: "text-crema",
  },
  {
    hora: "Sáb · 8:30 a.m.",
    titulo: "La bajada",
    texto: "Curvas, mareo y la primera Águila en La Vega. El que vomite en la chiva paga la lavada.",
    color: "text-sol",
  },
  {
    hora: "Sáb · 10:00 a.m.",
    titulo: "Villeta",
    texto: "Treinta y pico grados. Quítese esa chaqueta, cachaco, que aquí se viene es a sudar guaro.",
    color: "text-tinta",
  },
];

export function Ruta() {
  const ref = useRef<HTMLElement>(null);
  const temp = useRef<HTMLSpanElement>(null);
  const alt = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const datos = { t: 14, a: 2600 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=320%", scrub: 0.7, pin: true },
      });
      tl.to(".r-pista", { xPercent: -66.666, duration: 1 }, 0)
        .to(".r-calor", { opacity: 1, duration: 1 }, 0)
        .to(".r-frio", { opacity: 0, duration: 0.5 }, 0.2)
        .to(".rueda", { rotate: 1440, transformOrigin: "50% 50%", duration: 1 }, 0)
        .to(".r-camino", { xPercent: -50, duration: 1 }, 0)
        .fromTo(".r-sol", { yPercent: 120, scale: 0.5 }, { yPercent: 0, scale: 1, duration: 0.5 }, 0.5)
        .fromTo(".r-palma", { yPercent: 100 }, { yPercent: 0, stagger: 0.08, duration: 0.3 }, 0.6)
        .to(
          datos,
          {
            t: 32,
            a: 842,
            duration: 1,
            onUpdate: () => {
              if (temp.current) temp.current.textContent = `${Math.round(datos.t)}°C`;
              if (alt.current) alt.current.textContent = `${Math.round(datos.a).toLocaleString("es-CO")} m`;
            },
          },
          0,
        );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative h-svh overflow-hidden" style={{ background: "#5d7f93" }}>
      {/* cielo: frío → calor (solo cambia la opacidad) */}
      <div className="r-calor absolute inset-0 opacity-0" style={{ background: "linear-gradient(180deg,#ffd23f,#ff7a00 70%)" }} />
      <div className="r-frio pointer-events-none absolute inset-0">
        {[12, 30, 55, 75].map((l, i) => (
          <div
            key={l}
            className="absolute h-10 w-36 rounded-full border-[3px] border-tinta bg-crema/90"
            style={{ left: `${l}%`, top: `${14 + (i % 2) * 12}%` }}
          />
        ))}
      </div>
      <Sol className="r-sol absolute right-[6%] top-[12%] w-[30vmin] will-change-transform" />
      <div className="absolute bottom-[14%] left-0 right-0 flex justify-around">
        {[0, 1, 2, 3].map((i) => (
          <Palmera key={i} className="r-palma h-[26vh] will-change-transform" />
        ))}
      </div>

      {/* tablero */}
      <div className="absolute left-1/2 top-20 z-20 flex -translate-x-1/2 gap-2">
        <div className="rounded-xl border-[3px] border-tinta bg-crema px-3 py-1 text-center text-tinta sombra-dura">
          <span className="block text-[10px] font-black uppercase tracking-widest">Temperatura</span>
          <span ref={temp} className="font-display text-2xl tabular-nums">14°C</span>
        </div>
        <div className="rounded-xl border-[3px] border-tinta bg-crema px-3 py-1 text-center text-tinta sombra-dura">
          <span className="block text-[10px] font-black uppercase tracking-widest">Altura</span>
          <span ref={alt} className="font-display text-2xl tabular-nums">2.600 m</span>
        </div>
      </div>

      {/* paradas: pista horizontal */}
      <div className="r-pista absolute inset-y-0 left-0 z-10 flex w-[300vw] will-change-transform">
        {PARADAS.map((p) => (
          <div key={p.titulo} className="flex w-screen items-center px-6 pb-[30vh] pt-36 md:px-[12vw]">
            <div>
              <p className="inline-block rounded-full border-[3px] border-tinta bg-lima px-3 py-1 text-xs font-black uppercase tracking-widest text-tinta">
                {p.hora}
              </p>
              <h2 className={`letrero mt-2 text-[18vw] leading-none md:text-9xl ${p.color}`}>{p.titulo}</h2>
              <p className="mt-3 max-w-md rounded-2xl border-[3px] border-tinta bg-crema p-4 text-lg font-bold leading-snug text-tinta sombra-dura">
                {p.texto}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* carretera y chiva */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[16%] border-t-[5px] border-tinta bg-[#3a3a3a]">
        <div
          className="r-camino absolute top-1/2 h-2 w-[200%] -translate-y-1/2 will-change-transform"
          style={{ background: "repeating-linear-gradient(90deg,#ffd23f 0 60px,transparent 60px 110px)" }}
        />
      </div>
      <Chiva className="absolute bottom-[10%] left-1/2 z-20 w-[min(62vw,340px)] -translate-x-1/2" />
    </section>
  );
}
