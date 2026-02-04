import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// CONFIG + HELPERS

const LOGO_WIDTH = 28;

function monthName(m) {
  const nombres = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return nombres[(m ?? 1) - 1] || "";
}

function money(n) {
  const v = Number(n || 0);
  return v.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

// EXPORT PRINCIPAL

export function exportLiquidacionPDF(liq, opts = {}) {
  const {
    logoBase64 = null,
    brand = "HurbanLoop",
    brandSubtitle = "MiniLoop • Gestión de Consorcios",
    themeColor = [47, 97, 255], // azul Tesla
  } = opts;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const topY = 36;

  // ENCABEZADO

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 36, topY, LOGO_WIDTH, LOGO_WIDTH);
  }

  const titleX = logoBase64 ? 36 + LOGO_WIDTH + 12 : 36;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.text(brand, titleX, topY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(brandSubtitle, titleX, topY + 28);

  // Título principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30);
  doc.text(
    `Liquidación ${monthName(liq?.mes)} ${liq?.anio || ""}`,
    36,
    topY + 60,
  );

  // Estado
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Estado: ${liq?.estado || "Borrador"}`, 36, topY + 76);

  // Línea Tesla
  doc.setDrawColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.setLineWidth(1);
  doc.line(36, topY + 88, pageWidth - 36, topY + 88);

  let currentY = topY + 110;

  // TABLA PROPIETARIOS

  autoTable(doc, {
    startY: currentY,
    head: [["Nombre", "Piso", "Dpto", "Expensa", "Abonado", "Adeudado"]],
    body: (liq.propietarios || []).map((p) => [
      p.nombre || "",
      p.piso || "",
      p.dpto ?? "-", // ✅
      money(p.expensaMes || 0),
      money(p.montoAbonado || 0),
      money(p.expensaAdeudada || 0),
    ]),

    headStyles: {
      fillColor: themeColor,
      textColor: 255,
      halign: "center",
      fontSize: 12,
      cellPadding: 6,
    },

    bodyStyles: {
      fontSize: 10,
      cellPadding: 6,
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },

    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 5) {
        const adeuda = liq.propietarios[data.row.index]?.expensaAdeudada || 0;

        if (adeuda > 0) {
          data.cell.styles.textColor = [200, 0, 0];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // NUEVA POSICIÓN Y
  currentY = doc.lastAutoTable.finalY + 30;

  // TABLA MOVIMIENTOS

  autoTable(doc, {
    startY: currentY,
    head: [["Tipo", "Motivo", "Monto"]],
    body: (liq.movimientos || []).map((m) => [
      m.tipo || "",
      m.motivo || "",
      money(m.monto || 0),
    ]),

    headStyles: {
      fillColor: themeColor,
      textColor: 255,
      halign: "center",
      fontSize: 12,
      cellPadding: 6,
    },

    bodyStyles: {
      fontSize: 10,
      cellPadding: 6,
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // NUEVA POSICIÓN Y
  currentY = doc.lastAutoTable.finalY + 30;

  // TOTALES

  const T = liq.totales || {};

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30);
  doc.text("Totales", 36, currentY);

  autoTable(doc, {
    startY: currentY + 10,
    head: [["Concepto", "Monto"]],
    body: [
      ["Ingresos expensas", money(T.ingresosExpensas)],
      ["Ingresos extra", money(T.ingresosExtra)],
      ["Adeudado total", money(T.adeudado)],
      ["Gastos", money(T.gastos)],
      ["Saldo del mes", money(T.saldoMes)],
    ],

    headStyles: {
      fillColor: themeColor,
      textColor: 255,
      halign: "center",
      fontSize: 12,
      cellPadding: 6,
    },

    bodyStyles: {
      fontSize: 10,
      cellPadding: 6,
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },

    columnStyles: {
      1: { halign: "right" },
    },

    didParseCell: (d) => {
      if (d.section === "body" && d.row.index === 4) {
        d.cell.styles.fontStyle = "bold";
        d.cell.styles.textColor =
          T.saldoMes >= 0 ? [34, 197, 94] : [239, 68, 68];
      }
    },
  });

  // RANKING DE DEUDORES (POR MES)

  const deudores = [];

  (liq.propietarios || []).forEach((p) => {
    const adeuda = p.expensaAdeudada || 0;

    if (adeuda > 0) {
      const existente = deudores.find((d) => d.nombre === p.nombre);

      if (existente) {
        existente.monto += adeuda;
      } else {
        deudores.push({
          nombre: p.nombre,
          piso: p.piso || "-",
          departamento: p.dpto || "-", // ✅
          monto: adeuda,
        });
      }
    }
  });

  // Ordenar de mayor a menor deuda
  deudores.sort((a, b) => b.monto - a.monto);

  if (deudores.length > 0) {
    // Más espacio arriba (35 px)
    const baseY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 90) + 35;

    // Título estilizado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 85);
    doc.text("Ranking de Deudores", pageWidth / 2, baseY, { align: "center" });

    // Línea glow centrada
    doc.setDrawColor(255, 0, 85);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 60, baseY + 4, pageWidth / 2 + 60, baseY + 4);

    // Nuevo espacio para comenzar la tabla
    const startY = baseY + 18;

    const body = deudores.map((d, index) => [
      index + 1,
      d.nombre.toUpperCase(),
      `${d.piso}° ${d.departamento.toUpperCase()}`,
      `\$ ${d.monto.toLocaleString("es-AR")}`,
    ]);

    autoTable(doc, {
      startY,
      head: [["#", "Propietario", "Unidad", "Deuda"]],
      body,

      //  Estilo general Tesla
      theme: "grid",
      // Centrado de tabla
      tableWidth: 220,
      margin: { left: (pageWidth - 220) / 2 },

      styles: {
        fontSize: 10,
        cellPadding: 4,
      },

      headStyles: {
        fillColor: [255, 0, 85], // Rosa Tesla fuerte
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },

      bodyStyles: {
        halign: "center",
      },

      // Filas alternadas en rosa muy suave
      alternateRowStyles: {
        fillColor: [255, 235, 241],
      },

      // Ancho de columnas prolijo
      columnStyles: {
        0: { cellWidth: 12 }, // #
        1: { cellWidth: 90 }, // Propietario
        2: { cellWidth: 50 }, // Unidad
        3: { cellWidth: 60 }, // Deuda
      },
    });
  }

  // GUARDAR ARCHIVO

  doc.save(`Liquidacion_${monthName(liq.mes)}_${liq.anio}.pdf`);
}
