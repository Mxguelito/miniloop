import { pool } from "../config/db.js";

// ===============================================
//  Obtener todas las liquidaciones de un propietario
// ===============================================
export async function getLiquidacionesPropietario(req, res) {
  try {
    const userId = req.user.id;

    // 1) Traer ID real del propietario
    const prop = await pool.query(
      `SELECT id FROM propietarios WHERE usuario_id = $1`,
      [userId]
    );

    if (prop.rowCount === 0) {
      return res.json([]);
    }

    const propietarioId = prop.rows[0].id;

    // 2) Traer liquidaciones del propietario real
   const query = `
  SELECT 
    l.id AS liquidacion_id,
    l.mes,
    l.anio,
    s.monto_expensa AS "expensaTotal",
    s.monto_pagado AS pagado,
    (s.monto_expensa - s.monto_pagado) AS pendiente,
    CASE
      WHEN s.monto_pagado >= s.monto_expensa THEN 'Pagado'
      WHEN s.monto_pagado = 0 THEN 'Pendiente'
      ELSE 'Parcial'
    END AS estado
  FROM saldos s
  INNER JOIN liquidaciones l ON l.id = s.liquidacion_id
  WHERE s.propietario_id = $1
    AND l.estado = 'CERRADA'
  ORDER BY l.anio DESC, l.mes DESC
`;


    const { rows } = await pool.query(query, [propietarioId]);

    return res.json(rows);

  } catch (err) {
    console.error("❌ Error en getLiquidacionesPropietario:", err);
    return res.status(500).json({ error: "Error obteniendo liquidaciones del propietario" });
  }
}

// =====================================================
//  Obtener la última liquidación completa del propietario
// =====================================================
export async function getLiquidacionActualPropietario(req, res) {
  try {
    const userId = req.user.id;

    // 1) Traer ID propietario real
    const prop = await pool.query(
      `SELECT id FROM propietarios WHERE usuario_id = $1`,
      [userId]
    );

    if (prop.rowCount === 0) {
      return res.json({ mensaje: "No hay liquidaciones" });
    }

    const propietarioId = prop.rows[0].id;

    // 2) Buscar última liquidación del propietario
    const liq = await pool.query(
  `
  SELECT s.liquidacion_id
  FROM saldos s
  JOIN liquidaciones l ON l.id = s.liquidacion_id
  WHERE s.propietario_id = $1
    AND l.estado = 'CERRADA'
  ORDER BY s.liquidacion_id DESC
  LIMIT 1
  `,
  [propietarioId]
);


    if (liq.rowCount === 0) {
      return res.json({ mensaje: "No hay liquidaciones" });
    }

    const liquidacionId = liq.rows[0].liquidacion_id;

    // 3) Detalle
    const { rows: detalle } = await pool.query(
      `
      SELECT 
        p.nombre,
        p.piso,
        p.dpto,
        s.monto_expensa,
        s.monto_pagado,
        (s.monto_expensa - s.monto_pagado) AS pendiente,
        l.mes,
        l.anio,
        l.estado,
        l.creado_en
      FROM saldos s
      INNER JOIN propietarios p ON p.id = s.propietario_id
      INNER JOIN liquidaciones l ON l.id = s.liquidacion_id
      WHERE s.propietario_id = $1 AND s.liquidacion_id = $2
      `,
      [propietarioId, liquidacionId]
    );

    return res.json(detalle[0]);

  } catch (err) {
    console.error("❌ Error en getLiquidacionActualPropietario:", err);
    return res.status(500).json({ error: "Error obteniendo liquidación actual" });
  }
}

