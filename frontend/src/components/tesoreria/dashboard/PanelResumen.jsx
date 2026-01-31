import { formatMoney } from "../../../services/liquidacionesService";

export default function PanelResumen({
  deudaTotal = 0,
  cantidadDeudores = 0,
  liquidacionesAbiertas = 0,
}) {
  const estadoGeneral =
    deudaTotal > 0 || liquidacionesAbiertas > 0 ? "Atención" : "OK";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      {/* 💸 Deuda total */}
      <ResumenCard
        titulo="Deuda total"
        valor={formatMoney(deudaTotal)}
        subtitulo="Total adeudado por propietarios"
        color="rose"
      />

      {/* 👥 Deudores */}
      <ResumenCard
        titulo="Deudores activos"
        valor={cantidadDeudores}
        subtitulo="Propietarios con deuda"
        color="amber"
      />

      {/* 📅 Meses abiertos */}
      <ResumenCard
        titulo="Liquidaciones abiertas"
        valor={liquidacionesAbiertas}
        subtitulo="Meses sin cerrar"
        color="cyan"
      />

      {/* 🧠 Estado general */}
      <ResumenCard
        titulo="Estado del consorcio"
        valor={estadoGeneral}
        subtitulo={
          estadoGeneral === "OK"
            ? "Todo en orden"
            : "Requiere atención"
        }
        color={estadoGeneral === "OK" ? "emerald" : "rose"}
        badge
      />
    </div>
  );
}

/* ===================== */
/* CARD BASE reutilizable */
/* ===================== */

function ResumenCard({
  titulo,
  valor,
  subtitulo,
  color = "cyan",
  badge = false,
}) {
  const colors = {
    emerald: "from-emerald-500/20 to-emerald-600/30 text-emerald-300",
    rose: "from-rose-500/20 to-rose-600/30 text-rose-300",
    cyan: "from-cyan-500/20 to-cyan-600/30 text-cyan-300",
    amber: "from-amber-400/20 to-amber-500/30 text-amber-300",
  };

  return (
    <div
      className={`
        relative
        rounded-3xl
        p-5
        bg-gradient-to-br ${colors[color]}
        border border-white/10
        shadow-[0_0_30px_rgba(0,180,255,0.15)]
        overflow-hidden
      `}
    >
      {/* Glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <p className="text-sm opacity-70 mb-1">{titulo}</p>

        <p className="text-3xl font-extrabold">
          {valor}
        </p>

        <p className="text-xs opacity-60 mt-1">{subtitulo}</p>

        {badge && (
          <span
            className={`
              inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full
              ${
                color === "emerald"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/20 text-rose-300"
              }
            `}
          >
            {valor}
          </span>
        )}
      </div>
    </div>
  );
}
