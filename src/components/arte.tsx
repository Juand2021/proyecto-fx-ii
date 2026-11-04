// Ilustraciones propias en SVG/CSS: livianas, nítidas y animables con transform.

import type { CSSProperties } from "react";

type P = { className?: string; style?: CSSProperties };

export function Sol({ className = "", style }: P) {
  const rayos = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
      <g className="girar-lento" style={{ transformOrigin: "100px 100px" }}>
        {rayos.map((r) => (
          <path key={r} d="M100 4 L108 40 L92 40 Z" fill="#ffd23f" transform={`rotate(${r} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="56" fill="#ffd23f" stroke="#151515" strokeWidth="5" />
      <circle cx="82" cy="92" r="6" fill="#151515" />
      <circle cx="118" cy="92" r="6" fill="#151515" />
      <path d="M78 114 Q100 134 122 114" fill="none" stroke="#151515" strokeWidth="5" strokeLinecap="round" />
      {/* gafas de sol */}
      <path d="M68 86 h28 v10 a12 12 0 0 1 -28 0z M104 86 h28 v10 a12 12 0 0 1 -28 0z M96 90 h8" fill="#151515" stroke="#151515" strokeWidth="3" />
    </svg>
  );
}

export function MontanaAtras({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path d="M0 160 L0 90 Q40 40 80 70 T170 40 T260 70 T340 30 T400 60 L400 160 Z" fill="#0f5a3f" stroke="#151515" strokeWidth="4" />
    </svg>
  );
}

export function MontanaFrente({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path d="M0 160 L0 80 Q60 30 120 85 T240 70 T330 90 T400 50 L400 160 Z" fill="#2fa24a" stroke="#151515" strokeWidth="4" />
      <path d="M30 120 q6 -10 12 0 M150 110 q6 -10 12 0 M280 125 q6 -10 12 0 M360 105 q6 -10 12 0" stroke="#151515" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function Palmera({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 200 320" className={className} style={style} aria-hidden="true">
      <path d="M96 320 C92 240 104 170 118 92 L132 94 C120 170 112 240 116 320 Z" fill="#a0612a" stroke="#151515" strokeWidth="5" />
      <path d="M100 300 h18 M102 260 h17 M106 220 h16 M110 180 h16 M114 140 h15" stroke="#151515" strokeWidth="4" />
      <g stroke="#151515" strokeWidth="5" strokeLinejoin="round">
        <path d="M124 92 C80 50 30 60 6 96 C46 78 84 82 124 92 Z" fill="#2fa24a" />
        <path d="M124 92 C150 40 196 40 200 80 C176 66 150 70 124 92 Z" fill="#c4f135" />
        <path d="M124 92 C100 30 60 10 30 20 C70 36 100 56 124 92 Z" fill="#c4f135" />
        <path d="M124 92 C150 20 180 6 196 16 C170 36 146 60 124 92 Z" fill="#2fa24a" />
        <path d="M124 92 C116 120 80 150 52 150 C80 130 104 110 124 92 Z" fill="#2fa24a" />
      </g>
      <circle cx="120" cy="98" r="9" fill="#a0612a" stroke="#151515" strokeWidth="4" />
      <circle cx="134" cy="102" r="9" fill="#a0612a" stroke="#151515" strokeWidth="4" />
    </svg>
  );
}

export function Chiva({ className = "", style }: P) {
  const franjas = ["#e8262c", "#1d5fd1", "#ff7a00", "#e6007e", "#2fa24a"];
  return (
    <svg viewBox="0 0 260 170" className={className} style={style} aria-hidden="true">
      {/* equipaje y gente en el techo */}
      <rect x="40" y="6" width="44" height="24" rx="4" fill="#ff7a00" stroke="#151515" strokeWidth="4" />
      <rect x="92" y="12" width="34" height="18" rx="4" fill="#1d5fd1" stroke="#151515" strokeWidth="4" />
      <circle cx="150" cy="16" r="10" fill="#ffd23f" stroke="#151515" strokeWidth="4" />
      <path d="M140 30 l10 -6 l10 6" stroke="#151515" strokeWidth="4" fill="none" />
      <rect x="20" y="30" width="210" height="10" fill="#151515" />
      {/* cuerpo */}
      <path d="M14 40 H214 Q246 40 248 76 V130 H14 Z" fill="#ffd23f" stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
      {franjas.map((c, i) => (
        <rect key={c} x={14 + i * 40} y="110" width="40" height="12" fill={c} />
      ))}
      <rect x="14" y="110" width="200" height="12" fill="none" stroke="#151515" strokeWidth="3" />
      {/* ventanas con pasajeros */}
      {[26, 66, 106, 146].map((x, i) => (
        <g key={x}>
          <rect x={x} y="52" width="32" height="40" rx="6" fill="#7eeef5" stroke="#151515" strokeWidth="4" />
          <circle cx={x + 16} cy="74" r="8" fill={["#ff4f8b", "#c4f135", "#ff7a00", "#ffd23f"][i]} stroke="#151515" strokeWidth="3" />
          <path d={`M${x + 22} ${66} l10 -14`} stroke="#151515" strokeWidth="3" />
        </g>
      ))}
      <path d="M190 52 H214 Q236 54 238 84 H190 Z" fill="#7eeef5" stroke="#151515" strokeWidth="4" />
      <circle cx="246" cy="112" r="6" fill="#fff8e7" stroke="#151515" strokeWidth="3" />
      {/* ruedas */}
      <g className="rueda">
        <circle cx="60" cy="134" r="20" fill="#151515" />
        <circle cx="60" cy="134" r="8" fill="#fff8e7" />
      </g>
      <g className="rueda">
        <circle cx="200" cy="134" r="20" fill="#151515" />
        <circle cx="200" cy="134" r="8" fill="#fff8e7" />
      </g>
      <text x="40" y="104" fontFamily="var(--font-shrikhand)" fontSize="14" fill="#e8262c">La Reencontrada</text>
    </svg>
  );
}

/** Lata 3D: un cilindro real armado con 24 caras en CSS 3D. */
export function Lata3D({ className = "", caras = 24 }: { className?: string; caras?: number }) {
  const radio = 58; // px, para un ancho de cara de ~15.3px
  const ancho = (2 * Math.PI * radio) / caras + 0.6;
  return (
    <div className={`relative h-[260px] w-[130px] [transform-style:preserve-3d] ${className}`}>
      {Array.from({ length: caras }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 h-full [backface-visibility:hidden]"
          style={{
            left: `calc(50% - ${ancho / 2}px)`,
            width: ancho,
            transform: `rotateY(${(360 / caras) * i}deg) translateZ(${radio}px)`,
            backgroundImage:
              "linear-gradient(180deg,#c9c9c9 0 6%,#151515 6% 7.5%,#ffd23f 7.5% 30%,#e8262c 30% 46%,#ffd23f 46% 70%,#151515 70% 72%,#ffd23f 72% 92%,#151515 92% 93.5%,#c9c9c9 93.5%)",
            backgroundSize: `${ancho * caras}px 100%`,
            backgroundPosition: `${-ancho * i}px 0`,
          }}
        >
          {i % 6 === 0 && (
            <span className="absolute inset-x-0 top-[33%] text-center font-display text-[13px] leading-none text-crema">
              ★
            </span>
          )}
        </div>
      ))}
      {/* etiqueta frontal legible */}
      <div
        className="absolute inset-x-0 top-[31%] text-center font-display text-[17px] leading-none text-crema"
        style={{ transform: `translateZ(${radio + 1}px)`, textShadow: "2px 2px 0 #151515" }}
      >
        La Rubia
      </div>
      <div
        className="absolute inset-x-0 top-[52%] text-center text-[11px] font-black uppercase leading-tight text-tinta"
        style={{ transform: `translateZ(${radio + 1}px)` }}
      >
        bien fría
        <br />o no sirve
      </div>
    </div>
  );
}

export function Botella({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 120 300" className={className} style={style} aria-hidden="true">
      <rect x="46" y="4" width="28" height="26" rx="4" fill="#e8262c" stroke="#151515" strokeWidth="5" />
      <path d="M50 30 H70 V80 Q104 100 104 140 V280 Q104 296 88 296 H32 Q16 296 16 280 V140 Q16 100 50 80 Z" fill="#dff7f0" stroke="#151515" strokeWidth="5" />
      <path d="M22 210 V280 Q22 290 32 290 H88 Q98 290 98 280 V210 Z" fill="#bfe9de" />
      <rect x="16" y="150" width="88" height="80" fill="#1d5fd1" stroke="#151515" strokeWidth="5" />
      <rect x="16" y="150" width="88" height="14" fill="#e8262c" />
      <text x="60" y="198" textAnchor="middle" fontFamily="var(--font-shrikhand)" fontSize="22" fill="#fff8e7">Guaro</text>
      <text x="60" y="218" textAnchor="middle" fontFamily="var(--font-archivo)" fontWeight="900" fontSize="10" fill="#ffd23f">SIN AGUA, MARICA</text>
      <path d="M30 120 Q34 100 46 92" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Flotador({ className = "", style }: P) {
  return (
    <div
      className={`relative aspect-square rounded-full border-[5px] border-tinta ${className}`}
      style={{ background: "repeating-conic-gradient(#ff4f8b 0 45deg,#fff8e7 0 90deg)", ...style }}
      aria-hidden="true"
    >
      <div className="absolute inset-[28%] rounded-full border-[5px] border-tinta bg-agua" />
    </div>
  );
}

export function Banderines({ cantidad = 16 }: { cantidad?: number }) {
  const colores = ["#ffd23f", "#e8262c", "#1d5fd1", "#e6007e", "#ff7a00", "#c4f135"];
  return (
    <div className="relative flex h-12 justify-center gap-[2px] overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 top-1.5 h-[3px] bg-tinta" />
      {Array.from({ length: cantidad }, (_, i) => (
        <i
          key={i}
          className="banderin mt-1.5 block h-10 w-8 shrink-0"
          style={{ background: colores[i % colores.length], clipPath: "polygon(0 0,100% 0,50% 100%)" }}
        />
      ))}
    </div>
  );
}
