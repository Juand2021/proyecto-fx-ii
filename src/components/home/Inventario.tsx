"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Escena } from "./escena3d";

const CARTAS = [
  { t: "Poker", d: "Uniendo amigos desde 1929. Destruyendo hígados desde el sábado.", bg: "bg-sol" },
  { t: "Néctar Club", d: "Sin azúcar, porque nos cuidamos. Mínimo una caja por cabeza, no sea tacaño.", bg: "bg-lima" },
  { t: "Smirnoff", d: "De tamarindo picante, para el que se las da de fino. Igual termina tomando guaro.", bg: "bg-rosa" },
  { t: "Agua", d: "Para disimular. Nadie la va a tomar.", bg: "bg-agua" },
  { t: "Dignidad", d: "Se queda en Bogotá. No hay cupo para ella.", bg: "bg-crema" },
];

export function Inventario() {
  const ref = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const escena = useRef<Escena | null>(null);
  const progreso = useRef(0);

  // three.js se descarga solo cuando la sección está por aparecer
  useEffect(() => {
    let vivo = true;
    let creada: Escena | null = null;
    const obs = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting) || creada || !canvas.current) return;
        obs.disconnect();
        import("./escena3d").then((m) => {
          if (!vivo || !canvas.current) return;
          try {
            creada = m.crearEscena(canvas.current);
            escena.current = creada;
            creada.dibujar(progreso.current);
          } catch {
            // sin WebGL: la sección queda con las cartas
          }
        });
      },
      { rootMargin: "100% 0px" },
    );
    if (ref.current) obs.observe(ref.current);
    return () => {
      vivo = false;
      obs.disconnect();
      creada?.destruir();
      escena.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const giro = { p: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=320%", scrub: 0.6, pin: true },
      });
      tl.to(
        giro,
        {
          p: 1,
          duration: 1,
          onUpdate: () => {
            progreso.current = giro.p;
            escena.current?.dibujar(giro.p);
          },
        },
        0,
      ).fromTo(".i-titulo", { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.12 }, 0);
      gsap.utils.toArray<HTMLElement>(".i-carta").forEach((c, i) => {
        tl.fromTo(
          c,
          { rotateY: -100, yPercent: 60, autoAlpha: 0, rotate: 0 },
          { rotateY: 0, yPercent: 0, autoAlpha: 1, rotate: i % 2 ? 4 : -4, duration: 0.14, ease: "power2.out" },
          0.18 + i * 0.16,
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative h-svh overflow-hidden bg-selva">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(#c4f135 2px,transparent 2px)", backgroundSize: "26px 26px" }}
      />
      {/* luz de vitrina detrás de los productos */}
      <div
        className="absolute inset-x-0 top-[14%] h-[52%]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 55%, #c4f13555, transparent 70%)" }}
      />
      <h2 className="i-titulo letrero absolute inset-x-0 top-20 z-10 text-center text-5xl text-lima md:text-7xl">
        Inventario oficial
      </h2>

      <canvas ref={canvas} className="absolute inset-x-0 top-[15%] h-[54%] w-full" aria-label="Poker, Néctar Club y Smirnoff girando" />

      <div className="absolute inset-x-0 bottom-[5%] flex justify-center px-5 [perspective:1000px]">
        <div className="relative h-36 w-full max-w-sm">
          {CARTAS.map((c) => (
            <div
              key={c.t}
              className={`i-carta invisible absolute inset-0 rounded-3xl border-[4px] border-tinta p-4 text-tinta sombra-dura will-change-transform ${c.bg}`}
            >
              <p className="font-display text-4xl leading-none">{c.t}</p>
              <p className="mt-2 text-lg font-bold leading-snug">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
