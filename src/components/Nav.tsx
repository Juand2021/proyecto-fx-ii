"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "El paseo" },
  { href: "/cuentas", label: "Las cuentas" },
] as const;

export function Nav() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <div className="flex gap-1 rounded-full border-[3px] border-tinta bg-crema p-1 sombra-dura">
        {LINKS.map((l) => {
          const activo = l.href === "/" ? path === "/" : path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-1.5 text-sm font-black transition-colors duration-200 ${
                activo ? "bg-rosa text-crema" : "text-tinta"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
