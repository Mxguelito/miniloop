export default function LiquidacionMovimientos({
  movimientos = [],
  onAddMovimiento,
  onUpdateMovimiento,
  onDeleteMovimiento,
}) {
  return (
    <div className="mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-white">
          Movimientos
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => onAddMovimiento("ingreso")}
            className="
              px-4 py-2 rounded-xl text-sm font-semibold
              bg-green-600 hover:bg-green-700
              text-white shadow-lg transition
            "
          >
            + Ingreso
          </button>

          <button
            onClick={() => onAddMovimiento("gasto")}
            className="
              px-4 py-2 rounded-xl text-sm font-semibold
              bg-red-600 hover:bg-red-700
              text-white shadow-lg transition
            "
          >
            + Gasto
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* Línea */}
        <div className="absolute top-0 left-2 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/10 to-transparent" />

        <div className="flex flex-col gap-6">
          {movimientos.map((m) => {
            const ingreso = m.tipo === "ingreso";

            return (
              <div
                key={m.id}
                className="
                  relative rounded-3xl p-5
                  bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220]
                  border border-cyan-500/10
                  shadow-[0_0_30px_rgba(0,180,255,0.08)]
                "
              >
                {/* Punto timeline */}
                <div
                  className={`
                    absolute -left-6 top-6 w-3 h-3 rounded-full
                    ${
                      ingreso
                        ? "bg-green-400 shadow-[0_0_15px_rgba(0,255,150,0.8)]"
                        : "bg-red-400 shadow-[0_0_15px_rgba(255,80,80,0.8)]"
                    }
                  `}
                />

                {/* Header card */}
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className={`text-lg font-bold ${
                      ingreso ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {ingreso ? "Ingreso" : "Gasto"}
                  </h3>

                  <button
                    onClick={() => onDeleteMovimiento(m.id)}
                    className="text-gray-400 hover:text-red-400 transition text-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Campos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Motivo */}
                  <div>
                    <label className="text-xs text-gray-400">Motivo</label>
                    <input
                      value={m.motivo || ""}
                      onChange={(e) =>
                        onUpdateMovimiento(m.id, "motivo", e.target.value)
                      }
                      className="
                        w-full mt-1 px-3 py-2 rounded-xl
                        bg-gray-900/80 border border-gray-700
                        text-gray-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-cyan-500/40
                      "
                    />
                  </div>

                  {/* Monto */}
                  <div>
                    <label className="text-xs text-gray-400">Monto</label>
                    <input
                      type="number"
                      value={m.monto ?? 0}
                      onChange={(e) =>
                        onUpdateMovimiento(
                          m.id,
                          "monto",
                          Number(e.target.value),
                        )
                      }
                      className="
                        w-full mt-1 px-3 py-2 rounded-xl
                        bg-gray-900/80 border border-gray-700
                        text-gray-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-cyan-500/40
                      "
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {movimientos.length === 0 && (
            <div className="text-gray-400 text-sm">
              No hay movimientos registrados aún.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
