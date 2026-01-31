import { formatMoney } from "../../../services/liquidacionesService";

export default function DeudoresDelMes({ deudores = [] }) {
  return (
    <div
      className="
        relative
        rounded-3xl
        p-6
        bg-gradient-to-br
        from-[#1a0f02]
        via-[#2b1603]
        to-[#1a0f02]
        border border-yellow-500/30
        shadow-[0_0_40px_rgba(255,200,0,0.35)]
        overflow-hidden
      "
    >
      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <h2 className="text-xl font-extrabold text-yellow-300 mb-4">
          🚨 Deudores del mes
        </h2>

        {deudores.length === 0 ? (
          <p className="text-sm text-yellow-200/70">
            No hay deudores 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {deudores.map((d, i) => {
              const meses = d.mesesAdeudados ?? 1;

              return (
                <div
                  key={i}
                  className="
                    flex justify-between items-center
                    bg-black/30
                    rounded-xl
                    px-4 py-3
                    border border-yellow-500/20
                  "
                >
                  {/* INFO */}
                  <div>
                    <p className="text-yellow-200 font-semibold">
                      {d.nombre}
                    </p>
                    <p className="text-xs text-yellow-200/60">
                      Piso {d.piso} · Dpto {d.departamento}
                    </p>
                  </div>

                  {/* MONTO + BADGE */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-300">
                      {formatMoney(d.monto)}
                    </p>

                    <span
                      className={`
                        text-xs px-2 py-1 rounded-full font-semibold
                        ${
                          meses >= 3
                            ? "bg-red-500/30 text-red-300"
                            : "bg-yellow-500/30 text-yellow-300"
                        }
                      `}
                    >
                      {meses} mes{meses > 1 ? "es" : ""} en deuda
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-yellow-200/50 mt-4 italic">
          * Datos calculados automáticamente desde las liquidaciones
        </p>
      </div>
    </div>
  );
}
