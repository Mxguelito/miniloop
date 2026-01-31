import { formatMoney } from "../../services/liquidacionesService";

export default function LiquidacionSaldo({ saldo }) {
  if (saldo === undefined || saldo === null) return null;

  const positivo = Number(saldo) >= 0;

  return (
    <div
      className={`
        relative mb-14 rounded-3xl p-8 md:p-10
        overflow-hidden
        border
        ${
          positivo
            ? "bg-gradient-to-br from-green-500/20 via-green-700/10 to-green-900/10 border-green-500/20 shadow-[0_0_60px_rgba(0,255,150,0.18)]"
            : "bg-gradient-to-br from-red-500/20 via-red-700/10 to-red-900/10 border-red-500/20 shadow-[0_0_60px_rgba(255,80,80,0.18)]"
        }
      `}
    >
      {/* Glow decorativo */}
      <div
        className={`
          absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl
          ${positivo ? "bg-green-500/20" : "bg-red-500/20"}
        `}
      />

      <div className="relative z-10 text-center">
        <p className="text-sm md:text-base tracking-widest uppercase text-gray-300">
          Saldo final del mes
        </p>

        <p
          className={`
            mt-4 text-4xl md:text-6xl font-extrabold tracking-tight
            ${positivo ? "text-green-300" : "text-red-300"}
          `}
        >
          {formatMoney(saldo)}
        </p>

        <p className="mt-4 text-sm text-gray-400 max-w-xl mx-auto">
          Este es el resultado final luego de ingresos, gastos y pagos
          registrados. Los valores se actualizan en tiempo real.
        </p>

        {/* Estado textual */}
        <div className="mt-6">
          {positivo ? (
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold
              bg-green-500/15 text-green-300 border border-green-500/30">
              ✔ Mes equilibrado
            </span>
          ) : (
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold
              bg-red-500/15 text-red-300 border border-red-500/30">
              ⚠ Saldo negativo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
