"use client";

import { useState } from "react";

const LADO_MAXIMO = 1280;
const CALIDAD = 0.7;

/** Achica la foto en el navegador (la del celular pesa varios MB) y deja el resultado en el input. */
async function achicar(archivo: File): Promise<File> {
  const imagen = await createImageBitmap(archivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  lienzo.getContext("2d")?.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  const blob = await new Promise<Blob | null>((ok) => lienzo.toBlob(ok, "image/jpeg", CALIDAD));
  if (!blob) throw new Error("No se pudo achicar la foto");
  return new File([blob], "evidencia.jpg", { type: "image/jpeg" });
}

export function FotoInput() {
  const [estado, setEstado] = useState("");

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const original = input.files?.[0];
    if (!original) return setEstado("");
    setEstado("Achicando foto…");
    try {
      const chica = await achicar(original);
      const lista = new DataTransfer();
      lista.items.add(chica);
      input.files = lista.files;
      setEstado(`Foto lista (${Math.round(chica.size / 1024)} KB)`);
    } catch {
      setEstado("No se pudo achicar la foto; se enviará tal cual y puede fallar si pesa mucho.");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        name="foto"
        type="file"
        accept="image/*"
        required
        onChange={alElegir}
        className="rounded-lg border px-3 py-2 text-sm"
        aria-label="Foto de evidencia"
      />
      {estado && <p className="text-xs opacity-70">{estado}</p>}
    </div>
  );
}
