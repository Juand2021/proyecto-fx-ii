// Prepara el Google Sheet del control de gastos: pestañas, encabezados, fórmulas y formato.
// Se puede correr varias veces: no borra los movimientos, solo reescribe encabezados y el Resumen.
//
//   npm run sheet:preparar
//
// Lee FIREBASE_SERVICE_ACCOUNT y GOOGLE_SHEET_ID de .env.local.

import { JWT } from "google-auth-library";

const API = "https://sheets.googleapis.com/v4/spreadsheets";
const FILAS = 1000;
const META = 250_000; // costo total por persona; la web usa VIAJE.costoTotal de src/lib/viaje.ts
const REGISTRADORES = ["Juan Diego", "Albert"]; // igual que REGISTRADORES de src/lib/finanzas.ts
const ORIGENES = ["Cupo", "Abono"]; // igual que ORIGENES de src/lib/finanzas.ts
const PESOS = { type: "NUMBER", pattern: "$#,##0" };
const VERDE = { red: 0.059, green: 0.541, blue: 0.235 };
const BLANCO = { red: 1, green: 1, blue: 1 };
const NEGRO = { red: 0, green: 0, blue: 0 };

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
const id = process.env.GOOGLE_SHEET_ID;
if (!raw || !id) {
  console.error("Faltan FIREBASE_SERVICE_ACCOUNT o GOOGLE_SHEET_ID en .env.local");
  process.exit(1);
}
const cred = JSON.parse(raw);
const cliente = new JWT({
  email: cred.client_email,
  key: cred.private_key.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const pedir = (url, method = "GET", data) => cliente.request({ url: `${API}/${id}${url}`, method, data });
const lote = (requests) => pedir(":batchUpdate", "POST", { requests });

async function pestanas() {
  const r = await pedir("?fields=sheets.properties(title,sheetId)");
  return new Map(r.data.sheets.map((s) => [s.properties.title, s.properties.sheetId]));
}

// 1) Pestañas: la hoja vacía que trae Google pasa a ser "Ingresos"; se agregan las que falten.
async function crearPestanas() {
  const existentes = await pestanas();
  const nuevas = new Set();
  const requests = [];
  const porDefecto = ["Sheet1", "Hoja 1", "Hoja1"].find((t) => existentes.has(t));
  if (!existentes.has("Ingresos") && porDefecto) {
    requests.push({ updateSheetProperties: { properties: { sheetId: existentes.get(porDefecto), title: "Ingresos" }, fields: "title" } });
    nuevas.add("Ingresos");
  }
  for (const titulo of ["Resumen", "Ingresos", "Gastos"]) {
    if (existentes.has(titulo) || nuevas.has(titulo)) continue;
    requests.push({ addSheet: { properties: { title: titulo } } });
    nuevas.add(titulo);
  }
  if (requests.length) await lote(requests);
  return { ids: await pestanas(), nuevas };
}

const rango = (sheetId, fila0, fila1, col0, col1) => ({
  sheetId,
  startRowIndex: fila0,
  endRowIndex: fila1,
  startColumnIndex: col0,
  endColumnIndex: col1,
});
const encabezado = (sheetId, col1, fila = 0) => ({
  repeatCell: {
    range: rango(sheetId, fila, fila + 1, 0, col1),
    cell: { userEnteredFormat: { backgroundColor: VERDE, textFormat: { bold: true, foregroundColor: BLANCO } } },
    fields: "userEnteredFormat(backgroundColor,textFormat)",
  },
});
// Filas de datos con formato plano (sin el verde del encabezado), hasta el final de la hoja.
const datosPlanos = (sheetId, col1) => ({
  repeatCell: {
    range: { sheetId, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: col1 },
    cell: { userEnteredFormat: { backgroundColor: BLANCO, textFormat: { bold: false, foregroundColor: NEGRO } } },
    fields: "userEnteredFormat(backgroundColor,textFormat)",
  },
});
const formatoPesos = (sheetId, fila0, col0, col1) => ({
  repeatCell: {
    range: rango(sheetId, fila0, FILAS, col0, col1),
    cell: { userEnteredFormat: { numberFormat: PESOS } },
    fields: "userEnteredFormat.numberFormat",
  },
});
const ancho = (sheetId, col, pixeles) => ({
  updateDimensionProperties: {
    range: { sheetId, dimension: "COLUMNS", startIndex: col, endIndex: col + 1 },
    properties: { pixelSize: pixeles },
    fields: "pixelSize",
  },
});
const propiedades = (sheetId, extra, fields) => ({ updateSheetProperties: { properties: { sheetId, ...extra }, fields } });
const proteger = (sheetId, col1) => ({
  addProtectedRange: {
    protectedRange: {
      range: rango(sheetId, 0, 1, 0, col1),
      description: "Encabezados: no tocar, la app depende de ellos",
      warningOnly: true,
    },
  },
});

// 2) Formato, validaciones y protección de encabezados.
async function darFormato({ ids, nuevas }) {
  const resumen = ids.get("Resumen");
  const ingresos = ids.get("Ingresos");
  const gastos = ids.get("Gastos");
  const requests = [
    propiedades(resumen, { index: 0 }, "index"),
    propiedades(ingresos, { index: 1, gridProperties: { frozenRowCount: 1 } }, "index,gridProperties.frozenRowCount"),
    propiedades(gastos, { index: 2, gridProperties: { frozenRowCount: 1 } }, "index,gridProperties.frozenRowCount"),

    encabezado(ingresos, 4),
    datosPlanos(ingresos, 4),
    formatoPesos(ingresos, 1, 2, 3),
    ancho(ingresos, 0, 110),
    ancho(ingresos, 1, 220),
    ancho(ingresos, 2, 130),
    ancho(ingresos, 3, 100),
    {
      setDataValidation: {
        range: rango(ingresos, 1, FILAS, 3, 4),
        rule: {
          condition: { type: "ONE_OF_LIST", values: ORIGENES.map((userEnteredValue) => ({ userEnteredValue })) },
          showCustomUi: true,
          strict: true,
        },
      },
    },

    encabezado(gastos, 5),
    datosPlanos(gastos, 5),
    formatoPesos(gastos, 1, 2, 3),
    ancho(gastos, 0, 110),
    ancho(gastos, 1, 280),
    ancho(gastos, 2, 130),
    ancho(gastos, 3, 320),
    ancho(gastos, 4, 140),
    {
      setDataValidation: {
        range: rango(gastos, 1, FILAS, 4, 5),
        rule: {
          condition: { type: "ONE_OF_LIST", values: REGISTRADORES.map((userEnteredValue) => ({ userEnteredValue })) },
          showCustomUi: true,
          strict: true,
        },
      },
    },

    encabezado(resumen, 4, 7),
    formatoPesos(resumen, 2, 1, 2), // B3:B6 (meta, recaudado, gastado, saldo)
    formatoPesos(resumen, 8, 1, 3), // B9:C (abonado y falta por persona)
    {
      repeatCell: {
        range: rango(resumen, 0, 1, 0, 1),
        cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 14 } } },
        fields: "userEnteredFormat.textFormat",
      },
    },
    {
      repeatCell: {
        range: rango(resumen, 2, 6, 0, 1),
        cell: { userEnteredFormat: { textFormat: { bold: true } } },
        fields: "userEnteredFormat.textFormat",
      },
    },
    ancho(resumen, 0, 220),
    ancho(resumen, 1, 140),
    ancho(resumen, 2, 140),
    ancho(resumen, 3, 120),
  ];
  // Las protecciones se agregan solo al crear la pestaña, para no duplicarlas al repetir el script.
  if (nuevas.has("Ingresos")) requests.push(proteger(ingresos, 4));
  if (nuevas.has("Gastos")) requests.push(proteger(gastos, 5));
  await lote(requests);
}

