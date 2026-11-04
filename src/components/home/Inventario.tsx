"use client";

import { useRef } from "react";
import { Botella, Lata3D } from "@/components/arte";
import { gsap, useGSAP } from "@/lib/gsap";

const CARTAS = [
  { t: "Águila", d: "Las que aguante el hígado. Y una más.", bg: "bg-sol" },
  { t: "Néctar", d: "Mínimo una caja. No sea tacaño, que el guaro no se comparte solo.", bg: "bg-rosa" },
  { t: "Agua", d: "Para disimular. Nadie la va a tomar.", bg: "bg-agua" },
  { t: "Dignidad", d: "Se queda en Bogotá. No hay cupo para ella.", bg: "bg-lima" },
];

export function Inventario() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=280%", scrub: 0.6, pin: true },
      });
      tl.fromTo(".i-lata", { rotateY: 0, rotateX: 12 }, { rotateY: 900, rotateX: -12, duration: 1 }, 0)
        .fromTo(".i-lata-wrap", { scale: 0.4, yPercent: 40 }, { scale: 1, yPercent: 0, duration: 0.3, ease: "back.out(1.6)" }, 0)
        .fromTo(".i-botella", { xPercent: -160, rotate: -40 }, { xPercent: 0, rotate: -14, duration: 0.3 }, 0.1)
        .fromTo(".i-titulo", { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.15 }, 0);
      gsap.utils.toArray<HTMLElement>(".i-carta").forEach((c, i) => {
        tl.fromTo(
          c,
          { rotateY: -100, yPercent: 60, autoAlpha: 0, rotate: 0 },
          { rotateY: 0, yPercent: 0, autoAlpha: 1, rotate: i % 2 ? 4 : -4, duration: 0.18, ease: "power2.out" },
          0.25 + i * 0.18,
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
      <h2 className="i-titulo letrero absolute inset-x-0 top-20 z-10 text-center text-5xl text-lima md:text-7xl">
        Inventario oficial
      </h2>

      <div className="absolute inset-x-0 top-[22%] flex justify-center [perspective:900px]">
        <div className="i-lata-wrap will-change-transform">
          <div className="i-lata will-change-transform [transform-style:preserve-3d]">
            <Lata3D className="scale-[0.8] md:scale-100" />
          </div>
        </div>
      </div>
      <Botella className="i-botella absolute left-[4%] top-[26%] w-[22vw] max-w-[120px] will-change-transform md:left-[20%]" />

      <div className="absolute inset-x-0 bottom-[6%] flex justify-center px-5 [perspective:1000px]">
        <div className="relative h-40 w-full max-w-sm">
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
