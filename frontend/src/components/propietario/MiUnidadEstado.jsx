export default function MiUnidadEstado({ montoPendiente }) {
  const alDia = Number(montoPendiente || 0) === 0;

  return (
    <div
      className="
        rounded-3xl
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        p-6
        shadow-[0_0_50px_rgba(16,185,129,0.12)]
      "
    >
      <h2 className="text-lg font-semibold text-white mb-4">
        Estado de la unidad
      </h2>

      <span
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          border
          ${
            alDia
              ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              : "bg-red-400/10 text-red-300 border-red-400/30 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          }
        `}
      >
        <span className="text-lg">●</span>
        {alDia ? "Al día" : "Con deuda"}
      </span>
    </div>
  );
}
