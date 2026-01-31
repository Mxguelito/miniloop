import { formatMoney } from "../../services/liquidacionesService";

export default function LiquidacionesCards({
  items,
  onVer,
  onExport,
  onDelete,
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-5">
      {items.map((l) => {
        const positivo = Number(l.saldo_mes) >= 0;

        // 🔒 Normalizamos el estado REAL que viene del backend
        const estado = String(l.estado || "")
          .trim()
          .toUpperCase();

        return (
          <div
            key={l.id}
            className="
              relative
              rounded-3xl
              p-5
              bg-gradient-to-br
              from-[#07131c]
              via-[#0b1f2d]
              to-[#07131c]
              border border-cyan-500/20
              shadow-[0_0_35px_rgba(0,180,255,0.25)]
              overflow-hidden
            "
          >
            {/* Glow decorativo */}
            <div
              className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl ${
                positivo
                  ? "bg-emerald-500/20"
                  : "bg-rose-500/20"
              }`}
            />

            <div className="relative z-10">
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-cyan-200/70">
                    {l.mes} / {l.anio}
                  </p>

                  <p
                    className={`text-2xl font-extrabold mt-1 ${
                      positivo
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {formatMoney(l.saldo_mes)}
                  </p>
                </div>

                {/* ESTADO */}
                {estado === "BORRADOR" ? (
                  <span
                    className="
                      inline-flex items-center gap-1
                      px-3 py-1
                      rounded-full
                      text-xs font-semibold
                      bg-yellow-500/20
                      text-yellow-300
                      border border-yellow-400/30
                      shadow-[0_0_12px_rgba(255,200,0,0.35)]
                    "
                  >
                    🟡 Borrador
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex items-center gap-1
                      px-3 py-1
                      rounded-full
                      text-xs font-semibold
                      bg-emerald-500/20
                      text-emerald-400
                      border border-emerald-400/30
                      shadow-[0_0_14px_rgba(0,255,150,0.45)]
                    "
                  >
                    🟢 Cerrada
                  </span>
                )}
              </div>

              {/* ACCIONES */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <button
                  onClick={() => onVer(l.id)}
                  className="
                    py-2 rounded-xl
                    bg-cyan-600/80 hover:bg-cyan-600
                    text-white text-sm font-semibold
                    transition
                  "
                >
                  Ver
                </button>

                <button
                  onClick={() => onExport(l.id)}
                  className="
                    py-2 rounded-xl
                    bg-indigo-600/80 hover:bg-indigo-600
                    text-white text-sm font-semibold
                    transition
                  "
                >
                  PDF
                </button>

                <button
                  onClick={() => onDelete(l.id)}
                  className="
                    py-2 rounded-xl
                    bg-rose-600/80 hover:bg-rose-600
                    text-white text-sm font-semibold
                    transition
                  "
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
