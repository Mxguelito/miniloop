import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import {
  getLiquidaciones,
  deleteLiquidacion,
  formatMoney,
} from "../services/liquidacionesService";
import LiquidacionesHeader from "../components/tesoreria/LiquidacionesHeader";
import ResumenFinanciero from "../components/tesoreria/ResumenFinanciero";
import EvolucionSaldoChart from "../components/tesoreria/EvolucionSaldoChart";
import RankingDeudores from "../components/tesoreria/RankingDeudores";
import LiquidacionesCards from "../components/tesoreria/LiquidacionesCards";

import { getLiquidacion } from "../services/liquidacionesService";
import { exportLiquidacionPDF } from "../utils/exportLiquidacionPDF";

export default function LiquidacionesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("todos");

  // Cargar del backend
  useEffect(() => {
    async function load() {
      try {
        const data = await getLiquidaciones();

        console.log("LIQUIDACIONES DETALLADAS:", JSON.stringify(data, null, 2));

        // Normalizar por seguridad
        const fixed = data.map((l) => ({
          ...l,
          totales: l.totales ?? {
            ingresos: 0,
            adeudado: 0,
            gastos: 0,
            saldoMes: 0,
          },
        }));

        setItems(fixed);
      } catch (err) {
        console.error("Error cargando liquidaciones", err);
      }

      setLoading(false);
    }
    load();
  }, []);

  // Navegar a crear
  function handleNueva() {
    navigate("/liquidaciones/nueva");
  }

  // Eliminar
  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta liquidación?")) return;

    await deleteLiquidacion(id);
    setItems((prev) => prev.filter((l) => l.id !== id));
  }
  async function handleExport(id) {
    try {
      const liq = await getLiquidacion(id);
      exportLiquidacionPDF(liq); // usa tu PDF PRO
    } catch (err) {
      console.error("Error exportando PDF:", err);
      alert("No se pudo exportar el PDF");
    }
  }

  // Filtrar por año
  const yearsDisponibles = items.map((l) => String(l.anio));

