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

## El botón DEBE y el Sheet

El botón manual DEBE sigue igual, pero ahora se refleja en el Sheet:

- **De DEBE a pagado:** la app agrega una fila de $50.000 en `Ingresos` a nombre de esa persona, con Origen `Cupo`. Si ya tenía esa fila, no la repite.
- **De pagado a DEBE:** la app borra la fila de esa persona con Origen `Cupo`. Nunca borra abonos: ni los del formulario (Origen `Abono`), ni filas escritas a mano o sin Origen, ni filas de otras personas.
- Los abonos adicionales (por ejemplo los $200.000 restantes) se siguen registrando con el formulario de ingreso del admin.
- Si no se puede escribir en el Sheet, el botón no cambia y sale un aviso rojo; se puede volver a pulsar sin riesgo de duplicar.
- El recuadro "plata en el bolsillo de Perdomo" de `/cuentas` muestra el total de ingresos del Sheet, el mismo "Total recaudado" del Resumen.

## Columnas del Sheet

- **Ingresos:** Fecha, Persona, Monto COP, Origen (`Cupo` si lo escribió el botón de pagó cupo, `Abono` si lo escribió el formulario). Una persona puede tener varias filas.
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
- **Aviso de modo prueba en `/admin`** (solo en desarrollo): falta `GOOGLE_SHEET_ID` o `FIREBASE_SERVICE_ACCOUNT`; los movimientos son de ejemplo y no se guardan. En producción no hay modo prueba: sin esas variables `/cuentas` muestra "No se pudieron cargar los movimientos" y `/admin` da error al guardar, en vez de mostrar plata inventada.
- **El Resumen del Excel está en $0 aunque `Ingresos` tenga filas, o las filas nuevas salen en verde:** correr `npm run sheet:preparar`. Repara las fórmulas (usan columnas completas, `Ingresos!C:C`, para que Google Sheets no les corra el rango) y deja las filas de datos con formato plano. La app escribe en la primera fila libre sin insertar filas, justamente para no volver a causarlo.
- **Alguien marcado como pagó pero sin fila de cupo en el Sheet** (por ejemplo, porque se marcó antes de existir esta función): pasarlo a DEBE y de nuevo a pagado agrega su fila.
- **Una fila mal escrita a mano en el Sheet** (sin monto, o con un "Registrado por" distinto de los dos nombres) se ignora en la web.
