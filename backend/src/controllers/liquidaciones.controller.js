
import { pool } from "../config/db.js";
import { getLiquidacionById } from "../models/liquidaciones.model.js";


// GET /api/liquidaciones

export async function getAll(req, res) {
  try {
   const result = await pool.query(`
  SELECT 
    l.id,
    l.mes,
    l.anio,
    l.creado_en,

    --  Deuda total
    (
      SELECT COALESCE(SUM(s.monto_expensa - s.monto_pagado), 0)
      FROM saldos s
      WHERE s.liquidacion_id = l.id
    ) AS deuda_total,

    --  Ingresos expensas
    (
      SELECT COALESCE(SUM(s.monto_pagado), 0)
      FROM saldos s
      WHERE s.liquidacion_id = l.id
    ) AS ingresos_expensas,

    -- Ingresos extra
    (
      SELECT COALESCE(SUM(m.monto), 0)
      FROM movimientos m
      WHERE m.liquidacion_id = l.id
        AND m.tipo = 'ingreso'
    ) AS ingresos_extra,

    --  Gastos
    (
      SELECT COALESCE(SUM(m.monto), 0)
      FROM movimientos m
      WHERE m.liquidacion_id = l.id
        AND m.tipo = 'gasto'
    ) AS gastos,

    --  SALDO FINAL REAL = expensas + extra - gastos
    (
      (SELECT COALESCE(SUM(s.monto_pagado), 0)
       FROM saldos s WHERE s.liquidacion_id = l.id)
      +
      (SELECT COALESCE(SUM(m.monto), 0)
       FROM movimientos m WHERE m.liquidacion_id = l.id AND m.tipo='ingreso')
      -
      (SELECT COALESCE(SUM(m.monto), 0)
       FROM movimientos m WHERE m.liquidacion_id = l.id AND m.tipo='gasto')
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


// GET /api/liquidaciones/:id

export async function getById(req, res) {
  try {
    const { id } = req.params;
    const item = await getLiquidacionById(id);

    if (!item)
      return res.status(404).json({ error: "Liquidación no encontrada" });

    res.json(item);

  } catch (err) {
    console.error("❌ Error GET BY ID:", err);
    res.status(500).json({ error: "Error al obtener liquidación" });
  }
}


// POST /api/liquidaciones

export const crearLiquidacion = async (req, res) => {
  try {
    let { mes, anio, consorcioId, monto_expensa } = req.body;

    const consorcio_id = consorcioId;

    // 1) Crear liquidación
    const result = await pool.query(
      `INSERT INTO liquidaciones (mes, anio, consorcio_id, monto_expensa, estado)
       VALUES ($1, $2, $3, $4, 'Borrador')
       RETURNING *`,
      [mes, anio, consorcio_id, monto_expensa]
    );

    const nuevaLiquidacion = result.rows[0];

    // 2) Obtener propietarios con sus datos completos
    const propietariosRes = await pool.query(
      `SELECT id, piso, dpto 
       FROM propietarios 
       WHERE consorcio_id = $1`,
      [consorcio_id]
    );

    // 3) Crear saldo inicial para cada propietario (PISO / DPTO INCLUIDOS)
    for (const p of propietariosRes.rows) {
      await pool.query(
        `INSERT INTO saldos (
           propietario_id,
           liquidacion_id,
           monto_expensa,
           monto_pagado,
           piso,
           dpto
         ) VALUES ($1, $2, 0, 0, $3, $4)`,
        [p.id, nuevaLiquidacion.id, p.piso, p.dpto]
      );
    }

    return res.json(nuevaLiquidacion);

  } catch (err) {
    console.error("❌ Error CREAR LIQUIDACIÓN:", err);
    return res.status(500).json({ error: "Error al crear liquidación" });
  }
};
 


// PUT /api/liquidaciones/:id

export async function update(req, res) {
 try {
  const { id } = req.params;
  const {
    propietarios = [],
    movimientos = [],
    estado = "Borrador"
  } = req.body;

  // 1) Actualizar estado de la liquidación
  await pool.query(
    `UPDATE liquidaciones 
     SET estado = $1
     WHERE id = $2`,
    [estado, id]
  );

  // 2) Actualizar propietarios (expensas + pagos)
  for (const p of propietarios) {
   await pool.query(
  `UPDATE saldos
   SET monto_expensa = $1,
       monto_pagado = $2,
       piso = $3,
       dpto = $4
   WHERE id = $5`,
  [p.expensaMes, p.montoAbonado, p.piso, p.dpto, p.id]
);

  }

  // 3) Limpiar movimientos anteriores
  await pool.query(
    `DELETE FROM movimientos WHERE liquidacion_id = $1`,
    [id]
  );

  // 4) Insertar nuevos movimientos
  for (const m of movimientos) {
    await pool.query(
      `INSERT INTO movimientos (liquidacion_id, tipo, motivo, monto)
       VALUES ($1, $2, $3, $4)`,
      [id, m.tipo, m.motivo, m.monto]
    );
  }

  // 5) Devolver datos frescos
  const fresh = await getLiquidacionById(id);
  res.json(fresh);

} catch (err) {
  console.error("❌ Error UPDATE:", err);
  return res.status(500).json({ error: "Error al actualizar" });
}

}

// DELETE /api/liquidaciones/:id

export async function eliminar(req, res) {
  try {
    const { id } = req.params;

    // 1) Borrar movimientos asociados
    await pool.query(
      `DELETE FROM movimientos WHERE liquidacion_id = $1`,
      [id]
    );

    // 2) Borrar saldos asociados
    await pool.query(
      `DELETE FROM saldos WHERE liquidacion_id = $1`,
      [id]
    );

    // 3) Borrar la liquidación
    const result = await pool.query(
      `DELETE FROM liquidaciones WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Liquidación no encontrada" });
    }

    return res.json({ message: "Liquidación eliminada correctamente" });

  } catch (err) {
    console.error("❌ Error DELETE:", err);
    res.status(500).json({ error: "Error al eliminar la liquidación" });
  }
}

