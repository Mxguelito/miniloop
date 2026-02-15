import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import MiUnidadLayout from "../components/propietario/MiUnidadLayout";
import MiUnidadInfo from "../components/propietario/MiUnidadInfo";
import MiUnidadEstado from "../components/propietario/MiUnidadEstado";
import MiUnidadAcciones from "../components/propietario/MiUnidadAcciones";
import PageHeader from "../components/ui/PageHeader";

import { useMiPropietario } from "../hooks/propietario/useMiPropietario";
import { useAuth } from "../context/AuthContext";
import { useSuscripcion } from "../hooks/useSuscripcion";
import { canUseFeature } from "../utils/permissions";

export default function MiUnidadPage() {
  const navigate = useNavigate();

  const { data, loading, editarTelefono, solicitarCambioUnidad } =
    useMiPropietario();

  const { user } = useAuth();
  const { suscripcion } = useSuscripcion();

  const canUseMiUnidad = canUseFeature(
    { role: user?.role, suscripcion },
    "MI_UNIDAD",
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="text-center text-red-500 mt-10">
          No se encontraron datos del propietario.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative">
        {/* CONTENIDO NORMAL */}
        <MiUnidadLayout>
          <PageHeader
            title="Mi Unidad"
            subtitle="Información del propietario y su unidad"
            role="PROPIETARIO"
          />

          <MiUnidadInfo data={data} />

          <MiUnidadEstado montoPendiente={data.montoPendiente} />

          <MiUnidadAcciones
            onEditarTelefono={editarTelefono}
            onSolicitarCambioUnidad={solicitarCambioUnidad}
          />
        </MiUnidadLayout>

        {/* 🔒 OVERLAY BLOQUEO PREMIUM */}
        {!canUseMiUnidad && (
          <div
            className="
              fixed inset-0 z-[9999]
              bg-black/70 backdrop-blur-md
              flex flex-col items-center justify-center
              text-center px-6
            "
          >
            <div className="max-w-md">
              <h2 className="text-3xl font-bold text-white mb-3">
                🔒 Mi unidad deshabilitada
              </h2>

              <p className="text-white/80 mb-6 leading-relaxed">
                Este módulo se habilita al activar un plan. Mientras tanto, solo
                podés acceder a <b>Inicio</b>.
              </p>

              <button
                onClick={() => navigate("/planes")}
                className="
                  px-8 py-4 rounded-2xl
                  bg-gradient-to-r from-indigo-500 to-purple-600
                  hover:opacity-90 transition
                  text-white font-semibold text-lg
                  shadow-[0_0_40px_rgba(99,102,241,0.6)]
                "
              >
                Ver planes
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
