import Link from "next/link";
import { Banderines, Flotador } from "@/components/arte";
import { Countdown } from "@/components/Countdown";

const FRASES = [
  "AL AGUA PATOS",
  "ÁGUILA BIEN FRÍA",
  "NÉCTAR SIN AGUA",
  "LO QUE PASA EN VILLETA SE QUEDA EN VILLETA",
  "PAGUE EL CUPO, SAPO",
  "∫ GUARO dt = GUAYABO + C",
];

function Cinta({ className, reversa }: { className: string; reversa?: boolean }) {
  const items = [...FRASES, ...FRASES];
  return (
    <div className={`absolute left-[-10%] w-[120%] overflow-hidden border-y-[4px] border-tinta py-2 ${className}`}>
      <div className={`cinta ${reversa ? "reversa" : ""}`}>
        {items.map((f, i) => (
          <span key={i} className="mx-4 whitespace-nowrap font-display text-2xl">
            {f} ★
          </span>
        ))}
      </div>
    </div>
  );
}

export function Final() {
  return (
    <section className="relative overflow-hidden bg-selva pb-24 text-crema">
      <Banderines cantidad={24} />
      <div className="relative h-40">
        <Cinta className="top-6 rotate-[-4deg] bg-sol text-tinta" />
        <Cinta className="top-16 rotate-[3deg] bg-lima text-tinta" reversa />
      </div>

      <div className="relative mx-auto max-w-lg px-5 text-center">
        <div className="flotar absolute -right-2 -top-10 w-20">
          <Flotador className="w-full" />
        </div>
        <h2 className="letrero text-5xl text-sol md:text-7xl">La chiva arranca en</h2>
        <div className="mt-6 rounded-3xl border-[4px] border-tinta bg-crema p-5 text-tinta sombra-dura">
          <Countdown numero="text-5xl text-rosa md:text-6xl" />
        </div>
        <p className="mt-6 text-lg font-bold">¿Ya pagó? ¿O es de los que dice que sí y no aparece?</p>
        <Link
          href="/cuentas"
          className="mt-5 inline-block rounded-full border-[4px] border-tinta bg-rosa px-8 py-4 font-display text-2xl text-crema sombra-dura transition-transform duration-150 active:translate-x-1 active:translate-y-1"
        >
          Ver las cuentas →
        </Link>
        <p className="mt-10 text-sm font-bold opacity-70">Proyecto F(x) II · Hecho con guayabo · Utadeo</p>
      </div>
    </section>
  );
}
