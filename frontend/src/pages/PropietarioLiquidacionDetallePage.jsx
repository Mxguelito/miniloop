import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Download } from "lucide-react";

import AppLayout from "../components/layout/AppLayout";
import Badge from "../components/ui/Badge";
import { formatMoney } from "../services/liquidacionesService";
import { exportLiquidacionPDF } from "../utils/exportLiquidacionPDF";

import { useLiquidacionDetalle } from "../hooks/propietario/useLiquidacionDetalle";

export default function PropietarioLiquidacionDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    loading,
    expensaTotal,
    pagado,
    pendiente,
    estadoPago,
  } = useLiquidacionDetalle(id);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-10 h-10 text-cyan-400" />
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

  return (
    <AppLayout>
      {/* WRAP FUTURISTA */}
      <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617] px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl space-y-8">

          {/* HEADER / PANEL */}
          <div className="
            rounded-3xl
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            p-6 md:p-8
            shadow-[0_0_60px_rgba(56,189,248,0.18)]
          ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Liquidación {data.mes}/{data.anio}
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Consorcio: {data.consorcio_nombre ?? "—"}
                </p>
              </div>

              {/* ESTADO */}
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

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                className="
                  inline-flex items-center gap-2
                  rounded-2xl
                  px-4 py-3
                  text-sm font-medium
                  text-white
                  border border-white/15
                  hover:bg-white/10
                  transition
                "
              >
                <ArrowLeft size={18} />
                Volver
              </button>

              <button
                onClick={() =>
                  exportLiquidacionPDF({
                    ...data,
                    expensaMes: expensaTotal,
                    montoAbonado: pagado,
                    expensaAdeudada: pendiente,
                  })
                }
                className="
                  inline-flex items-center gap-2
                  rounded-2xl
                  px-4 py-3
                  text-sm font-semibold
                  text-black
                  bg-gradient-to-r from-cyan-400 to-sky-400
                  hover:from-cyan-300 hover:to-sky-300
                  transition
                  shadow-[0_0_30px_rgba(56,189,248,0.5)]
                "
              >
                <Download size={18} />
                Descargar PDF
              </button>
            </div>
          </div>

          {/* RESUMEN / METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TOTAL */}
            <div className="
              rounded-3xl
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              p-6
              shadow-[0_0_40px_rgba(56,189,248,0.15)]
            ">
              <p className="text-xs text-white/60">Total del mes</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {formatMoney(expensaTotal)}
              </p>
            </div>

            {/* PAGADO */}
            <div className="
              rounded-3xl
              bg-emerald-400/10
              border border-emerald-400/30
              p-6
              shadow-[0_0_40px_rgba(16,185,129,0.25)]
            ">
              <p className="text-xs text-emerald-300">Pagado</p>
              <p className="mt-2 text-3xl font-bold text-emerald-200">
                {formatMoney(pagado)}
              </p>
            </div>

            {/* PENDIENTE */}
            <div className="
              rounded-3xl
              bg-red-400/10
              border border-red-400/30
              p-6
              shadow-[0_0_40px_rgba(239,68,68,0.25)]
            ">
              <p className="text-xs text-red-300">Pendiente</p>
              <p className="mt-2 text-3xl font-bold text-red-200">
                {formatMoney(pendiente)}
              </p>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