// ===============================================
//  Obtener datos del propietario logueado
// ===============================================
export async function getMiPropietario(req, res) {
  try {
    const userId = req.user.id;

    // 1) Traer datos básicos
    const propRes = await pool.query(
      `SELECT id, nombre, email, telefono, piso, dpto, usuario_id, consorcio_id, unidad
       FROM propietarios
       WHERE usuario_id = $1`,
      [userId]
    );

    if (propRes.rowCount === 0) {
      return res.status(404).json({ message: "No se encontraron datos del propietario." });
    }

    const propietario = propRes.rows[0];

    // 2) Traer última liquidación
  const liqRes = await pool.query(
  `
  SELECT 
    COALESCE(s.monto_expensa, 0) AS expensaActual,
    COALESCE(s.monto_pagado, 0) AS pagado,
    COALESCE(s.monto_expensa - s.monto_pagado, 0) AS pendiente,
    l.mes,
    l.anio
  FROM saldos s
  JOIN liquidaciones l ON l.id = s.liquidacion_id
  WHERE s.propietario_id = $1
  ORDER BY l.anio DESC, l.mes DESC
  LIMIT 1
  `,
  [propietario.id]
);



    let resumen = {
  expensaactual: 0,
  pagado: 0,
  pendiente: 0,
  mes: null,
  anio: null
};


    if (liqRes.rowCount > 0) resumen = liqRes.rows[0];

   // 3) Enviar TODO al frontend — JSON COMPLETO Y CORRECTO
return res.json({
  id: propietario.id,
  nombre: propietario.nombre,
  email: propietario.email,
  telefono: propietario.telefono,
  piso: propietario.piso,
  dpto: propietario.dpto,
  usuario_id: propietario.usuario_id,
  consorcio_id: propietario.consorcio_id,
  unidad: propietario.unidad,

  // RESUMEN DE LA ÚLTIMA LIQUIDACIÓN
  expensaActual: Number(resumen.expensaactual),


  montoPagado: Number(resumen.pagado),
  montoPendiente: Number(resumen.pendiente),

  mes: resumen.mes,
  anio: resumen.anio
});


  } catch (err) {
    console.error("❌ Error en getMiPropietario:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}
export async function actualizarMiTelefono(req, res) {
  try {
    const userId = req.user.id;
    const { telefono } = req.body;

    // validación simple MVP
    if (telefono === undefined) {
      return res.status(400).json({ message: "Telefono es requerido" });
    }

    const result = await pool.query(
      `
      UPDATE propietarios
      SET telefono = $1
      WHERE usuario_id = $2
      RETURNING id, nombre, email, telefono, piso, dpto, unidad, consorcio_id, usuario_id
      `,
      [telefono, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Propietario no encontrado." });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error en actualizarMiTelefono:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}

export async function crearSolicitudUnidad(req, res) {
  try {
    const userId = req.user.id;
    const { piso, dpto, unidad } = req.body;

    // 1) Buscar propietario real por usuario_id
    const propRes = await pool.query(
      `SELECT id FROM propietarios WHERE usuario_id = $1`,
      [userId]
    );

    if (propRes.rowCount === 0) {
      return res.status(404).json({ message: "Propietario no encontrado." });
    }

    const propietarioId = propRes.rows[0].id;

    // 2) (Opcional MVP) evitar múltiples solicitudes pending
    const pendingRes = await pool.query(
      `SELECT id FROM solicitudes_unidad WHERE propietario_id = $1 AND estado = 'pending' LIMIT 1`,
      [propietarioId]
    );

    if (pendingRes.rowCount > 0) {
      return res.status(400).json({
        message: "Ya tenés una solicitud pendiente. Esperá aprobación.",
      });
    }

    // 3) Crear solicitud
    const result = await pool.query(
      `
      INSERT INTO solicitudes_unidad (propietario_id, piso, dpto, unidad, estado)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *
      `,
      [propietarioId, piso ?? null, dpto ?? null, unidad ?? null]
    );

    return res.json({
      message: "Solicitud enviada. Queda pendiente de aprobación.",
      solicitud: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error en crearSolicitudUnidad:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}



// ===============================================
//  Actualizar propietario (PISO / DPTO)
// ===============================================
export async function actualizarPropietario(req, res) {
  try {
    const { id } = req.params;
    const { piso, dpto } = req.body;

    await pool.query(
      `UPDATE propietarios
       SET piso = $1, dpto = $2
       WHERE id = $3`,
      [piso, dpto, id]
    );

    return res.json({ message: "Propietario actualizado correctamente" });

  } catch (err) {
    console.error("❌ Error al actualizar propietario:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}
// ===============================================
// 🔵 Obtener DETALLE COMPLETO para PDF del propietario
// ===============================================
export async function getLiquidacionPropietarioById(req, res) {
  try {
    const userId = req.user.id;
    const liquidacionId = req.params.id;

    // 1) Buscar propietario real
    const propRes = await pool.query(
      `SELECT id, nombre, piso, dpto 
       FROM propietarios WHERE usuario_id = $1`,
      [userId]
    );

    if (propRes.rowCount === 0) {
      return res.status(404).json({ message: "Propietario no encontrado." });
    }

    const propietario = propRes.rows[0];

    // 2) Datos de liquidación + saldo
    const liqRes = await pool.query(
      `
      SELECT 
        l.id AS liquidacion_id,
        l.mes,
        l.anio,
        l.estado,
        l.creado_en,
        c.nombre AS consorcio_nombre,
        s.monto_expensa AS "expensaTotal",
s.monto_pagado AS pagado,
(s.monto_expensa - s.monto_pagado) AS pendiente

      FROM saldos s
      INNER JOIN liquidaciones l ON l.id = s.liquidacion_id
      LEFT JOIN consorcios c ON c.id = l.consorcio_id
      WHERE s.propietario_id = $1 
  AND l.id = $2
  AND l.estado = 'CERRADA'

      LIMIT 1
      `,
      [propietario.id, liquidacionId]
    );

    if (liqRes.rowCount === 0) {
      return res.status(404).json({ message: "No existe esta liquidación." });
    }

    const liq = liqRes.rows[0];

    // 3) Movimientos del mes (los mismos del tesorero)
    const movRes = await pool.query(
      `
      SELECT tipo, motivo, monto
      FROM movimientos
      WHERE liquidacion_id = $1
      `,
      [liquidacionId]
    );

    const movimientos = movRes.rows;

    // 4) Armamos formato igual al tesorero (pero con 1 propietario)
    const propietarios = [
  {
    nombre: propietario.nombre,
    piso: propietario.piso,
    departamento: propietario.dpto,

    // ✔ Usa el mismo dato que ve el PROPIETARIO en pantalla
    expensaMes: liq.expensaTotal ?? liq.monto_expensa,

    // ✔ Usa el mismo dato que ve el PROPIETARIO en pantalla
    montoAbonado: liq.pagado ?? liq.monto_pagado,

    expensaAdeudada: liq.pendiente,
  },
];


    // 5) Totales automáticos
    const totales = {
      ingresosExpensas: liq.monto_pagado,
      ingresosExtra: movimientos
        .filter((m) => m.tipo === "ingreso")
        .reduce((acc, m) => acc + Number(m.monto), 0),
      adeudado: liq.pendiente,
      gastos: movimientos
        .filter((m) => m.tipo === "gasto")
        .reduce((acc, m) => acc + Number(m.monto), 0),
      saldoMes: 0,
    };

    totales.saldoMes =
      totales.ingresosExpensas + totales.ingresosExtra - totales.gastos;

    // 6) Respuesta final COMPLETA
    return res.json({
      ...liq,
      propietarios,
      movimientos,
      totales,
    });

  } catch (err) {
    console.error("❌ Error en getLiquidacionPropietarioById:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}


