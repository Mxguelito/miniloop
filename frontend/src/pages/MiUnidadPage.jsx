import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import axiosInstance from "../api/axiosInstance";
import { Loader2 } from "lucide-react";
import StatBox from "../components/ui/StatBox";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";



export default function MiUnidadPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axiosInstance.get("/propietarios/me");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="text-center text-red-400 mt-10">
          No se encontraron datos del propietario.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 text-white space-y-10">

        {/* TITULO */}
        <h1 className="text-3xl font-bold">Mi Unidad</h1>

        {/* CARD PRINCIPAL */}
        <div className="bg-[#0d1224] p-6 rounded-3xl shadow-xl border border-white/10 space-y-4">
          <p className="text-lg font-semibold text-blue-300">
            Información del propietario
          </p>

          {/* DATOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <StatBox 
              label="Propietario"
              value={data.nombre}
              color="blue"
            />

            <StatBox 
              label="Email"
              value={data.email}
              color="green"
            />

            <StatBox 
              label="Teléfono"
              value={data.telefono ?? '—'}
              color="purple"
            />

            <StatBox 
              label="Piso"
              value={data.piso ?? '—'}
              color="yellow"
            />

            <StatBox 
              label="Departamento"
              value={data.dpto ?? '—'}
              color="red"
            />

            <StatBox 
              label="Unidad"
              value={data.unidad ?? '—'}
              color="blue"
            />

          </div>

          {/* ESTADO */}
          <div className="mt-4">
            <Badge color={data.montoPendiente === 0 ? "green" : "red"}>
              {data.montoPendiente === 0 ? "Al día" : "Con deuda"}
            </Badge>
          </div>

          {/* BOTON EDITAR */}
          <Button
  variant="secondary"
  onClick={async () => {
    const nuevo = prompt("Ingresá tu teléfono:", data.telefono ?? "");
    if (nuevo === null) return;

    try {
      const res = await axiosInstance.patch("/propietarios/me", {
        telefono: nuevo,
      });
      setData(res.data); // ✅ refresca UI
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el teléfono");
    }
  }}
>
  Editar Teléfono
</Button>

<Button
  variant="secondary"
  onClick={async () => {
    const piso = prompt("Ingresá tu piso:", data.piso ?? "");
    if (piso === null) return;

    const dpto = prompt("Ingresá tu departamento:", data.dpto ?? "");
    if (dpto === null) return;

    const unidad = prompt("Ingresá tu unidad (opcional):", data.unidad ?? "");
    if (unidad === null) return;

    try {
      const res = await axiosInstance.post("/propietarios/solicitud-unidad", {
        piso,
        dpto,
        unidad,
      });

      alert(res.data.message || "Solicitud enviada");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "No se pudo enviar la solicitud de unidad"
      );
    }
  }}
>
  Solicitar cambio de Piso / Dpto
</Button>


        </div>

      </div>
    </AppLayout>
  );
}
