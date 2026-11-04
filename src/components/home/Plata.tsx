"use client";

import { useRef } from "react";
import { VIAJE, formatoPesos } from "@/lib/viaje";
import { gsap, useGSAP } from "@/lib/gsap";

export function Plata() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".p-num").forEach((el) => {
        const fin = Number(el.dataset.valor);
        const o = { v: 0 };
        gsap.to(o, {
          v: fin,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = formatoPesos(Math.round(o.v / 1000) * 1000);
          },
        });
      });
      gsap.fromTo(
        ".p-barra > div",
        { scaleX: 0 },
        {
          scaleX: 1,
          stagger: 0.3,
          ease: "none",
          scrollTrigger: { trigger: ".p-barra", start: "top 85%", end: "top 40%", scrub: 0.5 },
        },
      );
      gsap.fromTo(
        ".p-sello",
        { scale: 2.5, rotate: 25, autoAlpha: 0 },
        { scale: 1, rotate: -10, autoAlpha: 1, ease: "back.out(2.2)", duration: 0.6, scrollTrigger: { trigger: ".p-sello", start: "top 80%" } },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-rosa px-5 py-24 text-tinta">
      <div className="mx-auto max-w-lg">
        <h2 className="letrero text-5xl text-crema md:text-7xl">Hablemos de plata</h2>
        <p className="mt-3 text-xl font-bold text-crema">Porque esto no es gratis, mi amor.</p>

        <div className="mt-8 rounded-3xl border-[4px] border-tinta bg-crema p-5 sombra-dura">
          <p className="text-xs font-black uppercase tracking-widest">Total por cabeza</p>
          <p className="p-num font-display text-6xl tabular-nums leading-none md:text-7xl" data-valor={VIAJE.costoTotal}>
            $0
          </p>

          <div className="p-barra mt-5 flex h-10 overflow-hidden rounded-full border-[4px] border-tinta">
            <div className="flex w-1/5 origin-left items-center justify-center bg-lima text-xs font-black">CUPO</div>
            <div className="flex w-4/5 origin-left items-center justify-center bg-sol text-xs font-black">EL SÁBADO</div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border-[3px] border-tinta bg-lima p-3">
              <p className="text-xs font-black uppercase">Cupo, ya mismo</p>
              <p className="p-num font-display text-3xl tabular-nums" data-valor={VIAJE.cupo}>
                $0
              </p>
            </div>
            <div className="rounded-2xl border-[3px] border-tinta bg-sol p-3">
              <p className="text-xs font-black uppercase">El resto, el sábado</p>
              <p className="p-num font-display text-3xl tabular-nums" data-valor={VIAJE.costoTotal - VIAJE.cupo}>
                $0
              </p>
            </div>
          </div>
          <p className="mt-5 text-lg font-bold leading-snug">
            El cupo se le transfiere a <b className="text-rosa">{VIAJE.recaudador}</b> antes del sábado. El que no pague no se sube a la chiva,
            gonorrea. Sin excepciones, sin &quot;te pago el lunes&quot;.
          </p>
        </div>

        <div className="mt-10 flex justify-end">
          <p className="p-sello invisible border-[5px] border-tinta bg-sol px-5 py-3 text-center font-display text-3xl leading-none sombra-dura">
            Perdomo
            <br />
            <span className="text-base font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-archivo)" }}>
              único con autoridad moral
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
