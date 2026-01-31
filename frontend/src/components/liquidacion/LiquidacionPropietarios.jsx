export default function LiquidacionPropietarios({
  propietarios = [],
  onUpdatePropietario,
  onRegistrarPago,
}) {
  return (
    <div className="mb-16">
      {/* Título */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-white">
          Propietarios
        </h2>

        <span className="text-sm text-gray-400">
          {propietarios.length} registrados
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {propietarios.map((p) => {
          const adeuda = Number(p.expensaAdeudada || 0) > 0;

          return (
            <div
              key={p.id}
              className={`
                relative rounded-3xl p-5
                bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220]
                border ${adeuda ? "border-red-500/30" : "border-cyan-500/20"}
                shadow-[0_0_30px_rgba(0,180,255,0.08)]
                transition-all duration-300
                hover:scale-[1.02]
              `}
            >
              {/* Glow */}
              <div
                className={`
                  absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl
                  ${adeuda ? "bg-red-500/20" : "bg-cyan-500/20"}
                `}
              />

              <div className="relative z-10 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {p.nombre || "Propietario"}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Piso {p.piso ?? "-"} · Dpto {p.dpto ?? "-"}
                    </p>
                  </div>

                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        adeuda
                          ? "bg-red-500/15 text-red-300 border border-red-500/30"
                          : "bg-green-500/15 text-green-300 border border-green-500/30"
                      }
                    `}
                  >
                    {adeuda ? "Adeuda" : "Al día"}
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">
                      Expensa
                    </label>
                    <input
                      type="number"
                      value={p.expensaMes ?? 0}
                      onChange={(e) =>
                        onUpdatePropietario(
                          p.id,
                          "expensaMes",
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

                  <div>
                    <label className="text-xs text-gray-400">
                      Pagó
                    </label>
                    <input
                      type="number"
                      value={p.montoAbonado ?? 0}
                      onChange={(e) =>
                        onUpdatePropietario(
                          p.id,
                          "montoAbonado",
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

                {/* Adeudado */}
                <div
                  className={`
                    mt-2 px-4 py-2 rounded-xl text-sm font-semibold
                    ${
                      adeuda
                        ? "bg-red-500/10 text-red-300 border border-red-500/30"
                        : "bg-green-500/10 text-green-300 border border-green-500/30"
                    }
                  `}
                >
                  Adeudado: ${p.expensaAdeudada ?? 0}
                </div>

                {/* Acción */}
                <button
                  onClick={() => onRegistrarPago(p)}
                  className="
                    mt-2 px-4 py-2 rounded-xl text-sm font-semibold
                    bg-cyan-600 hover:bg-cyan-700
                    text-white shadow-lg transition
                  "
                >
                  Registrar pago
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
