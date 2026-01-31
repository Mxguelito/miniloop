import { formatMoney } from "../../services/liquidacionesService";

export default function LiquidacionResumen({ totales }) {
  if (!totales) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <ResumenCard
        label="Ingresos por expensas"
        value={formatMoney(totales.ingresosExpensas)}
        color="green"
      />

      <ResumenCard
        label="Ingresos extra"
        value={formatMoney(totales.ingresosExtra)}
        color="cyan"
      />

      <ResumenCard
        label="Gastos"
        value={formatMoney(totales.gastos)}
        color="red"
      />

      <ResumenCard
        label="Total adeudado"
        value={formatMoney(totales.adeudado)}
        color="yellow"
      />
    </div>
  );
}

/* =========================
   CARD FUTURISTA
========================= */

function ResumenCard({ label, value, color }) {
  const styles = {
    green: {
      bg: "from-green-500/20 to-green-700/10",
      text: "text-green-400",
      border: "border-green-500/20",
      glow: "shadow-[0_0_30px_rgba(0,255,150,0.15)]",
    },
    cyan: {
      bg: "from-cyan-500/20 to-cyan-700/10",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
      glow: "shadow-[0_0_30px_rgba(0,200,255,0.15)]",
    },
    red: {
      bg: "from-red-500/20 to-red-700/10",
      text: "text-red-400",
      border: "border-red-500/20",
      glow: "shadow-[0_0_30px_rgba(255,80,80,0.15)]",
    },
    yellow: {
      bg: "from-yellow-500/20 to-yellow-700/10",
      text: "text-yellow-300",
      border: "border-yellow-500/20",
      glow: "shadow-[0_0_30px_rgba(255,200,80,0.15)]",
    },
  };

  const c = styles[color];

  return (
    <div
      className={`
        relative rounded-3xl p-6
        bg-gradient-to-br ${c.bg}
        border ${c.border}
        backdrop-blur-xl
        ${c.glow}
        transition-all duration-300
        hover:scale-[1.03]
        hover:shadow-[0_0_45px_rgba(0,180,255,0.18)]
      `}
    >
      {/* Glow interno */}
      <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 hover:opacity-100 transition pointer-events-none" />

      <p className="text-sm text-gray-400 tracking-wide">{label}</p>

      <p
        className={`mt-2 text-3xl md:text-4xl font-extrabold ${c.text}`}
      >
        {value}
      </p>
    </div>
  );
}