// 3) Encabezados y fórmulas. El Resumen se calcula solo a partir de las otras dos pestañas.
// Las fórmulas usan columnas completas (C:C) y no rangos como C2:C: Google Sheets corre el inicio de un
// rango cuando se inserta o borra una fila en su primera fila, y así el Resumen dejaba de contar los datos.
async function escribirContenido() {
  const data = [
    { range: "Ingresos!A1:D1", values: [["Fecha", "Persona", "Monto COP", "Origen"]] },
    { range: "Gastos!A1:E1", values: [["Fecha", "Motivo", "Monto COP", "Evidencia", "Registrado por"]] },
    {
      range: "Resumen!A1:B6",
      values: [
        ["Resumen del paseo", ""],
        ["", ""],
        ["Meta por persona", META],
        ["Total recaudado", "=SUM(Ingresos!C:C)"],
        ["Total gastado", "=SUM(Gastos!C:C)"],
        ["Saldo disponible", "=B4-B5"],
      ],
    },
    { range: "Resumen!A8:D8", values: [["Persona", "Abonado", "Falta", "Estado"]] },
    {
      range: "Resumen!A9:D9",
      values: [
        [
          '=IFERROR(SORT(UNIQUE(FILTER(Ingresos!B:B,Ingresos!B:B<>"",ROW(Ingresos!B:B)>1))),"")',
          '=ARRAYFORMULA(IF(A9:A="","",SUMIF(Ingresos!B:B,A9:A,Ingresos!C:C)))',
          '=ARRAYFORMULA(IF(A9:A="","",IF(B9:B>=$B$3,0,$B$3-B9:B)))',
          '=ARRAYFORMULA(IF(A9:A="","",IF(B9:B>=$B$3,"Completo","Debe")))',
        ],
      ],
    },
  ];
  await pedir("/values:batchUpdate", "POST", { valueInputOption: "USER_ENTERED", data });
}

try {
  const estado = await crearPestanas();
  await darFormato(estado);
  await escribirContenido();
  console.log("Listo. Pestañas:", [...(await pestanas()).keys()].join(", "));
} catch (e) {
  console.error("Falló:", e.response?.status, e.response?.data?.error?.message ?? e.message);
  process.exit(1);
}
