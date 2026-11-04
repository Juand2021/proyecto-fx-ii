"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Datos sacados del anuncio de Airbnb de la finca.
const AIRBNB = "https://www.airbnb.cl/rooms/994792202910878588";
// Ubicación aproximada (Airbnb no da la dirección exacta hasta reservar).
const LAT = 5.05969;
const LNG = -74.50292;
const MAPA = `https://www.google.com/maps?q=${LAT},${LNG}&z=14&output=embed`;
const ABRIR_MAPA = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`;

const FOTO = (id: string) => `https://a0.muscache.com/im/pictures/${id}?im_w=720`;
const H = "miso/Hosting-994792202910878588/original/";

const FOTOS = [
  { id: `${H}36b5443d-e594-4af3-ab2f-d7e0129879f1.jpeg`, pie: "El cambuche desde el aire" },
  { id: `${H}dfb04fc3-f8ac-4800-866e-f283ddc77764.jpeg`, pie: "La piscina, nuestra oficina" },
  { id: "0605e7c1-85cb-489f-b306-d41cac101c92.jpg", pie: "La casa (todavía limpia)" },
  { id: `${H}2ea5672e-49b1-4626-970d-2b091457a105.jpeg`, pie: "Balcón para el guayabo" },
  { id: `${H}8207a113-b2c1-4e32-bfd7-767ed335777e.jpeg`, pie: "El kiosko de la rumba" },
  { id: "fb0bb546-b6df-48c3-82a3-64b9b2a171aa.jpg", pie: "Agua y montaña" },
  { id: `${H}c4bc1846-6e38-43ae-9a88-86fec8087217.jpeg`, pie: "Vista pa' llorar" },
  { id: `${H}16d53c21-9849-4b1e-bf19-2a3217f3a80b.jpeg`, pie: "Donde se prende el asado" },
];

const DATOS = [
  { n: "16+", l: "parceros" },
  { n: "4", l: "piezas" },
  { n: "10", l: "camas" },
  { n: "6½", l: "baños" },
];

const HAY = [
  { e: "🏊", t: "Piscina" },
  { e: "♨️", t: "Jacuzzi climatizado" },
  { e: "🎱", t: "Billar y pool" },
  { e: "🏓", t: "Ping pong" },
  { e: "🪩", t: "Kiosko con sonido y luces robóticas" },
  { e: "🔥", t: "Asador de leña y de gas" },
  { e: "🌄", t: "Vista a la montaña" },
  { e: "🛏️", t: "Hamaca" },
  { e: "🎲", t: "Juegos de mesa" },
  { e: "📶", t: "Wifi" },
  { e: "🚐", t: "Parqueadero" },
  { e: "🦜", t: "Comedero de pájaros" },
];

const COLORES = ["bg-sol", "bg-lima", "bg-rosa", "bg-crema"];

export function Finca() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".f-titulo", {
        yPercent: 40,
        rotate: -6,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".f-titulo", start: "top 85%" },
      });
      gsap.from(".f-foto", {
        y: 80,
        rotate: (i) => (i % 2 ? 12 : -12),
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".f-galeria", start: "top 85%" },
      });
      gsap.from(".f-chip", {
        scale: 0.4,
        autoAlpha: 0,
        stagger: 0.04,
        duration: 0.4,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".f-hay", start: "top 85%" },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-agua pb-24 pt-20 text-tinta">
      <div className="causticas pointer-events-none" />

      <div className="relative mx-auto max-w-lg px-4 text-center">
        <p className="inline-block -rotate-2 rounded-full border-[3px] border-tinta bg-lima px-3 py-1 text-xs font-black uppercase tracking-widest">
          Villeta, Cundinamarca
        </p>
        <h2 className="f-titulo letrero mt-3 text-6xl leading-[0.9] text-crema md:text-7xl">
          La finca
          <span className="block text-4xl text-sol md:text-5xl">donde nos vamos a perder</span>
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-lg font-bold leading-snug">
          Piscina, jacuzzi, billar y un kiosko con luces robóticas. Ni Pablo tenía esto.
        </p>
      </div>

      {/* galería: se desliza de lado con el dedo */}
      <div className="f-galeria relative mt-10">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[10vw] pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FOTOS.map((f, i) => (
            <figure
              key={f.id}
              className="f-foto w-[78vw] max-w-[340px] shrink-0 snap-center border-[4px] border-tinta bg-crema p-2 pb-3 sombra-dura"
              style={{ rotate: `${i % 2 ? 2 : -2}deg` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FOTO(f.id)}
                alt={f.pie}
                loading="lazy"
                className="aspect-[4/3] w-full border-[3px] border-tinta object-cover"
              />
              <figcaption className="mt-2 text-center font-display text-xl leading-tight">{f.pie}</figcaption>
            </figure>
          ))}
        </div>
        <p className="text-center text-xs font-black uppercase tracking-widest text-tinta/70">← deslice pa&apos; ver más →</p>
      </div>

      <div className="relative mx-auto mt-10 max-w-lg px-4">
        {/* números */}
        <div className="grid grid-cols-4 gap-2">
          {DATOS.map((d, i) => (
            <div key={d.l} className={`rounded-2xl border-[4px] border-tinta p-2 text-center sombra-dura ${COLORES[i]}`}>
              <p className="font-display text-3xl leading-none">{d.n}</p>
              <p className="mt-1 text-[11px] font-black uppercase">{d.l}</p>
            </div>
          ))}
        </div>

        {/* lo que hay */}
        <div className="f-hay mt-8 rounded-[1.75rem] border-[5px] border-tinta bg-crema p-5 sombra-dura">
          <h3 className="font-display text-3xl leading-none text-rosa">Lo que hay</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {HAY.map((h) => (
              <li
                key={h.t}
                className="f-chip rounded-full border-[3px] border-tinta bg-agua-claro px-3 py-1 text-sm font-black"
              >
                <span aria-hidden="true">{h.e}</span> {h.t}
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl border-[3px] border-dashed border-tinta bg-sol/60 p-3 text-sm font-bold leading-snug">
            ⚠️ Regla de la casa: la fruta de los árboles <b>no se toca</b>. Ellos la cosechan y se la dan. El que se suba al palo de mango
            paga la multa en guaro.
          </p>
        </div>

        {/* mapa */}
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border-[5px] border-tinta bg-crema sombra-dura">
          <div className="flex items-center justify-between gap-2 border-b-[4px] border-tinta bg-rosa px-4 py-2 text-crema">
            <h3 className="font-display text-2xl leading-none">¿Dónde queda?</h3>
            <span className="text-[11px] font-black uppercase tracking-widest">ubicación aprox.</span>
          </div>
          <iframe
            src={MAPA}
            title="Mapa de la finca en Villeta"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-64 w-full"
          />
          <div className="grid grid-cols-2 gap-2 p-3">
            <a
              href={ABRIR_MAPA}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-[3px] border-tinta bg-lima px-3 py-2 text-center text-sm font-black uppercase transition-transform active:translate-y-1"
            >
              Abrir en Maps
            </a>
            <a
              href={AIRBNB}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-[3px] border-tinta bg-sol px-3 py-2 text-center text-sm font-black uppercase transition-transform active:translate-y-1"
            >
              Ver en Airbnb
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
