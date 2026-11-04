// Sello de calidad "Plan aprobado por Cabito" (mascota de la Tadeo, con gafas de sol).
import Image from "next/image";

// Posición de los ojos en la imagen recortada (sale de scripts/procesar-cabito.py)
const OJOS = { izq: [40.0, 38.21], der: [65.88, 35.77] } as const;
const CENTRO_X = (OJOS.izq[0] + OJOS.der[0]) / 2;
const CENTRO_Y = (OJOS.izq[1] + OJOS.der[1]) / 2;
// la línea de los ojos está un poco inclinada
const GIRO = (Math.atan2((OJOS.der[1] - OJOS.izq[1]) * 369, (OJOS.der[0] - OJOS.izq[0]) * 510) * 180) / Math.PI;

function Gafas({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 40" className={className} style={style} aria-hidden="true">
      <path d="M2 8 H118" stroke="#151515" strokeWidth="5" strokeLinecap="round" />
      <path d="M6 7 h44 v12 a15 15 0 0 1 -44 0z" fill="#151515" />
      <path d="M70 7 h44 v12 a15 15 0 0 1 -44 0z" fill="#151515" />
      <path d="M50 12 q10 -6 20 0" stroke="#151515" strokeWidth="5" fill="none" />
      {/* brillo de los lentes */}
      <path d="M22 11 l-6 10 M31 11 l-3.5 6" stroke="#7eeef5" strokeWidth="3.2" strokeLinecap="round" opacity=".9" />
      <path d="M86 11 l-6 10 M95 11 l-3.5 6" stroke="#7eeef5" strokeWidth="3.2" strokeLinecap="round" opacity=".9" />
    </svg>
  );
}

export function SelloCabito({ className = "" }: { className?: string }) {
  const texto = "★ PLAN APROBADO POR CABITO ★ CALIDAD TADEO ";
  return (
    <div className={`relative aspect-square select-none ${className}`} role="img" aria-label="Sello: plan aprobado por Cabito">
      {/* disco del sello */}
      <div className="absolute inset-0 rounded-full border-[4px] border-tinta bg-sol sombra-dura" />
      <div className="absolute inset-[9%] rounded-full border-[3px] border-dashed border-tinta/70" />
      {/* aro de texto girando */}
      <svg viewBox="0 0 200 200" className="girar-lento absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id="aro-cabito" d="M100 100 m-80 0 a80 80 0 1 1 160 0 a80 80 0 1 1 -160 0" />
        </defs>
        <text fontFamily="var(--font-archivo)" fontWeight="900" fontSize="15.5" letterSpacing="1.2" fill="#151515">
          <textPath href="#aro-cabito">{texto}</textPath>
        </text>
      </svg>

      {/* Cabito con gafas, asomándose por encima del sello */}
      <div className="absolute left-1/2 top-[-6%] w-[84%] -translate-x-1/2">
        <Image src="/cabito.webp" alt="" width={510} height={369} className="h-auto w-full" priority={false} />
        <Gafas
          className="absolute w-[56%]"
          style={{
            left: `${CENTRO_X}%`,
            top: `${CENTRO_Y}%`,
            transform: `translate(-50%, -38%) rotate(${GIRO}deg)`,
          }}
        />
      </div>

      {/* cinta: tapa el cuerpo cortado de la imagen */}
      <div className="absolute inset-x-[-10%] top-[58%] -rotate-6">
        <div
          className="border-[3px] border-tinta bg-rojo px-4 pb-1 pt-1 text-center leading-none text-crema sombra-dura"
          style={{ clipPath: "polygon(0 0,100% 0,95% 50%,100% 100%,0 100%,5% 50%)" }}
        >
          <span className="block text-[9px] font-black tracking-[0.18em] md:text-xs">PLAN APROBADO POR</span>
          <span className="block font-display text-[1.35rem] md:text-3xl">Cabito</span>
        </div>
      </div>
    </div>
  );
}
