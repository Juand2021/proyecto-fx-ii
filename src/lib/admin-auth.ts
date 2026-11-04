import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE_ADMIN = "fx_admin";

function pinAdmin(): string | null {
  return process.env.ADMIN_PIN?.trim() || null;
}

function token(pin: string): string {
  return createHmac("sha256", pin).update("proyecto-fx-admin").digest("hex");
}

function iguales(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function pinCorrecto(intento: string): boolean {
  const pin = pinAdmin();
  return Boolean(pin) && iguales(intento.trim(), pin!);
}

export function tokenAdmin(): string {
  const pin = pinAdmin();
  if (!pin) throw new Error("Falta ADMIN_PIN");
  return token(pin);
}

export async function esAdmin(): Promise<boolean> {
  const pin = pinAdmin();
  if (!pin) return false;
  const valor = (await cookies()).get(COOKIE_ADMIN)?.value;
  return Boolean(valor) && iguales(valor!, token(pin));
}
