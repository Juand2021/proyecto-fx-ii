import type { Metadata } from "next";
import Link from "next/link";
import { Banderines } from "@/components/arte";
import { Countdown } from "@/components/Countdown";
import { COLOR, ESTADOS, type Estado, estadoDe } from "@/lib/estado";
import { listarPersonas } from "@/lib/personas";
import { VIAJE, formatoPesos } from "@/lib/viaje";

export const metadata: Metadata = { title: "Las cuentas · Proyecto F(x) II" };

// Se regenera al instante cuando el admin cambia algo en /admin,
// o en máximo 1 min si se edita directo en la consola de Firebase.
export const revalidate = 60;

const ETIQUETA = Object.fromEntries(ESTADOS.map((e) => [e.id, e.etiqueta])) as Record<Estado, string>;

function Etiqueta({ estado }: { estado: Estado }) {
  return (
    <b
      className={`inline-block min-w-[74px] rounded-md border-[3px] border-tinta px-2 py-1 text-center text-xs font-black ${COLOR[estado]}`}
    >
      {ETIQUETA[estado]}
    </b>
  );
}

export default async function Cuentas() {
  const personas = await listarPersonas();
  const cuenta = (e: Estado) => personas.filter((p) => estadoDe(p) === e).length;
  const van = cuenta("va");
  const deben = cuenta("debe");
  const noVan = cuenta("no");
  const recogido = van * VIAJE.cupo;

  return (
    <main
      className="min-h-dvh pb-20 text-tinta"
      style={{ background: "repeating-linear-gradient(-45deg,#0f8a3c 0 26px,#0a5c28 26px 52px)" }}
    >
      <Banderines cantidad={20} />

      <div className="mx-auto max-w-lg px-4 pt-14">
        <div className="flex justify-end">
          <Link
            href="/admin"
            className="-rotate-2 border-[3px] border-tinta bg-sol px-4 py-1.5 text-sm font-black sombra-dura transition-transform active:translate-y-1"
          >
            ADMIN
          </Link>
        </div>

        {/* letrero */}
        <div
          className="entrar mt-5 rounded-[18px] border-[5px] border-tinta bg-sol px-4 pt-5 text-center"
          style={{ boxShadow: "0 0 0 6px #e8262c, 0 0 0 11px #151515" }}
        >
          <h1 className="font-display text-5xl leading-[0.95] text-rojo [text-shadow:3px_3px_0_#151515]">
            Las cuentas
            <span className="block text-3xl text-azul">claras, el guaro espeso</span>
          </h1>
          <div
            className="-mx-4 mt-4 h-3.5"
            style={{ background: "repeating-linear-gradient(90deg,#e8262c 0 30px,#1d5fd1 30px 60px,#ff7a00 60px 90px,#e6007e 90px 120px)" }}
          />
          <p className="py-3 text-xs font-black tracking-wide">BOGOTÁ ⇄ VILLETA · SERVICIO DE PARRANDA</p>
        </div>

        {/* números */}
        <div className="entrar mt-8 grid grid-cols-3 gap-2" style={{ animationDelay: "80ms" }}>
          {[
            { n: van, l: "van (ya pagaron)", c: COLOR.va },
            { n: deben, l: "deben, sapos", c: COLOR.debe },
            { n: noVan, l: "no van, cobardes", c: COLOR.no },
          ].map((s) => (
            <div key={s.l} className={`rounded-2xl border-[4px] border-tinta p-3 text-center sombra-dura ${s.c}`}>
              <p className="font-display text-4xl leading-none">{s.n}</p>
              <p className="mt-1 text-[11px] font-black uppercase leading-tight">{s.l}</p>
            </div>
          ))}
        </div>

        <Caja tag="PLATA EN EL BOLSILLO DE PERDOMO" delay={140}>
          <p className="font-display text-5xl tabular-nums text-[#0f8a3c]">{formatoPesos(recogido)}</p>
          <p className="mt-1 text-sm font-bold">
            {van} de {van + deben} han soltado los {formatoPesos(VIAJE.cupo)} del cupo.
          </p>
        </Caja>

        <Caja tag="PASAJEROS" delay={200}>
          {personas.length === 0 ? (
            <p className="py-4 text-lg font-bold">Todavía no hay nadie en la lista. Perdomo, póngase pilas.</p>
          ) : (
            <ul>
              {personas.map((p, i) => (
                <li
                  key={p.id}
                  className="entrar flex items-center gap-2 border-b-2 border-tinta/15 py-3 last:border-0"
                  style={{ animationDelay: `${260 + i * 50}ms` }}
                >
                  <span className="flex-1 text-lg font-bold leading-tight">{p.nombre}</span>
                  <Etiqueta estado={estadoDe(p)} />
                </li>
              ))}
            </ul>
          )}
        </Caja>

        <Caja tag="LA CHIVA SALE EN" delay={260}>
          <Countdown numero="text-4xl text-[#0f8a3c]" />
        </Caja>

        <Caja tag="SU TIQUETE, PAPI" delay={320}>
          <div className="grid grid-cols-2 rounded-xl border-[3px] border-dashed border-tinta">
            {[
              ["DESTINO", "Finca en Villeta"],
              ["SALIDA", "Sáb 14 · 7 a.m."],
              ["REGRESO", "Mar 17"],
              ["VALOR", formatoPesos(VIAJE.costoTotal)],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`p-3 ${i % 2 === 0 ? "border-r-[3px] border-dashed border-tinta" : ""} ${i < 2 ? "border-b-[3px] border-dashed border-tinta" : ""}`}
              >
                <p className="text-[11px] font-bold text-rojo">{k}</p>
                <p className="text-lg font-black leading-tight">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm font-bold">
            Cupo: {formatoPesos(VIAJE.cupo)} a {VIAJE.recaudador} antes del sábado. Los otros{" "}
            {formatoPesos(VIAJE.costoTotal - VIAJE.cupo)} se pagan el mismo sábado. Sin plata no hay puesto, gonorrea.
          </p>
        </Caja>

        <p className="mt-10 text-center font-display text-3xl leading-tight text-sol [text-shadow:3px_3px_0_#151515]">
          ¡Súbase que nos vamos,
          <br />
          hijueputa!
        </p>
      </div>
    </main>
  );
}

function Caja({ tag, children, delay = 0 }: { tag: string; children: React.ReactNode; delay?: number }) {
  return (
    <section
      className="entrar relative mt-9 rounded-2xl border-[4px] border-tinta bg-crema p-4 pt-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="absolute -top-4 left-3 -rotate-3 border-[3px] border-tinta bg-rojo px-3 py-1 text-xs font-black text-crema">
        {tag}
      </span>
      {children}
    </section>
  );
}
