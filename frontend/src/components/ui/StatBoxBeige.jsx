export default function StatBoxFuturistic({ label, value }) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        bg-gradient-to-br
        from-cyan-500/10
        via-blue-500/5
        to-transparent
        backdrop-blur-xl
        border
        border-cyan-400/20
        p-4
        transition
        hover:shadow-[0_0_50px_rgba(56,189,248,0.4)]
      "
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/30 blur-3xl" />

      <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        {value ?? "—"}
      </p>
    </div>
  );
}
