import { useSuscripcion } from "../../hooks/useSuscripcion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SuscripcionBanner() {
  const { suscripcion, loading } = useSuscripcion();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading || !suscripcion) return null;
  if (user?.role === "ADMIN") return null;

  const estado = suscripcion?.estado ?? "SIN_SUSCRIPCION";
  const diasRestantes = suscripcion?.diasRestantes ?? null;
  const plan = suscripcion?.plan ?? "BASIC";

  // 🎨 estilos dinámicos
  const variants = {
    ACTIVO: {
      bg: "from-emerald-500/20 via-emerald-400/10 to-transparent",
      border: "border-emerald-400/40",
      glow: "shadow-[0_0_50px_rgba(16,185,129,0.35)]",
      dot: "bg-emerald-400",
    },
    EN_GRACIA: {
      bg: "from-yellow-500/20 via-yellow-400/10 to-transparent",
      border: "border-yellow-400/40",
      glow: "shadow-[0_0_50px_rgba(234,179,8,0.35)]",
      dot: "bg-yellow-400",
    },
    SUSPENDIDO: {
      bg: "from-red-500/20 via-red-400/10 to-transparent",
      border: "border-red-400/40",
      glow: "shadow-[0_0_50px_rgba(239,68,68,0.35)]",
      dot: "bg-red-400",
    },
    SIN_SUSCRIPCION: {
      bg: "from-red-500/20 via-red-400/10 to-transparent",
      border: "border-red-400/40",
      glow: "shadow-[0_0_50px_rgba(239,68,68,0.35)]",
      dot: "bg-red-400",
    },
  };

  const v = variants[estado] || variants.SIN_SUSCRIPCION;

  return (
    <div
      className={`
        relative overflow-hidden
        w-full rounded-2xl border ${v.border}
        bg-gradient-to-r ${v.bg}
        backdrop-blur-xl
        p-5 md:p-6
        ${v.glow}
        transition-all duration-300
      `}
    >
      {/* GRID */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* INFO IZQUIERDA */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-3 h-3 rounded-full ${v.dot}`} />
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {estado === "ACTIVO" && "Plan activo"}
              {estado === "EN_GRACIA" && "Plan por vencer"}
              {estado === "SUSPENDIDO" && "Plan suspendido"}
              {estado === "SIN_SUSCRIPCION" && "Plan inactivo"}
            </h3>
          </div>

          <p className="text-white/80 text-sm md:text-base">
            MiniLoop está funcionando bajo el plan{" "}
            <span className="font-bold text-white">{plan}</span>.
          </p>

          {estado === "EN_GRACIA" && (
            <p className="text-yellow-300 text-sm mt-1">
              Renovalo para evitar interrupciones.
            </p>
          )}

          {estado === "SUSPENDIDO" && (
            <p className="text-red-300 text-sm mt-1">
              Algunas funciones están limitadas.
            </p>
          )}
        </div>

        {/* INFO DERECHA */}
        <div className="flex items-center justify-between md:justify-end gap-6">

          {diasRestantes !== null && (
            <div className="text-left md:text-right">
              <p className="text-xs text-white/60 uppercase tracking-wider">
                Vencimiento
              </p>
              <p className="text-2xl font-bold text-white">
                {diasRestantes} días
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/planes")}
            className="
              px-5 py-2 rounded-xl
              bg-white/10 hover:bg-white/20
              border border-white/20
              text-sm font-medium text-white
              transition
            "
          >
            Gestionar plan
          </button>
        </div>
      </div>
    </div>
  );
}
