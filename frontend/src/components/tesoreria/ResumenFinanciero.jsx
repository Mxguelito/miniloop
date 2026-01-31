import { formatMoney } from "../../services/liquidacionesService";

export default function ResumenFinanciero({ saldoTotal, deudaTotal }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
      {/* ================= SALDO TOTAL ================= */}
      <div
        className="
          relative
          rounded-3xl
          p-6
          bg-gradient-to-br
          from-[#052018]
          via-[#0a3d2a]
          to-[#052018]
          border border-emerald-500/30
          shadow-[0_0_45px_rgba(0,255,150,0.35)]
          overflow-hidden
        "
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl" />

        <div className="relative z-10">
          <p className="text-sm text-emerald-200/80 tracking-wide">
            💰 Saldo total
          </p>

          <p className="text-4xl font-extrabold text-emerald-400 mt-2">
            {formatMoney(saldoTotal)}
          </p>

          <p className="text-xs text-emerald-200/60 mt-2">
            Resultado acumulado de todas las liquidaciones
          </p>
        </div>
      </div>

      {/* ================= DEUDA TOTAL ================= */}
      <div
        className="
          relative
          rounded-3xl
          p-6
          bg-gradient-to-br
          from-[#22070c]
          via-[#3a0b15]
          to-[#22070c]
          border border-rose-500/30
          shadow-[0_0_45px_rgba(255,0,80,0.35)]
          overflow-hidden
        "
      >
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/30 rounded-full blur-3xl" />

        <div className="relative z-10">
          <p className="text-sm text-rose-200/80 tracking-wide">
            🚨 Deuda total
          </p>

          <p className="text-4xl font-extrabold text-rose-400 mt-2">
            {formatMoney(deudaTotal)}
          </p>

          <p className="text-xs text-rose-200/60 mt-2">
            Total adeudado por propietarios
          </p>
        </div>
      </div>
    </div>
  );
}
