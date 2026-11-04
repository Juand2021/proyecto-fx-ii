"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const DIAS = [
  {
    dia: "Sábado 14",
    titulo: "Llegada y primer guaro",
    texto: "Salimos 7 a.m. Llegamos, tiramos las maletas y al agua. El primer aguardiente a las 10 a.m., como Dios manda.",
    bg: "bg-lima",
  },
  {
    dia: "Domingo 15",
    titulo: "Misa no, guayabo sí",
    texto: "Caldo, piscina y revivir. A las 3 p.m. ya estamos otra vez con una Águila en la mano, no sea flojo.",
    bg: "bg-sol",
  },
  {
    dia: "Lunes 16",
    titulo: "Festivo, gracias Cartagena",
    texto: "Nadie trabaja. El que saque el computador lo tiramos a la piscina. Con computador y todo.",
    bg: "bg-rosa",
  },
  {
    dia: "Martes 17",
    titulo: "Regreso de los muertos",
    texto: "Vuelta a Bogotá con un guayabo de tres días y la promesa de que el próximo es en San Andrés.",
    bg: "bg-agua",
  },
];

export function Itinerario() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cartas = gsap.utils.toArray<HTMLElement>(".it-carta");
      cartas.forEach((c, i) => {
        const sig = cartas[i + 1];
        if (!sig) return;
        // Cuando llega la siguiente carta, esta se encoge y se oscurece
        gsap.to(c, {
          scale: 0.9,
          rotate: i % 2 ? 3 : -3,
          ease: "none",
          scrollTrigger: { trigger: sig, start: "top 85%", end: "top 18%", scrub: true },
        });
        gsap.to(c.querySelector(".it-sombra"), {
          opacity: 0.45,
          ease: "none",
          scrollTrigger: { trigger: sig, start: "top 85%", end: "top 18%", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative bg-crema px-4 pb-[20vh] pt-24 text-tinta">
      <h2 className="letrero mb-10 text-center text-5xl text-rosa md:text-7xl">El itinerario</h2>
      <div className="mx-auto max-w-lg">
        {DIAS.map((d, i) => (
          <div key={d.dia} className="sticky top-[18vh] mb-[18vh]" style={{ zIndex: i }}>
            <article
              className={`it-carta relative min-h-[52vh] overflow-hidden rounded-[2rem] border-[5px] border-tinta p-6 sombra-dura will-change-transform ${d.bg}`}
            >
              <p className="font-display text-7xl leading-none opacity-30">0{i + 1}</p>
              <p className="mt-4 inline-block rounded-full border-[3px] border-tinta bg-crema px-3 py-1 text-xs font-black uppercase tracking-widest">
                {d.dia}
              </p>
              <h3 className="mt-3 font-display text-4xl leading-none">{d.titulo}</h3>
              <p className="mt-4 text-xl font-bold leading-snug">{d.texto}</p>
              <div className="it-sombra pointer-events-none absolute inset-0 bg-tinta opacity-0" />
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
