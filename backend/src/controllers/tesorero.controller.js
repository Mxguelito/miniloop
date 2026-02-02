import { pool } from "../config/db.js";

// =========================================
//  Obtener propietarios con su consorcio
// =========================================
export async function getPropietarios(req, res) {
  try {
    const query = `
      SELECT 
        p.id AS propietario_id,
        p.nombre,
        p.email,
        p.piso,
        p.dpto,
        p.consorcio_id,
        c.nombre AS consorcio_nombre
      FROM propietarios p
      LEFT JOIN consorcios c ON c.id = p.consorcio_id
      ORDER BY p.id;
    `;

    const { rows } = await pool.query(query);

    return res.json(rows);
  } catch (err) {
    console.error("❌ Error obteniendo propietarios:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}
// =========================================
//  Publicar liquidación (BORRADOR -> CERRADA)
// =========================================
export async function publicarLiquidacion(req, res) {
  const { id } = req.params;

  try {
    // 1) Validar que exista y ver su estado actual
    const { rows } = await pool.query(
      "SELECT id, estado FROM liquidaciones WHERE id = $1",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Liquidación no encontrada" });
    }

    const liquidacion = rows[0];

    // 2) Solo se puede publicar si está en BORRADOR (normalizado)
    const estadoDB = String(liquidacion.estado || "")
      .trim()
      .toUpperCase();

    if (estadoDB !== "BORRADOR") {
      return res.status(400).json({
        error: "La liquidación ya fue publicada o no está en borrador",
        estadoActual: liquidacion.estado,
      });
    }

    // 3) Cambiar estado a CERRADA
    await pool.query(
      "UPDATE liquidaciones SET estado = 'CERRADA' WHERE id = $1",
      [id],
    );

    return res.json({
      message: "✅ Liquidación publicada",
      id: liquidacion.id,
      estado: "CERRADA",
    });
  } catch (err) {
    console.error("❌ Error publicando liquidación:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}
// =========================================
//  NUEVO: Obtener datos para dashboard del tesorero
// =========================================
export async function getDashboardTesorero(req, res) {
  try {
    const deudaRes = await pool.query(`
      SELECT COALESCE(SUM(monto_expensa - monto_pagado), 0) AS deuda_total
      FROM saldos
      WHERE monto_expensa > monto_pagado
    `);

    const deudoresRes = await pool.query(`
      SELECT COUNT(DISTINCT propietario_id) AS cantidad
      FROM saldos
      WHERE monto_expensa > monto_pagado
    `);

    const liquidacionesRes = await pool.query(`
      SELECT COUNT(*) AS abiertas
      FROM liquidaciones
      WHERE estado != 'CERRADA'
    `);

    const liquidacionMesRes = await pool.query(`
      SELECT id, estado
      FROM liquidaciones
      WHERE mes = EXTRACT(MONTH FROM CURRENT_DATE)
      AND anio = EXTRACT(YEAR FROM CURRENT_DATE)
      LIMIT 1
    `);

    const liquidacionMes = liquidacionMesRes.rows[0] || null;

    res.json({
      deudaTotal: Number(deudaRes.rows[0].deuda_total),
      cantidadDeudores: Number(deudoresRes.rows[0].cantidad),
      liquidacionesAbiertas: Number(liquidacionesRes.rows[0].abiertas),

      tieneLiquidacionMes: !!liquidacionMes,
      estadoLiquidacionMes: liquidacionMes?.estado || null,
      puedeExportarPDF: liquidacionMes?.estado === "CERRADA",
    });
  } catch (err) {
    console.error("❌ ERROR DASHBOARD TESORERO:", err);
    res.status(500).json({ error: "Error al cargar dashboard del tesorero" });
  }
}

// =========================================
//  NUEVO: Obtener ranking de deudores
// =========================================
export async function getDeudores(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT
        p.id AS propietario_id,
        p.nombre,
        p.piso,
        p.dpto,
        SUM(s.monto_expensa - s.monto_pagado) AS deuda
      FROM saldos s
      JOIN propietarios p ON p.id = s.propietario_id
      WHERE s.monto_expensa > s.monto_pagado
      GROUP BY p.id, p.nombre, p.piso, p.dpto
      ORDER BY deuda DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error obteniendo deudores:", err);
    res.status(500).json({ error: "Error al obtener deudores" });
  }
}
// =========================================
