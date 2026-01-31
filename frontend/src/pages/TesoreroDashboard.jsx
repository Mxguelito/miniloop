import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { getDeudores } from "../services/liquidacionesService";
import { getLiquidaciones } from "../services/liquidacionesService";
import PanelResumen from "../components/tesoreria/dashboard/PanelResumen";
import DeudoresDelMes from "../components/tesoreria/dashboard/DeudoresDelMes";
import TareasTesorero from "../components/tesoreria/dashboard/TareasTesorero";

export default function TesoreroDashboard() {
  const [deudores, setDeudores] = useState([]);

  useEffect(() => {
    async function load() {
      const d = await getDeudores();
      console.log("🔥 DEUDORES CALCULADOS:", d);

      const all = await getLiquidaciones();
      console.log("📦 LIQUIDACIONES COMPLETAS:", all);

      setDeudores(d);
    }
    load();
  }, []);

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
      deudaTotal={5000}
      cantidadDeudores={3}
      liquidacionesAbiertas={1}
    />
  </section>

  {/* ===== SECCIÓN: DEUDORES ===== */}
  <section className="mb-16">
    <DeudoresDelMes deudores={deudores} />
  </section>

  {/* ===== SECCIÓN: TAREAS ===== */}
  <section className="mb-24">
    <TareasTesorero
      tieneLiquidacionMes={false}
      pagosPendientes={deudores.length}
      movimientosPendientes={false}
    />
  </section>
</AppLayout>

  );
}
