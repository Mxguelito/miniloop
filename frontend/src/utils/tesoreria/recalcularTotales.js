export function recalcularTotales(propietarios = [], movimientos = []) {
  const propietariosActualizados = propietarios.map((p) => {
    const expensa = Number(p.expensaMes || 0);
    const abonado = Number(p.montoAbonado || 0);

    return {
      ...p,
      expensaAdeudada: Math.max(expensa - abonado, 0),
    };
  });

  const ingresosExpensas = propietariosActualizados.reduce(
    (acc, p) => acc + Number(p.montoAbonado || 0),
    0
  );

  const adeudado = propietariosActualizados.reduce(
    (acc, p) => acc + Number(p.expensaAdeudada || 0),
    0
  );

  const ingresosExtra = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + Number(m.monto || 0), 0);

  const gastos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + Number(m.monto || 0), 0);

  const ingresosTotales = ingresosExpensas + ingresosExtra;
  const saldoMes = ingresosTotales - gastos;

  return {
    propietarios: propietariosActualizados,
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
