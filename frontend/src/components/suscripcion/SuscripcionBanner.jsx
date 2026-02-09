import { useSuscripcion } from "../../hooks/useSuscripcion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canUseFeature } from "../../utils/permissions";

export default function SuscripcionBanner() {
  const { data, loading } = useSuscripcion();
  const { user } = useAuth();

  const navigate = useNavigate();

  if (loading || !data) return null;
  // 👑 ADMIN nunca ve banner de plan
  if (user?.role === "ADMIN") return null;

  const estado = data?.estado ?? "SIN_SUSCRIPCION";
  const diasRestantes = data?.diasRestantes ?? null;
  const plan = data?.plan ?? "BASIC";

  // 🎨 Colores base por estado
  const colors = {
    ACTIVO: "border-green-500/40 bg-green-500/10 text-green-300",
    EN_GRACIA: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
    SUSPENDIDO: "border-red-500/40 bg-red-500/10 text-red-300",
    SIN_SUSCRIPCION: "border-red-500/40 bg-red-500/10 text-red-300",
  };

  // 🟢 Dot visual
  const dot = {
    ACTIVO: "bg-green-400",
    EN_GRACIA: "bg-yellow-400",
    SUSPENDIDO: "bg-red-400",
    SIN_SUSCRIPCION: "bg-red-400",
  };

  // 🧠 Copy comercial (no técnico)
  const copy = {
    ACTIVO: {
      title: "Plan activo",
      subtitle: "MiniLoop está funcionando con todas las funciones habilitadas",
    },
    EN_GRACIA: {
      title: "Plan por vencer",
      subtitle: "Renová para evitar la suspensión de funciones",
    },
    SUSPENDIDO: {
      title: "Plan suspendido",
      subtitle: "Algunas acciones están deshabilitadas",
    },
    SIN_SUSCRIPCION: {
      title: "Plan inactivo",
      subtitle: "Activá MiniLoop para habilitar funciones avanzadas",
    },
  };

  // 🟡 Tesorero sin plan activo → aviso suave (no rojo)
  const isTesorero = user?.role === "TESORERO";

  let estadoVisual = estado;

  if (isTesorero && estado !== "ACTIVO" && estado !== "EN_GRACIA") {
    estadoVisual = "EN_GRACIA";
  }

  return (
    <div
      className={`w-full border rounded-xl p-4 mb-6 backdrop-blur-md ${colors[estadoVisual]}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* INFO PRINCIPAL */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${dot[estadoVisual]}`} />
            <h3 className="text-lg font-semibold">{copy[estadoVisual].title}</h3>
          </div>

          <p className="text-sm opacity-80">{copy[estadoVisual].subtitle}</p>
          {plan && (
            <p className="text-xs opacity-70 mt-1">
              Plan actual: <strong>{plan}</strong>
            </p>
          )}

          {/* CTA SUAVE */}
          <button
            onClick={() => navigate("/planes")}
            className="mt-2 text-sm underline opacity-80 hover:opacity-100 transition"
          >
            Ver planes
          </button>
        </div>

        {/* FECHA / RESTANTE */}
        {diasRestantes !== null && (
          <div className="text-right">
            <p className="text-xs opacity-70">Vencimiento</p>
            <p className="text-lg font-bold">{diasRestantes} días</p>
          </div>
        )}
      </div>
    </div>
  );
}
