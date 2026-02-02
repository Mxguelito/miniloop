import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";

import PanelResumen from "../components/tesoreria/dashboard/PanelResumen";
import DeudoresDelMes from "../components/tesoreria/dashboard/DeudoresDelMes";
import TareasTesorero from "../components/tesoreria/dashboard/TareasTesorero";
import { useDashboardTesorero } from "../hooks/tesoreria/useDashboardTesorero";
import { getDeudoresTesorero } from "../services/tesoreria.service";

export default function TesoreroDashboard() {
  const [deudores, setDeudores] = useState([]);
  const { data: dashboard, loading } = useDashboardTesorero();

  useEffect(() => {
    getDeudoresTesorero().then(setDeudores);
  }, []);

  // 1️⃣ Existe liquidación del mes
  const tieneLiquidacionMes = !!dashboard?.liquidacionMes;

  // 2️⃣ Hay pagos pendientes si hay deudores
  const pagosPendientes = deudores.length;

  // 3️⃣ Movimientos pendientes (por ahora hardcodeado)
  const movimientosPendientes = false;

  // 4️⃣ Liquidación del mes cerrada (CLAVE)
  const liquidacionCerrada = dashboard?.liquidacionMes?.estado === "CERRADA";

  return (
    <AppLayout>
      {/* HEADER */}
      <div className="mb-10">
        {/* ===== HEADER FUTURÍSTICO TESORERO ===== */}
        <div
          className="
    relative
    mb-12
    rounded-3xl
    p-6 sm:p-8
    bg-gradient-to-br
    from-[#07131c]
    via-[#0b2233]
    to-[#07131c]
    border border-cyan-500/25
    shadow-[0_0_60px_rgba(0,180,255,0.35)]
    overflow-hidden
  "
        >
          {/* Glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold tracking-wide text-cyan-300/80">
                PANEL DE CONTROL
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Mi Panel — Tesorero
              </h1>

              <p className="text-sm sm:text-base text-cyan-200/70 max-w-xl">
                Supervisión financiera inteligente del consorcio en tiempo real
              </p>
            </div>
          </div>
        </div>

        <p className="text-cyan-300/70 mt-2">
          Centro de control financiero del consorcio
        </p>
      </div>

      {/* ===== SECCIÓN: RESUMEN ===== */}
      <section className="mb-16">
        <PanelResumen
          deudaTotal={dashboard?.deudaTotal || 0}
          cantidadDeudores={dashboard?.cantidadDeudores || 0}
          liquidacionesAbiertas={dashboard?.liquidacionesAbiertas || 0}
        />
      </section>

      {/* ===== SECCIÓN: DEUDORES ===== */}
      <section className="mb-16">
        <DeudoresDelMes deudores={deudores} />
      </section>

      {/* ===== SECCIÓN: TAREAS ===== */}
      <section className="mb-24">
        <TareasTesorero
  tieneLiquidacionMes={dashboard?.tieneLiquidacionMes}
  estadoLiquidacionMes={dashboard?.estadoLiquidacionMes}
  pagosPendientes={deudores.length}
  movimientosPendientes={false}
/>

      </section>
    </AppLayout>
  );
}
