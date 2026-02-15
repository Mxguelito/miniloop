import { useConsorcioSuscripcion } from "../../hooks/useConsorcioSuscripcion";
import ConsorcioSuscripcionPanel from "./ConsorcioSuscripcionPanel";
import { useState } from "react";
import api from "../../api/axiosInstance";

export default function ConsorcioCard({
  consorcio,
  onEdit,
  onViewUsers,
  onDelete,
}) {
  // ===============================
  // SUSCRIPCIÓN (HOOK OK)
  // ===============================
  const {
    data: suscripcion,
    loading,
    refresh,
  } = useConsorcioSuscripcion(consorcio.id);

  const [showPlanModal, setShowPlanModal] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");

  const handleSavePlan = async () => {
    try {
      await api.put(`/suscripcion/admin/${consorcio.id}`, {
        plan: selectedPlan,
        estado: selectedEstado,
      });

      setShowPlanModal(false);

      // 🔥 Opcional pero recomendable: refrescar suscripción
     await refresh();

    } catch (error) {
      console.error(error);
      alert("Error actualizando plan");
    }
  };
  const handleQuickEstadoChange = async (nuevoEstado) => {
    try {
      await api.put(`/suscripcion/admin/${consorcio.id}`, {
        estado: nuevoEstado,
      });

     await refresh();

    } catch (error) {
      console.error(error);
      alert("Error actualizando estado");
    }
  };

  return (
    <div
      className="
        bg-[#0f1e29]
        rounded-2xl
        p-4
        border border-white/10
        shadow-md
        hover:border-white/20
        transition
      "
    >
      {/* ===============================
          HEADER CARD
      =============================== */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold truncate">
            {consorcio.nombre}
          </h3>

          {consorcio.direccion && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {consorcio.direccion}
            </p>
          )}
        </div>

        {/* BADGE USUARIOS */}
        <span
          className="
            flex items-center gap-1
            px-2.5 py-0.5
            rounded-full
            bg-emerald-500/15
            text-emerald-300
            text-xs
            font-semibold
            border border-emerald-400/20
            shadow-[0_0_10px_rgba(52,211,153,0.25)]
            whitespace-nowrap
          "
        >
          👤 {consorcio.usuarios_count ?? 0}
        </span>
      </div>

      {/* ===============================
          PLAN / SUSCRIPCIÓN
      =============================== */}
      <div className="mt-3">
        <ConsorcioSuscripcionPanel
          suscripcion={loading ? null : suscripcion}
          onOpenPlanModal={() => {
            setSelectedPlan(suscripcion?.plan || "BASIC");
            setSelectedEstado(suscripcion?.estado || "ACTIVO");
            setShowPlanModal(true);
          }}
        />
      </div>
      {suscripcion && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {suscripcion.estado !== "SUSPENDIDO" && (
            <button
              onClick={() => handleQuickEstadoChange("SUSPENDIDO")}
              className="px-3 py-1 text-xs rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30 transition"
            >
              Suspender
            </button>
          )}

          {suscripcion.estado !== "ACTIVO" && (
            <button
              onClick={() => handleQuickEstadoChange("ACTIVO")}
              className="px-3 py-1 text-xs rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/30 transition"
            >
              Activar
            </button>
          )}

          {suscripcion.estado !== "EN_GRACIA" && (
            <button
              onClick={() => handleQuickEstadoChange("EN_GRACIA")}
              className="px-3 py-1 text-xs rounded-lg bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/30 transition"
            >
              En gracia
            </button>
          )}
        </div>
      )}

      {/* ===============================
          ACCIONES
      =============================== */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
        {/* EDITAR */}
        <button
          onClick={() => onEdit(consorcio)}
          className="
            flex items-center justify-center
            py-2
            rounded-lg
            bg-blue-500/10
            text-blue-300
            hover:bg-blue-500/20
            transition
          "
        >
          Editar
        </button>

        {/* VER USUARIOS */}
        <button
          onClick={onViewUsers}
          className="
            flex items-center justify-center
            gap-1
            py-2
            rounded-lg
            bg-indigo-500/15
            text-indigo-300
            hover:bg-indigo-500/30
            hover:text-indigo-200
            transition
            shadow-inner
          "
          title="Ver usuarios"
        >
          👁
        </button>

        {/* ELIMINAR */}
        <button
          onClick={() => onDelete(consorcio)}
          className="
            flex items-center justify-center
            py-2
            rounded-lg
            bg-red-500/10
            text-red-400
            hover:bg-red-500/25
            transition
            font-semibold
          "
        >
          Eliminar
        </button>
      </div>
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0f1e29] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Administrar plan</h2>

            <p className="text-sm text-gray-400 mb-4">
              Consorcio: {consorcio.nombre}
            </p>

            <div className="space-y-3">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"
              >
                <option value="BASIC">BASIC</option>
                <option value="PRO">PRO</option>
                <option value="PREMIUM">PREMIUM</option>
              </select>

              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="SUSPENDIDO">SUSPENDIDO</option>
                <option value="EN_GRACIA">EN_GRACIA</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                Cancelar
              </button>

              <button
                onClick={handleSavePlan}
                className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
