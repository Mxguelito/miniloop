import AppLayout from "../components/layout/AppLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Loader2 } from "lucide-react";
import StatBox from "../components/ui/StatBox";
import Card from "../components/ui/Card";

export default function PropietarioDashboard() {
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
        <div className="text-center text-red-400 font-semibold mt-10">
          No se encontraron datos del propietario.
        </div>
      </AppLayout>
    );
  }

  //  FIX: VALORES SEGUROS

  const montoPendiente = data.montoPendiente ?? 0;
  const expensaActual = data.expensaActual ?? 0;
  const montoPagado = data.montoPagado ?? 0;

  const estado = montoPendiente === 0 ? "al_dia" : "deuda";

  // === NUEVO: Mes/Año para mostrar contexto ===
  // si backend no manda mes/anio, esto queda "—"
  const mes = data.mes ?? data.mesActual ?? null;
  const anio = data.anio ?? data.anioActual ?? null;

  const periodoLabel =
    mes && anio ? `${String(mes).padStart(2, "0")}/${anio}` : "—";

  // === NUEVO: Estado de pago (para badge) ===
  let estadoPago = "Pendiente";
  if (montoPendiente === 0) estadoPago = "Pagada";
  else if (montoPagado > 0) estadoPago = "Pago parcial";

  return (
    <AppLayout>
      <div className="p-6 space-y-10 text-white">
        {/*  Bienvenida */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d1224] p-8 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.4)] border border-white/10"
        >
          <h2 className="text-4xl font-bold tracking-tight">
            Hola {data.nombre} 👋
          </h2>

          <p className="mt-2 text-blue-300">
            Unidad: Piso {data.piso ?? "-"} – Dpto {data.dpto ?? "-"}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Resumen de liquidación:{" "}
            <span className="text-white font-medium">{periodoLabel}</span>
          </p>

          <p
            className={`mt-3 text-lg font-semibold ${
              estado === "al_dia" ? "text-green-400" : "text-red-400"
            }`}
          >
            {estado === "al_dia"
              ? "Estás al día ✔️"
              : `Debés $${montoPendiente.toLocaleString("es-AR")}`}
          </p>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border
    ${
      estadoPago === "Pagada"
        ? "bg-green-900/40 text-green-400 border-green-700/40"
        : estadoPago === "Pago parcial"
          ? "bg-yellow-900/40 text-yellow-300 border-yellow-700/40"
          : "bg-red-900/40 text-red-400 border-red-700/40"
    }`}
          >
            {estadoPago}
          </span>
        </motion.div>

        {/*  Tarjetas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <p className="text-sm text-blue-300">Expensa total</p>
            <h2 className="text-3xl font-bold mt-2">
              ${expensaActual.toLocaleString("es-AR")}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-green-300">Pagado</p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">
              ${montoPagado.toLocaleString("es-AR")}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-red-300">Pendiente</p>
            <h2 className="text-3xl font-bold mt-2 text-red-400">
              ${montoPendiente.toLocaleString("es-AR")}
            </h2>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
