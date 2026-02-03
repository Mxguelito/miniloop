import { Loader2 } from "lucide-react";

import AppLayout from "../components/layout/AppLayout";
import MiUnidadLayout from "../components/propietario/MiUnidadLayout";
import MiUnidadInfo from "../components/propietario/MiUnidadInfo";
import MiUnidadEstado from "../components/propietario/MiUnidadEstado";
import MiUnidadAcciones from "../components/propietario/MiUnidadAcciones";
import PageHeader from "../components/ui/PageHeader";

import { useMiPropietario } from "../hooks/propietario/useMiPropietario";

export default function MiUnidadPage() {
  const { data, loading, editarTelefono, solicitarCambioUnidad } =
    useMiPropietario();

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
  </AppLayout>
);


}
