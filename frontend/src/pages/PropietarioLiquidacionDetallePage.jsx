import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import axiosInstance from "../api/axiosInstance";
import { Loader2 } from "lucide-react";
import { formatMoney } from "../services/liquidacionesService";
import { exportLiquidacionPDF } from "../utils/exportLiquidacionPDF";
import StatBox from "../components/ui/StatBox";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function PropietarioLiquidacionDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axiosInstance.get(`/propietarios/liquidacion/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Error cargando liquidación:", err);
      }
      setLoading(false);
    }
    load();
  }, [id]);

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
          No se encontró esta liquidación.
        </div>
      </AppLayout>
    );
  }

  const pendienteNum = Number(data.pendiente ?? 0);
  const expensaNum = Number(data.expensaTotal ?? 0);

  let estadoPago = "Parcial";
  if (pendienteNum <= 0) estadoPago = "Pagado";
  else if (pendienteNum === expensaNum) estadoPago = "Pendiente";

  return (
    <AppLayout>
      <div className="p-6 text-white">
        {/* HEADER */}
        <div className="bg-[#0d1224] p-8 rounded-2xl mb-10 border border-white/10 shadow-xl">
          <h1 className="text-3xl font-bold">
            Liquidación {data.mes}/{data.anio}
          </h1>

          <p className="mt-2 text-blue-300">
            Consorcio: {data.consorcio_nombre ?? "—"}
          </p>

          {/* Estado */}
          {/* Estado de pago */}
          <div className="mt-3">
            <Badge
              color={
                estadoPago === "Pagado"
                  ? "green"
                  : estadoPago === "Pendiente"
                    ? "red"
                    : "yellow"
              }
            >
              {estadoPago}
            </Badge>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              ← Volver
            </Button>

            <Button
              variant="purple"
              onClick={() =>
                exportLiquidacionPDF({
                  ...data,
                  expensaMes: data.expensaTotal,
                  montoAbonado: data.pagado,
                  expensaAdeudada: data.pendiente,
                })
              }
            >
              Descargar PDF
            </Button>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <p className="text-sm text-blue-300">Total del mes</p>
            <h2 className="text-3xl font-bold mt-2">
              {formatMoney(data.expensaTotal)}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-green-300">Pagado</p>
            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {formatMoney(data.pagado)}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-red-300">Pendiente</p>
            <h2 className="text-3xl font-bold mt-2 text-red-400">
              {formatMoney(data.pendiente)}
            </h2>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
