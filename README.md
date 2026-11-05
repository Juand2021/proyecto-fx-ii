# Proyecto F(x) II · El Reencuentro

Web app del paseo a Villeta (14 al 17 de noviembre de 2026).

- `/`: info del viaje y quién confirmó y pagó el cupo (público, sin login)
- `/admin`: panel de los administradores (PIN): asistencia, cupos, ingresos y gastos
- Los ingresos y gastos se guardan en un Google Sheet público de solo lectura: [docs/control-gastos.md](docs/control-gastos.md)

## Desarrollo

```bash
npm install
cp .env.example .env.local   # pon tu ADMIN_PIN
npm run dev
```

Sin `FIREBASE_SERVICE_ACCOUNT` la app usa datos de prueba en memoria.

Más detalles en [docs/arquitectura.md](docs/arquitectura.md).
