import Badge from "./Badge";

export default function PageHeader({
  title,
  subtitle,
  role,
}) {
  return (
    <div
      className="
        relative mb-10 rounded-3xl
        bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#020617]
        border border-white/10
        shadow-[0_0_60px_rgba(56,189,248,0.15)]
        overflow-hidden
      "
    >
      {/* Glow decorativo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="relative p-6 md:p-10">
        {/* Rol */}
        {role && (
          <div className="mb-4">
            <Badge color="blue">{role}</Badge>
          </div>
        )}

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          {title}
        </h1>

        {/* Subtítulo */}
        {subtitle && (
          <p className="mt-2 text-sm md:text-base text-blue-200/70 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
