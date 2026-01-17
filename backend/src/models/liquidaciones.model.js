// backend/src/models/liquidaciones.model.js
import { pool } from "../config/db.js";

export async function getLiquidacionById(id) {
  // 1) Datos básicos de la liquidación + nombre de consorcio
  const liqRes = await pool.query(
    `
    SELECT 
      l.*,
      c.nombre AS consorcio_nombre
    FROM liquidaciones l
    LEFT JOIN consorcios c ON c.id = l.consorcio_id
    WHERE l.id = $1
    `,
    [id]
  );

  if (liqRes.rowCount === 0) return null;
  const liq = liqRes.rows[0];

  // 2) Propietarios + saldos (por liquidación)
  const propRes = await pool.query(
  `
  SELECT 
    s.id,
    s.propietario_id,
    u.nombre,
    p.piso,
    p.dpto,
    s.monto_expensa,
    s.monto_pagado
  FROM saldos s
  JOIN propietarios p ON p.id = s.propietario_id
  JOIN usuarios u ON u.id = p.usuario_id
  WHERE s.liquidacion_id = $1
  ORDER BY u.nombre
  `,
  [id]
);


  const propietarios = propRes.rows.map((row) => {
    const expensa = Number(row.monto_expensa || 0);
    const pagado = Number(row.monto_pagado || 0);

    return {
  id: row.id,                 // id del SALDO (para actualizar)
  propietario_id: row.propietario_id,
  nombre: row.nombre,
  piso: row.piso,
  dpto: row.dpto,
  expensaMes: expensa,
  montoAbonado: pagado,
  expensaAdeudada: Math.max(expensa - pagado, 0),
};

  });

  // 3) Movimientos (ingresos / gastos)
  const movRes = await pool.query(
    `
    SELECT 
      id,
      tipo,
      motivo,
      monto
    FROM movimientos
    WHERE liquidacion_id = $1
    ORDER BY id
    `,
    [id]
  );

  const movimientos = movRes.rows.map((m) => ({
    id: m.id,
    tipo: m.tipo,
    motivo: m.motivo,
    monto: Number(m.monto || 0),
  }));

  // 4) Totales (por seguridad los calculamos acá, 
  //    pero el front también puede recalcular)
  const ingresosExpensas = propietarios.reduce(
    (acc, p) => acc + Number(p.montoAbonado || 0),
    0
  );

  const ingresosExtra = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + Number(m.monto || 0), 0);

  const gastos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + Number(m.monto || 0), 0);

  const adeudado = propietarios.reduce(
    (acc, p) => acc + Number(p.expensaAdeudada || 0),
    0
  );

  const ingresosTotales = ingresosExpensas + ingresosExtra;
  // SALDO REAL EN CAJA (NO RESTAR ADEUDADO)
const saldoMes = ingresosExpensas + ingresosExtra - gastos;


  return {
    id: liq.id,
    mes: liq.mes,
    anio: liq.anio,
    consorcio_id: liq.consorcio_id,
    consorcio_nombre: liq.consorcio_nombre,
    creado_en: liq.creado_en,
    estado: liq.estado,
    monto_expensa: Number(liq.monto_expensa || 0),

    propietarios,
    movimientos,
    totales: {
      ingresos: ingresosTotales,
      ingresosExpensas,
      ingresosExtra,
      adeudado,
      gastos,
      saldoMes,
    },
  };
}