import { leerEvidencia } from "@/lib/evidencia";

// Foto de evidencia de un gasto. Pública: el id es un código largo e imposible de adivinar,
// y es el que va en el link del Sheet.
export async function GET(_req: Request, ctx: RouteContext<"/evidencia/[id]">) {
  const { id } = await ctx.params;
  const ev = await leerEvidencia(id);
  if (!ev) return new Response("No encontrada", { status: 404 });
  return new Response(new Uint8Array(ev.bytes), {
    headers: {
      "Content-Type": ev.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
