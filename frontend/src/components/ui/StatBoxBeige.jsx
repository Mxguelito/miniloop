export default function StatBoxBeige({ label, value }) {
  return (
    <div
      className="
        relative
        rounded-2xl
        bg-[#0b1220]
        md:bg-white/5
        md:backdrop-blur-xl
        border
        border-white/10
        p-4
        transition
        hover:shadow-[0_0_35px_rgba(56,189,248,0.25)]
      "
    >
      <p className="text-[11px] uppercase tracking-widest text-cyan-300/70">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        {value ?? "—"}
      </p>
    </div>
  );
}
