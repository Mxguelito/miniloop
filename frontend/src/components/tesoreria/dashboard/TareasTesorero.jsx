export default function TareasTesorero({
  tieneLiquidacionMes,
  estadoLiquidacionMes,
  pagosPendientes,
  movimientosPendientes,
}) {
  const tareas = [
    {
      label: "Generar liquidación del mes",
      done: Boolean(tieneLiquidacionMes),
    },
    {
      label: "Registrar pagos pendientes",
      done: pagosPendientes === 0,
    },
    {
      label: "Revisar movimientos",
      done: !movimientosPendientes,
    },
    {
      label: "Exportar PDF del mes",
      done: estadoLiquidacionMes === "CERRADA",
    },
  ];


  return (
    <div
      className="
        relative
        rounded-3xl
        p-6
        bg-gradient-to-br
        from-[#12030f]
        via-[#220517]
        to-[#12030f]
        border border-pink-500/30
        shadow-[0_0_40px_rgba(255,0,120,0.35)]
        overflow-hidden
      "
    >
      {/* Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <h2 className="text-xl font-extrabold text-pink-300 mb-4">
          📝 Tareas del tesorero
        </h2>

        <ul className="space-y-3">
          {tareas.map((t, i) => (
            <li
              key={i}
              className="
                flex items-center justify-between
                bg-black/30
                rounded-xl
                px-4 py-3
                border border-pink-500/20
              "
            >
              <span
                className={`text-sm font-medium ${
                  t.done
                    ? "text-green-400 line-through opacity-70"
                    : "text-pink-200"
                }`}
              >
                {t.label}
              </span>

              <span
                className={`
                  text-xs px-3 py-1 rounded-full font-semibold
                  ${
                    t.done
                      ? "bg-green-500/30 text-green-300"
                      : "bg-pink-500/30 text-pink-300"
                  }
                `}
              >
                {t.done ? "Listo" : "Pendiente"}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-pink-200/50 mt-4 italic">
          * Estado calculado automáticamente según el sistema
        </p>
      </div>
    </div>
  );
}
