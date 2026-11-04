# Proyecto FDX II: El Reencuentro — Contexto (Fase 0)

Web app para el paseo de ingenieros de la Universidad Jorge Tadeo Lozano (Bogotá) a una finca en Villeta.
Lo más importante es el frontend: único, verde, colorido, fiestero, de paseo a tierra caliente y piscina, con humor muy subido de tono (groserías colombianas permitidas).

## Datos del viaje

| Dato | Valor |
|---|---|
| Nombre | Proyecto FDX II — El Reencuentro (como f(x) de cálculo) |
| Destino | Finca en Villeta, Cundinamarca (ubicación exacta y fotos: pendientes) |
| Salida | Sábado 14 nov 2026, 7:00 a.m., desde Bogotá |
| Regreso | Martes 17 nov 2026, a Bogotá |
| Duración | 4 días, 3 noches |
| Itinerario | Quedarse en la finca (piscina) |
| Costo total por persona | $250.000 COP |
| Cupo (separar puesto) | $50.000 COP, pagado antes del sábado 14 nov |
| Pago | Transferencia a Perdomo (recaudador) |
| Personas | ~15, lista cerrada (los nombres los carga el admin) |

## Reglas de la app

- Sin login para los visitantes: con el link se ve todo (solo lectura).
- Un único administrador (Juan) marca quién pagó y quién no. Nadie más puede cambiar pagos.
- Lista de quién pagó y quién no pagó (no un "muro de deudores" aparte).
- Sin audio.
- Cuenta regresiva hasta la salida.
- Chistes internos: llegarán después; deben ser fáciles de agregar.
- Responsive (celular primero), 60 FPS, animaciones fluidas en cualquier dispositivo y navegador.

## Stack (igual que gym-tracker)

- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- Firestore usando firebase-admin (solo del lado del servidor)
- Admin protegido con PIN en variable de entorno (igual que `SITE_PIN` en gym-tracker)
- GitHub (cuenta Juand2021) + Vercel

## Fases

0. Contexto ✅
1. Dirección creativa (2–3 propuestas visuales; tú eliges)
2. Arquitectura y setup (repo, Vercel, Firestore)
3. Frontend
4. Datos y panel de administración
5. Pulido y rendimiento (60 FPS, pruebas en celulares)
6. Lanzamiento (meta: publicado el 7–8 de noviembre)
