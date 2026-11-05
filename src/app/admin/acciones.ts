"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ADMIN, esAdmin, pinCorrecto, tokenAdmin } from "@/lib/admin-auth";
import { guardarEvidencia, urlEvidencia } from "@/lib/evidencia";
import { camposDe, esAccion } from "@/lib/estado";
import { esRegistrador, parsearPesos } from "@/lib/finanzas";
import { asegurarCupo, quitarCupo, registrarGasto, registrarIngreso, repararResumen } from "@/lib/movimientos";
import { actualizarPersona, crearPersona, eliminarPersona, listarPersonas } from "@/lib/personas";

const MONTO_MAXIMO = 100_000_000;

async function exigirAdmin() {
  if (!(await esAdmin())) redirect("/admin");
}

function refrescar() {
  revalidatePath("/cuentas");
  revalidatePath("/admin");
}

export async function entrar(formData: FormData) {
  const pin = String(formData.get("pin") ?? "");
  if (!pinCorrecto(pin)) redirect("/admin?error=1");
  (await cookies()).set(COOKIE_ADMIN, tokenAdmin(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function salir() {
  (await cookies()).delete(COOKIE_ADMIN);
  redirect("/cuentas");
}

export async function agregar(formData: FormData) {
  await exigirAdmin();
  await crearPersona(String(formData.get("nombre") ?? ""));
  refrescar();
}

export async function marcar(formData: FormData) {
  await exigirAdmin();
  const id = String(formData.get("id"));
  const accion = formData.get("accion");
  if (!esAccion(accion)) return;
  // Pagar el cupo = $50.000 de ingreso en el Sheet; volver a DEBE borra esa fila. El Sheet va primero:
  // si falla, el botón no cambia y se puede volver a pulsar sin duplicar nada.
  if (accion === "pagado" || accion === "debe") {
    const persona = (await listarPersonas()).find((p) => p.id === id);
    if (persona) {
      const sincronizado = await (accion === "pagado" ? asegurarCupo(persona.nombre) : quitarCupo(persona.nombre)).then(
        () => true,
        () => false,
      );
      if (!sincronizado) redirect("/admin?error=sheet");
    }
  }
  await actualizarPersona(id, camposDe(accion));
  refrescar();
}

export async function borrar(formData: FormData) {
  await exigirAdmin();
  await eliminarPersona(String(formData.get("id")));
  refrescar();
}

/** Reconstruye el Resumen del Excel si alguien lo dañó. No toca los ingresos ni los gastos. */
export async function repararExcel() {
  await exigirAdmin();
  const resultado = await repararResumen().then(
    (reparo) => (reparo ? "resumen-reparado" : "resumen-ok"),
    () => null,
  );
  if (!resultado) redirect("/admin?error=sheet");
  refrescar();
  redirect(`/admin?ok=${resultado}`);
}

/** Ingreso: alguien abona plata. Va a la pestaña Ingresos del Sheet. */
export async function agregarIngreso(formData: FormData) {
  await exigirAdmin();
  const persona = String(formData.get("persona") ?? "");
  const monto = parsearPesos(formData.get("monto"));
  const conocida = (await listarPersonas()).some((p) => p.nombre === persona);
  if (!conocida || !monto || monto > MONTO_MAXIMO) redirect("/admin?error=ingreso");
  const guardado = await registrarIngreso({ persona, monto }).then(
    () => true,
    () => false,
  );
  if (!guardado) redirect("/admin?error=sheet");
  refrescar();
  redirect("/admin?ok=ingreso");
}

/** Gasto: motivo, monto, quién lo registra y foto de evidencia. Va a la pestaña Gastos del Sheet. */
export async function agregarGasto(formData: FormData) {
  await exigirAdmin();
  const motivo = String(formData.get("motivo") ?? "").trim().slice(0, 120);
  const monto = parsearPesos(formData.get("monto"));
  const registradoPor = formData.get("registradoPor");
  const foto = formData.get("foto");
  if (!motivo || !monto || monto > MONTO_MAXIMO || !esRegistrador(registradoPor)) redirect("/admin?error=gasto");
  if (!(foto instanceof File) || foto.size === 0) redirect("/admin?error=foto");

  const idFoto = await guardarEvidencia({ mime: foto.type, bytes: Buffer.from(await foto.arrayBuffer()) }).catch(() => null);
  if (!idFoto) redirect("/admin?error=foto");

  const guardado = await registrarGasto({ motivo, monto, evidencia: urlEvidencia(idFoto), registradoPor }).then(
    () => true,
    () => false,
  );
  if (!guardado) redirect("/admin?error=sheet");
  refrescar();
  redirect("/admin?ok=gasto");
}
