"use client";

import { useRef } from "react";
import { Flotador } from "@/components/arte";
import { gsap, useGSAP } from "@/lib/gsap";

// [texto, resaltar]
const FRASES: [string, boolean][] = [
  ["Años", false], ["de", false], ["parciales,", false], ["trasnochos", false], ["y", false],
  ["profes", false], ["de", false], ["cálculo", false], ["que", false], ["nos", false],
  ["cagaron", true], ["la", true], ["vida.", true],
  ["Hoy", false], ["volvemos.", false], ["Sin", false], ["tesis.", false], ["Sin", false], ["jefe.", false],
  ["Sin", false], ["novia", false], ["que", false], ["pregunte.", false],
  ["Con", false], ["piscina,", true], ["Águila", true], ["y", true], ["guaro.", true],
];

export function Manifiesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=160%", scrub: 0.5, pin: true },
      });
      tl.to(".m-palabra", { opacity: 1, stagger: 0.05, duration: 0.2 }, 0)
        .fromTo(".m-flotador", { xPercent: -60, rotate: 0 }, { xPercent: 260, rotate: 540, duration: 1.6 }, 0)
        .fromTo(".m-sello", { scale: 3, autoAlpha: 0, rotate: 20 }, { scale: 1, autoAlpha: 1, rotate: -8, duration: 0.25, ease: "back.out(2)" }, 1.4);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative flex h-svh items-center overflow-hidden bg-agua">
      <div className="causticas" />
      <div className="causticas b" />
      <div className="m-flotador absolute left-0 top-16 w-28 will-change-transform md:w-40">
        <Flotador className="w-full" />
      </div>
      <div className="relative mx-auto max-w-4xl px-5">
        <p className="text-[2.15rem] font-black leading-[1.08] text-selva md:text-6xl">
          {FRASES.map(([t, r], i) => (
            <span key={i} className={`m-palabra inline opacity-15 ${r ? "text-rosa" : ""}`}>
              {t}{" "}
            </span>
          ))}
        </p>
        <p className="m-sello invisible mt-6 inline-block border-[4px] border-tinta bg-sol px-4 py-2 font-display text-2xl text-tinta sombra-dura md:text-4xl">
          Así es, ingenieros.
        </p>
      </div>
    </section>
  );
}
