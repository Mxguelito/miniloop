export default function ConsorcioSuscripcionPanel({ suscripcion, onOpenPlanModal }) {
  if (!suscripcion) {
    return (
      <div className="text-sm text-red-400">
        Sin suscripción activa
      </div>
    );
  }

  const colors = {
    ACTIVO: "text-green-400",
    EN_GRACIA: "text-yellow-400",
    SUSPENDIDO: "text-red-400",
  };

  return (
    <div className="mt-3 rounded-xl bg-black/40 p-3 border border-white/10">
      <p className="text-xs text-white/60">Suscripción</p>

      <p className="text-sm font-semibold mt-1">
        Plan: <span className="text-white">{suscripcion.plan}</span>
      </p>

      <p className={`text-sm mt-1 ${colors[suscripcion.estado]}`}>
        Estado: {suscripcion.estado}
      </p>

      {suscripcion.dias_restantes !== null && (
        <p className="text-xs text-white/60 mt-1">
          Días restantes: {suscripcion.dias_restantes}
        </p>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={onOpenPlanModal}
          className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/30 transition"
        >
          Cambiar plan
        </button>

        <button className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30 transition">
          Cancelar
        </button>
      </div>
    </div>
  );
}
