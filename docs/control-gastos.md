# Control de gastos

Los ingresos y gastos del paseo viven en un Google Sheet. Los dos admins los registran desde `/admin`; el grupo ve el resultado en `/cuentas` y puede abrir el Sheet en modo solo lectura.

## Cómo funciona

| Pieza | Dónde | Qué hace |
|---|---|---|
| Sheet | Google Drive | Única fuente de los movimientos. Pestañas `Resumen`, `Ingresos` y `Gastos` |
| `src/lib/sheets.ts` | servidor | Lee y agrega filas con la cuenta de servicio de Firebase |
| `src/lib/movimientos.ts` | servidor | Convierte las filas en ingresos y gastos; sin Sheet configurado usa datos de prueba en memoria |
| `src/lib/finanzas.ts` | servidor y cliente | Tipos y cálculos: abonado por persona, falta, totales y saldo |
| `src/lib/evidencia.ts` | servidor | Guarda la foto de cada gasto en Firestore (colección `evidencias`) |
| `/evidencia/[id]` | público | Sirve la foto; es el link que queda en la columna Evidencia |
| `/admin` | solo con PIN | Formularios de ingreso y gasto |

El botón manual DEBE / pagó cupo no cambia y es independiente de los abonos del Sheet.

## Columnas del Sheet

- **Ingresos:** Fecha, Persona, Monto COP. Una persona puede tener varias filas (abonos).
- **Gastos:** Fecha, Motivo, Monto COP, Evidencia (link a la foto), Registrado por (Juan Diego o Albert).
- **Resumen:** todo con fórmulas, no se escribe a mano. Meta por persona (celda B3, $250.000), total recaudado, total gastado, saldo disponible (recaudado − gastado) y, por persona, abonado, falta y estado.

La fila 1 de `Ingresos` y `Gastos` son los encabezados y la app depende de ellos: no moverlos ni renombrarlos.

## Puesta en marcha (una sola vez)

1. Crear un Google Sheet vacío y activar la API de Google Sheets en el proyecto de Google Cloud de Firebase.
2. Compartir el Sheet como **Editor** con el `client_email` de la cuenta de servicio.
3. Crear `.env.local` en la raíz (nunca se sube a git):

   ```
   ADMIN_PIN=...
   FIREBASE_SERVICE_ACCOUNT='{...JSON en una línea, entre comillas simples...}'
   GOOGLE_SHEET_ID=...   # el texto entre /d/ y /edit en la URL del Sheet
   SITE_URL=https://tu-dominio.com   # opcional; arma el link de las fotos
   ```

4. Preparar las pestañas, fórmulas y formato:

   ```bash
   npm run sheet:preparar
   ```

   Se puede repetir sin riesgo: no borra movimientos, solo reescribe encabezados y el Resumen.
5. Para que el grupo lo vea sin poder editarlo: en el Sheet, **Compartir → Acceso general → Cualquier persona con el enlace → Lector**.
6. En Vercel, agregar `GOOGLE_SHEET_ID` y `SITE_URL` a las variables de entorno. `FIREBASE_SERVICE_ACCOUNT` y `ADMIN_PIN` ya están.

## Fotos de evidencia

La foto se achica en el navegador (lado máximo 1280 px, JPEG) y queda en Firestore, así que no hace falta Firebase Storage ni plan de pago. El tope es 700 KB por foto. Cualquiera con el link de una foto la puede ver; el id es un código largo que no se puede adivinar.

## Si algo falla

- **"No se pudo escribir en el Sheet":** revisar que esté compartido como Editor con la cuenta de servicio y que `GOOGLE_SHEET_ID` sea correcto.
- **Aviso de modo prueba en `/admin`:** falta `GOOGLE_SHEET_ID` o `FIREBASE_SERVICE_ACCOUNT`; los movimientos no se guardan.
- **Una fila mal escrita a mano en el Sheet** (sin monto, o con un "Registrado por" distinto de los dos nombres) se ignora en la web.
