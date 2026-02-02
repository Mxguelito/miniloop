import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";

export default function HomeHero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617] p-6 sm:p-8">
      
      {/* Glow decorativo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col gap-3">
        
        {/* Welcome */}
        <span className="text-xs sm:text-sm text-white/50 uppercase tracking-wide">
          Bienvenido a MiniLoop
        </span>

        {/* Nombre */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
          {user?.nombre}
        </h1>

        {/* Rol + producto */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={user?.rol}>
            {user?.rol}
          </Badge>

          <span className="text-sm text-white/40">
            Plataforma de gestión transparente
          </span>
        </div>

        {/* Claim */}
        <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
          Controlá el estado del consorcio, seguí las decisiones importantes
          y accedé a la información clave en un solo lugar.
          <span className="block mt-1 text-white/50">
            Menos dudas. Más claridad. Mejor gestión.
          </span>
        </p>

        {/* Highlights */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Highlight
            title="Transparencia real"
            desc="Estado financiero claro y visible"
          />
          <Highlight
            title="Gestión centralizada"
            desc="Actas, avisos y liquidaciones"
          />
          <Highlight
            title="Comunidad informada"
            desc="Decisiones claras y registradas"
          />
        </div>
      </div>
    </section>
  );
}

/* =======================
   Highlight card
======================= */
function Highlight({ title, desc }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition">
      <p className="text-sm font-medium text-white">
        {title}
      </p>
      <p className="text-xs text-white/50 mt-1">
        {desc}
      </p>
    </div>
  );
}
