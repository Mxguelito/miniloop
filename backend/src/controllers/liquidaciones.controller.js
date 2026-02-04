import { pool } from "../config/db.js";
import { getLiquidacionById } from "../models/liquidaciones.model.js";

// ===============================
// GET /api/liquidaciones
// ===============================
export async function getAll(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        l.id,
        l.mes,
        l.anio,
        l.creado_en,
        l.estado,

        (
          SELECT COALESCE(SUM(s.monto_expensa - s.monto_pagado), 0)
          FROM saldos s
          WHERE s.liquidacion_id = l.id
        ) AS deuda_total,

        (
          SELECT COALESCE(SUM(s.monto_pagado), 0)
          FROM saldos s
          WHERE s.liquidacion_id = l.id
        ) AS ingresos_expensas,

        (
          SELECT COALESCE(SUM(m.monto), 0)
          FROM movimientos m
          WHERE m.liquidacion_id = l.id AND m.tipo = 'ingreso'
        ) AS ingresos_extra,

        (
          SELECT COALESCE(SUM(m.monto), 0)
          FROM movimientos m
          WHERE m.liquidacion_id = l.id AND m.tipo = 'gasto'
        ) AS gastos,

        (
          (SELECT COALESCE(SUM(s.monto_pagado), 0) FROM saldos s WHERE s.liquidacion_id = l.id)
          +
          (SELECT COALESCE(SUM(m.monto), 0) FROM movimientos m WHERE m.liquidacion_id = l.id AND m.tipo='ingreso')
          -
          (SELECT COALESCE(SUM(m.monto), 0) FROM movimientos m WHERE m.liquidacion_id = l.id AND m.tipo='gasto')
        ) AS saldo_mes

      FROM liquidaciones l
      ORDER BY l.anio DESC, l.mes DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error GETALL:", err);
    res.status(500).json({ error: "Error al obtener liquidaciones" });
  }
}

// ===============================
// GET /api/liquidaciones/:id
// ===============================
export async function getById(req, res) {
  try {
    const { id } = req.params;
    const liquidacion = await getLiquidacionById(id);

    if (!liquidacion) {
      return res.status(404).json({ error: "Liquidación no encontrada" });
    }

    res.json(liquidacion);
  } catch (err) {
    console.error("❌ Error GET BY ID:", err);
    res.status(500).json({ error: "Error al obtener liquidación" });
  }
}

// ===============================
// POST /api/liquidaciones
// ===============================
export async function crearLiquidacion(req, res) {
  try {
    const { mes, anio } = req.body;

    // 🔐 Consorcio desde el usuario logueado
    const { rows } = await pool.query(
      "SELECT consorcio_id FROM usuarios WHERE id = $1",
      [req.user.id]
    );

    const consorcio_id = rows[0]?.consorcio_id;
    if (!consorcio_id) {
      return res.status(400).json({ error: "Usuario sin consorcio asignado" });
    }

    // 1️⃣ Crear liquidación VACÍA
    const result = await pool.query(
      `INSERT INTO liquidaciones (mes, anio, consorcio_id, estado)
       VALUES ($1, $2, $3, 'BORRADOR')
       RETURNING *`,
      [mes, anio, consorcio_id]
    );

    const liquidacion = result.rows[0];

    // 2️⃣ Crear saldos en 0 para cada propietario
    const propietarios = await pool.query(
      `SELECT id, piso, dpto FROM propietarios WHERE consorcio_id = $1`,
      [consorcio_id]
    );

    for (const p of propietarios.rows) {
      await pool.query(
        `INSERT INTO saldos 
         (propietario_id, liquidacion_id, monto_expensa, monto_pagado, piso, dpto)
         VALUES ($1, $2, 0, 0, $3, $4)`,
        [p.id, liquidacion.id, p.piso, p.dpto]
      );
    }

    res.json(liquidacion);

  } catch (err) {
    console.error("❌ Error CREAR LIQUIDACIÓN:", err);
    res.status(500).json({ error: "Error al crear liquidación" });
  }
}

// ===============================
// PUT /api/liquidaciones/:id
// ===============================
export async function update(req, res) {
  try {
    const { id } = req.params;
    const { propietarios = [], movimientos = [], estado = "BORRADOR" } = req.body;

    await pool.query(
      `UPDATE liquidaciones SET estado = $1 WHERE id = $2`,
      [estado, id]
    );

    for (const p of propietarios) {
      await pool.query(
        `UPDATE saldos
         SET monto_expensa = $1, monto_pagado = $2
         WHERE id = $3`,
        [p.expensaMes, p.montoAbonado, p.id]
      );
    }

    await pool.query(`DELETE FROM movimientos WHERE liquidacion_id = $1`, [id]);

    for (const m of movimientos) {
      await pool.query(
        `INSERT INTO movimientos (liquidacion_id, tipo, motivo, monto)
         VALUES ($1, $2, $3, $4)`,
        [id, m.tipo, m.motivo, m.monto]
      );
    }

    const fresh = await getLiquidacionById(id);
    res.json(fresh);

  } catch (err) {
    console.error("❌ Error UPDATE:", err);
    res.status(500).json({ error: "Error al actualizar" });
  }
}