// PUT COMPLETO /api/liquidaciones/:id/full-update

export async function fullUpdate(req, res) {
  try {
    const { id } = req.params;
    const {
      propietarios = [],
      movimientos = [],
      estado = "Borrador",
    } = req.body;

    
    // 1) ACTUALIZAR CABECERA
  
    await pool.query(
      `UPDATE liquidaciones 
       SET estado = $1
       WHERE id = $2`,
      [estado, id]
    );

   
    // 2) ACTUALIZAR SALDOS DE PROPIETARIOS
   
    for (const p of propietarios) {
      await pool.query(
        `UPDATE saldos
         SET monto_expensa = $1,
             monto_pagado = $2
         WHERE id = $3`,
        [
          Number(p.expensaMes || 0),
          Number(p.montoAbonado || 0),
          p.id,
        ]
      );
    }

    
    // 3) ACTUALIZAR / INSERTAR / BORRAR MOVIMIENTOS
    
    for (const m of movimientos) {
      // Movimiento nuevo (id temporal generado por front → Date.now())
      if (String(m.id).length > 10) {
        await pool.query(
          `INSERT INTO movimientos (liquidacion_id, tipo, motivo, monto)
           VALUES ($1, $2, $3, $4)`,
          [id, m.tipo, m.motivo, Number(m.monto || 0)]
        );
      } else {
        // Movimiento existente → actualizar
        await pool.query(
          `UPDATE movimientos
           SET tipo = $1,
               motivo = $2,
               monto = $3
           WHERE id = $4`,
          [m.tipo, m.motivo, Number(m.monto || 0), m.id]
        );
      }
    }

    
    // 4) RECARGAR LIQUIDACIÓN COMPLETA
    
    const full = await getLiquidacionById(id);

    res.json(full);

  } catch (err) {
    console.error("❌ FULL UPDATE ERROR:", err);
    res.status(500).json({ error: "Error en actualización completa" });
  }
}

