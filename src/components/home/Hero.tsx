"use client";

import { useRef } from "react";
import { Countdown } from "@/components/Countdown";
import { MontanaAtras, MontanaFrente, Palmera, Sol } from "@/components/arte";
import { gsap, useGSAP } from "@/lib/gsap";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=220%", scrub: 0.6, pin: true },
      });
      tl.to(".h-titulo", { yPercent: -120, scale: 1.5, autoAlpha: 0, duration: 0.5 }, 0)
        .to(".h-cinta", { xPercent: 120, rotate: 20, duration: 0.4 }, 0)
        .to(".h-sol", { yPercent: 60, scale: 0.6, duration: 0.6 }, 0)
        .to(".h-mont-atras", { yPercent: 35, duration: 0.6 }, 0)
        .to(".h-mont-frente", { yPercent: 70, duration: 0.6 }, 0)
        .to(".h-palma-izq", { xPercent: -70, rotate: -18, duration: 0.6 }, 0)
        .to(".h-palma-der", { xPercent: 70, rotate: 18, duration: 0.6 }, 0)
        .to(".h-cuenta", { yPercent: 60, autoAlpha: 0, duration: 0.25 }, 0)
        .to(".h-baje", { autoAlpha: 0, duration: 0.1 }, 0)
        .fromTo(".h-piscina", { scale: 0 }, { scale: 14, duration: 0.55, ease: "power2.in" }, 0.3)
        .fromTo(".h-alagua", { autoAlpha: 0, scale: 0.5, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: -3, duration: 0.2 }, 0.8);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative h-svh overflow-hidden" style={{ background: "linear-gradient(180deg,#ffd23f 0%,#ff9a5a 45%,#ff4f8b 100%)" }}>
      <Sol className="h-sol absolute left-1/2 top-[9%] w-[52vmin] -translate-x-1/2 will-change-transform" />
      <MontanaAtras className="h-mont-atras absolute -left-[10%] bottom-0 h-[40%] w-[120%] will-change-transform" />
      <MontanaFrente className="h-mont-frente absolute -left-[10%] -bottom-[2%] h-[28%] w-[120%] will-change-transform" />
      <Palmera className="h-palma-izq absolute -left-[12%] -bottom-[3%] h-[62%] origin-bottom will-change-transform md:left-[2%]" />
      <Palmera
        className="h-palma-der absolute -right-[12%] -bottom-[3%] h-[55%] origin-bottom will-change-transform md:right-[2%]"
        style={{ scale: "-1 1" }}
      />

      <div className="h-titulo absolute inset-x-0 top-[24%] z-10 px-4 text-center will-change-transform">
        <p className="mb-2 inline-block rounded-full border-[3px] border-tinta bg-lima px-3 py-1 text-xs font-black tracking-widest text-tinta">
          UTADEO · INGENIERÍA · REUNIÓN DE EXALUMNOS DESADAPTADOS
        </p>
        <h1 className="letrero text-[17vw] leading-[0.85] text-crema md:text-[9rem]">
          Proyecto
          <br />
          <span className="text-sol">F(x) II</span>
        </h1>
      </div>
      <div className="h-cinta absolute left-1/2 top-[56%] z-10 -translate-x-1/2 -rotate-6 will-change-transform md:top-[60%]">
        <p className="whitespace-nowrap border-[4px] border-tinta bg-rosa px-5 py-2 font-display text-3xl text-crema sombra-dura md:text-5xl">
          El Reencuentro
        </p>
      </div>

      <div className="h-cuenta absolute left-1/2 top-[67%] z-10 w-[min(88vw,22rem)] -translate-x-1/2 rotate-1 rounded-2xl border-[4px] border-tinta bg-crema px-3 pb-2 pt-1.5 text-tinta sombra-dura will-change-transform md:top-[72%]">
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-rosa">La chiva sale en</p>
        <Countdown numero="text-3xl text-tinta md:text-4xl" />
      </div>

      <div className="h-baje absolute inset-x-0 bottom-[4%] z-10 flex flex-col items-center gap-1.5 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-crema [text-shadow:1px_1px_0_#151515]">
          Villeta · 14 al 17 de nov
        </p>
        <p className="flex animate-bounce items-center gap-2 rounded-full border-[3px] border-tinta bg-tinta/85 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-sol">
          baje, marica
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v15M5 12l7 7 7-7" />
          </svg>
        </p>
      </div>

      <div className="h-piscina absolute left-1/2 top-1/2 z-20 -ml-[10vmax] -mt-[10vmax] h-[20vmax] w-[20vmax] overflow-hidden rounded-full bg-agua will-change-transform">
        <div className="causticas" />
      </div>
      <p className="h-alagua letrero invisible absolute inset-x-0 top-[40%] z-30 text-center text-[16vw] leading-none text-sol md:text-[8rem]">
        ¡Al agua,
        <br />
        perros!
      </p>
    </section>
  );
}
