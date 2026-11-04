"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ADMIN, esAdmin, pinCorrecto, tokenAdmin } from "@/lib/admin-auth";
import { actualizarPersona, crearPersona, eliminarPersona } from "@/lib/personas";

async function exigirAdmin() {
  if (!(await esAdmin())) redirect("/admin");
}

function refrescar() {
  revalidatePath("/");
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
  redirect("/admin");
}

export async function agregar(formData: FormData) {
  await exigirAdmin();
  await crearPersona(String(formData.get("nombre") ?? ""));
  refrescar();
}

export async function cambiar(formData: FormData) {
  await exigirAdmin();
  const id = String(formData.get("id"));
  const campo = String(formData.get("campo"));
  const valor = formData.get("valor") === "true";
  if (campo !== "confirmo" && campo !== "pagoCupo") return;
  await actualizarPersona(id, { [campo]: valor });
  refrescar();
}

export async function borrar(formData: FormData) {
  await exigirAdmin();
  await eliminarPersona(String(formData.get("id")));
  refrescar();
}
