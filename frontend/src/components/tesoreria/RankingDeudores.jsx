import { formatMoney } from "../../services/liquidacionesService";

export default function RankingDeudores({ deudores }) {
  if (!deudores || deudores.length === 0) return null;

  return (
    <div className="mt-14">
      {/* Título */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-rose-400 text-center mb-8">
        Ranking de Deudores
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deudores.map((d, i) => (
          <div
            key={i}
            className="
              relative
              rounded-3xl
              p-5
              bg-gradient-to-br
              from-[#1a070c]
              via-[#220a12]
              to-[#140609]
              border border-rose-500/30
              shadow-[0_0_35px_rgba(255,0,80,0.25)]
              overflow-hidden
            "
          >
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-rose-300">
                  #{i + 1} — {d.nombre}
                </h3>

                <span className="text-xs text-rose-200/70">
                  Piso {d.piso} · Dpto {d.departamento}
                </span>
              </div>

              {/* Monto */}
              <p className="text-3xl font-extrabold text-rose-400">
                {formatMoney(d.monto)}
              </p>

              {/* Badge */}
              <div className="mt-4">
                <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  Deuda pendiente
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
