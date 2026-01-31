export default function LiquidacionesHeader({
  yearFilter,
  onYearChange,
  onNueva,
}) {
  return (
    <div
      className="
        relative
        mb-10
        rounded-3xl
        p-6 sm:p-8
        bg-gradient-to-br
        from-[#0a1a24]
        via-[#0f2a3a]
        to-[#07131c]
        border border-cyan-500/20
        shadow-[0_0_60px_rgba(0,180,255,0.25)]
        overflow-hidden
      "
    >
      {/* Glow decorativo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* TÍTULO */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Liquidaciones
          </h1>
          <p className="text-sm sm:text-base text-cyan-200/80 mt-1">
            Control financiero del consorcio, mes a mes
          </p>
        </div>

        {/* CONTROLES */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Filtro */}
          <select
            value={yearFilter}
            onChange={(e) => onYearChange(e.target.value)}
            className="
              w-full sm:w-44
              bg-[#07131c]
              text-cyan-100
              px-4 py-3
              rounded-xl
              border border-cyan-500/30
              focus:outline-none
              focus:ring-2 focus:ring-cyan-400/50
              transition
            "
          >
            <option value="todos">Todos los años</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          {/* CTA */}
          <button
            onClick={onNueva}
            className="
              w-full sm:w-auto
              px-6 py-3
              rounded-xl
              font-semibold
              text-white
              bg-gradient-to-r from-cyan-500 to-blue-600
              shadow-[0_0_30px_rgba(0,180,255,0.45)]
              hover:scale-[1.03]
              hover:shadow-[0_0_45px_rgba(0,180,255,0.75)]
              active:scale-[0.97]
              transition-all
            "
          >
            ➕ Nueva liquidación
          </button>
        </div>
      </div>
    </div>
  );
}
