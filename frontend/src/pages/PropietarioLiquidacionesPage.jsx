import React, { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../services/liquidacionesService";
import { exportLiquidacionPDF } from "../utils/exportLiquidacionPDF";
import { getLiquidacionesPropietario } from "../services/propietarioService"; 
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";





export default function PropietarioLiquidacionesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // CARGAR LIQUIDACIONES DEL PROPIETARIO
  
  useEffect(() => {
    async function load() {
      try {
        const res = await getLiquidacionesPropietario();
        console.log("📄 Liquidaciones propietario:", res);
        setItems(res);
      } catch (err) {
        console.error("Error cargando liquidaciones del propietario:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Mis Liquidaciones</h1>
        <p className="text-gray-400">Historial de liquidaciones del propietario</p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
        </div>
      )}

      {/* SIN DATOS */}
      {!loading && items.length === 0 && (
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-gray-300">
          No se encontraron liquidaciones.
        </div>
      )}

      {/* GRID DE CARDS TESLA */}
{!loading && items.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((lq) => (
      <div
        key={lq.liquidacion_id}

        className="p-6 rounded-2xl bg-[#0f1115] border border-blue-500/20 
                   shadow-[0_0_20px_rgba(0,150,255,0.15)] 
                   hover:shadow-[0_0_35px_rgba(0,150,255,0.25)]
                   transition-all duration-300"
      >

        {/* Header */}
        <h2 className="text-xl font-bold text-blue-300 mb-1">
          {lq.mes}/{lq.anio}
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Liquidación mensual
        </p>

        {/* Monto total */}
        <div className="mb-3">
          <p className="text-gray-400 text-sm">Total del mes:</p>
          <p className="text-2xl font-bold text-white">
            {formatMoney(lq.expensaTotal)}
          </p>
        </div>

        {/* Pagado y pendiente */}
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-gray-400 text-xs">Pagado</p>
            <p className="text-green-400 font-semibold">
              {formatMoney(lq.pagado)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Pendiente</p>
            <p className="text-red-400 font-semibold">
              {formatMoney(lq.pendiente)}
            </p>
          </div>
        </div>

        
        {/* ESTADO */}
<div className="mb-4">
  <Badge
    color={
      lq.estado === "Pagado"
        ? "green"
        : lq.estado === "Pendiente"
        ? "red"
        : "yellow"
    }
  >
    {lq.estado}
  </Badge>
</div>


        {/* BOTONES */}
        <div className="flex justify-between mt-4">
         <Button
  variant="primary"
  onClick={() => navigate(`/propietario/liquidacion/${lq.liquidacion_id}`)}
>
  Ver
</Button>


        </div>
      </div>
    ))}
  </div>
)}

    </AppLayout>
  );
}
