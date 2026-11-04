# Arquitectura — Proyecto F(x) II

## Stack
- Next.js 16.4 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- Firestore (proyecto Firebase **nuevo**, no el de gym-tracker), accedido solo desde el servidor con firebase-admin
- Vercel (despliegue automático en cada push a `main`)

## Rutas
| Ruta | Quién | Qué hace |
|---|---|---|
| `/` | Todos, sin login | Home: historia con animaciones atadas al scroll (GSAP + ScrollTrigger + Lenis), contenido fijo |
| `/cuentas` | Todos, sin login | Quién va, quién pagó el cupo, plata recogida, cuenta regresiva y botón Admin |
| `/admin` | Solo Juan (PIN) | Agregar/quitar personas, marcar ✓/✗ en "Confirmó" y "Pagó cupo" |

## Datos
Colección `personas` en Firestore:

| Campo | Tipo | Nota |
|---|---|---|
| `nombre` | string | |
| `confirmo` | boolean | lo marca el admin |
| `pagoCupo` | boolean | los $50.000 del cupo |
| `orden` | number | orden en la tabla |

Los datos fijos del viaje (fechas, costos, destino) están en `src/lib/viaje.ts`.

## Rendimiento
- `/` es 100% estática. `/cuentas` es estática (se genera una vez) y se regenera al instante cuando el admin cambia algo (`revalidatePath`), o en máximo 1 min si se edita directo en la consola de Firebase. Así carga rapidísimo y casi no gasta lecturas de Firestore.
- Firestore nunca se expone al navegador: no hay reglas que configurar ni llaves públicas.

## Seguridad del admin
- `ADMIN_PIN` vive en las variables de entorno de Vercel.
- Al entrar se guarda una cookie httpOnly con un HMAC del PIN. Cada acción del admin la verifica en el servidor.

## Variables de entorno
Ver `.env.example`. Sin `FIREBASE_SERVICE_ACCOUNT` la app funciona en "modo prueba" con datos en memoria.
