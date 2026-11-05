// Contenido de la pestaña Resumen del Sheet: rótulos y fórmulas. Todo se calcula a partir de Ingresos y Gastos.
// Lo comparten scripts/preparar-sheet.mjs (que arma el Sheet) y src/lib/movimientos.ts (que lo repara si alguien
// borra algo), por eso es un .mjs sin dependencias.
//
// Las fórmulas usan columnas completas (C:C) y no rangos como C2:C: Google Sheets corre el inicio de un rango
// cuando se inserta o borra una fila en su primera fila, y así el Resumen dejaba de contar los datos.
// La tabla de personas sale de UNA fórmula en A9 que se expande hacia abajo: si se borra A9, desaparece toda.

/**
 * Las celdas con contenido del Resumen, para comprobar que siguen ahí. `fila` y `col` empiezan en 0.
 * @param {number} meta
 * @returns {{ fila: number, col: number, valor: string | number }[]}
 */
export function celdasResumen(meta) {
  const celdas = [];
  for (const { range, values } of contenidoResumen(meta)) {
    const inicio = /^Resumen!([A-Z])(\d+)/.exec(range);
    if (!inicio) continue;
    const col0 = inicio[1].charCodeAt(0) - 65;
    const fila0 = Number(inicio[2]) - 1;
    values.forEach((fila, i) =>
      fila.forEach((valor, j) => {
        if (valor !== "") celdas.push({ fila: fila0 + i, col: col0 + j, valor });
      }),
    );
  }
  return celdas;
}

/**
 * @param {number} meta lo que debe abonar cada persona (VIAJE.costoTotal)
 * @returns {{ range: string, values: (string | number)[][] }[]}
 */
export function contenidoResumen(meta) {
  return [
    {
      range: "Resumen!A1:B6",
      values: [
        ["Resumen del paseo", ""],
        ["", ""],
        ["Meta por persona", meta],
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
}