const filteredItems =
  yearFilter === "todos" || !yearsDisponibles.includes(String(yearFilter))
    ? items
    : items.filter((l) => String(l.anio) === String(yearFilter));


  //  Calcular totales en tiempo real
  const saldoTotal = filteredItems.reduce(
    (acc, l) => acc + (Number(l.saldo_mes) || 0),
    0,
  );

  const deudaTotal = filteredItems.reduce(
    (acc, l) => acc + Number(l.deuda_total || 0),
    0,
  );

  //  Datos con tendencia (para color dinámico)
  const chartData = filteredItems.map((l, i, arr) => {
    const saldo = Number(l.saldo_mes || 0);
    const prev = i > 0 ? Number(arr[i - 1].saldo_mes || 0) : saldo;
    const tendencia = saldo >= prev ? "sube" : "baja";
    return { mes: l.mes, saldo, tendencia };
  });

  //  Calcular ranking de deudores
  const deudores = [];

  items.forEach((liq) => {
    // Evitar error si no existen propietarios
    if (!liq.propietarios) return;

    liq.propietarios.forEach((p) => {
      const adeuda = p.expensaAdeudada || 0;

      if (adeuda > 0) {
        // Buscar si ya existe ese propietario en el ranking
        const existente = deudores.find((d) => d.nombre === p.nombre);

        if (existente) {
          existente.monto += adeuda;
        } else {
          deudores.push({
            nombre: p.nombre,
            piso: p.piso || "-",
            departamento: p.departamento || "-",
            monto: adeuda,
          });
        }
      }
    });
  });

  function normalizeEstado(estado) {
    return String(estado || "")
      .trim()
      .toUpperCase();
  }

  // Ordenar de mayor a menor deuda
  deudores.sort((a, b) => b.monto - a.monto);
  console.log("📊 Deudores detectados:", deudores);

  return (
    <AppLayout>
      {/* Header */}
      <LiquidacionesHeader
        yearFilter={yearFilter}
        onYearChange={setYearFilter}
        onNueva={handleNueva}
      />

      {/* ====== RESUMEN FINANCIERO EN TIEMPO REAL ====== */}
      <ResumenFinanciero saldoTotal={saldoTotal} deudaTotal={deudaTotal} />

      {/* ====== GRÁFICO ANUAL ====== */}
      <EvolucionSaldoChart data={chartData} />

      {/* ===== SECCIÓN RANKING DE DEUDORES ===== */}
      <RankingDeudores deudores={deudores} />

      {/* Loading */}
      {loading && (
        <div className="text-gray-300">Cargando liquidaciones...</div>
      )}

      {/* Sin resultados */}
      {!loading && items.length === 0 && (
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-gray-300">
          No hay liquidaciones creadas aún.
        </div>
      )}

      {/* Tabla de resultados */}
      {/* ===== MOBILE: Cards ===== */}
      {!loading && filteredItems.length > 0 && (
        <div className="block md:hidden">
          <LiquidacionesCards
            items={filteredItems}
            onVer={(id) => navigate(`/liquidaciones/${id}`)}
            onExport={handleExport}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* ===== DESKTOP: TABLA FUTURISTA ===== */}
      {!loading && filteredItems.length > 0 && (
        <div
          className="
      hidden md:block
      rounded-3xl
      p-4
      bg-gradient-to-br
      from-[#07131c]
      via-[#0b2433]
      to-[#07131c]
      border border-cyan-500/20
      shadow-[0_0_60px_rgba(0,180,255,0.25)]
      backdrop-blur-xl
      overflow-hidden
    "
        >
          <table className="w-full border-separate border-spacing-y-3">
            {/* HEADER */}
            <thead>
              <tr className="text-cyan-200/70 text-xs uppercase tracking-widest">
                <th className="px-6 py-3 text-left">Mes</th>
                <th className="px-6 py-3 text-left">Año</th>
                <th className="px-6 py-3 text-left">Saldo</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filteredItems.map((l) => {
                const saldoPositivo = Number(l.saldo_mes) >= 0;

                return (
                  <tr
                    key={l.id}
                    className="
                bg-[#06121a]/80
                hover:bg-[#0b2433]
                transition
                rounded-2xl
              "
                  >
                    {/* Mes */}
                    <td className="px-6 py-4 rounded-l-2xl text-gray-200">
                      <span className="font-semibold">{l.mes}</span>
                    </td>

                    {/* Año */}
                    <td className="px-6 py-4 text-gray-400">{l.anio}</td>

                    {/* Saldo */}
                    <td className="px-6 py-4">
                      <span
                        className={`
                    font-bold text-lg
                    ${saldoPositivo ? "text-green-400" : "text-red-400"}
                  `}
                      >
                        {formatMoney(l.saldo_mes)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      {(() => {
                        const estado = normalizeEstado(l.estado);

                        if (estado === "BORRADOR") {
                          return (
                            <span
                              className="
            inline-flex items-center gap-2
            px-4 py-1.5
            rounded-full
            text-xs font-semibold
            bg-yellow-500/20
            text-yellow-300
            border border-yellow-500/30
            shadow-[0_0_15px_rgba(255,200,0,0.25)]
          "
                            >
                              🟡 Borrador
                            </span>
                          );
                        }

                        return (
                          <span
                            className="
          inline-flex items-center gap-2
          px-4 py-1.5
          rounded-full
          text-xs font-semibold
          bg-green-500/20
          text-green-400
          border border-green-500/30
          shadow-[0_0_18px_rgba(0,255,150,0.35)]
        "
                          >
                            🟢 Cerrada
                          </span>
                        );
                      })()}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 rounded-r-2xl">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/liquidaciones/${l.id}`)}
                          className="
                      px-4 py-2
                      rounded-xl
                      text-sm font-semibold
                      bg-blue-500/20 text-blue-300
                      hover:bg-blue-500/30
                      transition
                    "
                        >
                          Ver / Editar
                        </button>

                        <button
                          onClick={() => handleExport(l.id)}
                          className="
                      px-4 py-2
                      rounded-xl
                      text-sm font-semibold
                      bg-purple-500/20 text-purple-300
                      hover:bg-purple-500/30
                      transition
                    "
                        >
                          PDF
                        </button>

                        <button
                          onClick={() => handleDelete(l.id)}
                          className="
                      px-4 py-2
                      rounded-xl
                      text-sm font-semibold
                      bg-red-500/20 text-red-300
                      hover:bg-red-500/30
                      transition
                    "
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
