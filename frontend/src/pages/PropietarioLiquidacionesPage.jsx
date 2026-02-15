import AppLayout from "../components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";

import { useMisLiquidaciones } from "../hooks/propietario/useMisLiquidaciones";
import { useAuth } from "../context/AuthContext";
import { useSuscripcion } from "../hooks/useSuscripcion";
import { canUseFeature } from "../utils/permissions";
import { formatMoney } from "../services/liquidacionesService";

export default function PropietarioLiquidacionesPage() {
  const navigate = useNavigate();
  const { items, loading, hasData } = useMisLiquidaciones();

  const { user } = useAuth();
  const { suscripcion } = useSuscripcion();

  // 🔐 PERMISO DEL MÓDULO
  const canUseLiquidaciones = canUseFeature(
    { role: user?.role, suscripcion },
    "MIS_LIQUIDACIONES",
  );

  return (
    <AppLayout>
      <div className="relative min-h-screen">
        {/* ================= CONTENIDO NORMAL ================= */}
        <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617] px-4 py-6 md:px-10 md:py-10">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* HEADER */}
            <PageHeader
              title="Mis Liquidaciones"
              subtitle="Historial de liquidaciones del propietario"
              role="PROPIETARIO"
            />

            {/* LOADING */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-10 h-10 text-cyan-400" />
              </div>
            )}

            {/* EMPTY */}
            {!loading && !hasData && (
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 text-white/70">
                No se encontraron liquidaciones.
              </div>
            )}

            {/* GRID */}
            {!loading && hasData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((lq) => (
                  <div
                    key={lq.liquidacion_id}
                    className="
                      rounded-3xl
                      bg-white/5
                      backdrop-blur-xl
                      border border-white/10
                      p-6
                      transition-all duration-300
                      hover:shadow-[0_0_40px_rgba(56,189,248,0.35)]
                    "
                  >
                    {/* HEADER CARD */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {lq.mes}/{lq.anio}
                        </h2>
                        <p className="text-xs text-white/60">
                          Liquidación mensual
                        </p>
                      </div>

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

                    {/* TOTAL */}
                    <div className="mb-4">
                      <p className="text-xs text-white/60">Total del mes</p>
                      <p className="text-2xl font-bold text-white">
                        {formatMoney(lq.expensaTotal)}
                      </p>
                    </div>

                    {/* PAGADO / PENDIENTE */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="rounded-xl bg-emerald-400/10 border border-emerald-400/30 p-3">
                        <p className="text-xs text-emerald-300">Pagado</p>
                        <p className="text-sm font-semibold text-emerald-200">
                          {formatMoney(lq.pagado)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-red-400/10 border border-red-400/30 p-3">
                        <p className="text-xs text-red-300">Pendiente</p>
                        <p className="text-sm font-semibold text-red-200">
                          {formatMoney(lq.pendiente)}
                        </p>
                      </div>
                    </div>

                    {/* ACTION */}
                    <button
                      onClick={() =>
                        navigate(
                          `/propietario/liquidacion/${lq.liquidacion_id}`,
                        )
                      }
                      className="
                        w-full
                        rounded-2xl
                        py-3
                        text-sm
                        font-semibold
                        text-black
                        bg-gradient-to-r from-cyan-400 to-sky-400
                        hover:from-cyan-300 hover:to-sky-300
                        transition
                        shadow-[0_0_30px_rgba(56,189,248,0.5)]
                      "
                    >
                      Ver detalle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= 🔒 OVERLAY BLOQUEO ================= */}
        {!canUseLiquidaciones && (
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
                🔒 Mis liquidaciones deshabilitadas
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
