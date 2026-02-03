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
import LiquidacionesCards from "../components/tesoreria/LiquidacionesCards";
import EvolucionSaldoChart from "../components/tesoreria/EvolucionSaldoChart";
import RankingDeudores from "../components/tesoreria/RankingDeudores";

import { getLiquidacion } from "../services/liquidacionesService";
import { exportLiquidacionPDF } from "../utils/exportLiquidacionPDF";

export default function LiquidacionesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("todos");

  // ===== CARGA =====
  useEffect(() => {
    async function load() {
      try {
        const data = await getLiquidaciones();
        setItems(data || []);
      } catch (err) {
        console.error("Error cargando liquidaciones", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ===== FILTRO SEGURO =====
  const yearsDisponibles = items.map((l) => String(l.anio));

  const filteredItems =
    yearFilter === "todos" ||
    !yearsDisponibles.includes(String(yearFilter))
      ? items
      : items.filter((l) => String(l.anio) === String(yearFilter));

  // ===== TOTALES =====
  const saldoTotal = filteredItems.reduce(
    (acc, l) => acc + Number(l.saldo_mes || 0),
    0
  );

  const deudaTotal = filteredItems.reduce(
    (acc, l) => acc + Number(l.deuda_total || 0),
    0
  );

  // ===== ACCIONES =====
  function handleNueva() {
    navigate("/liquidaciones/nueva");
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta liquidación?")) return;
    await deleteLiquidacion(id);
    setItems((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleExport(id) {
    try {
      const liq = await getLiquidacion(id);
      exportLiquidacionPDF(liq);
    } catch {
      alert("No se pudo exportar el PDF");
    }
  }

  return (
    <AppLayout>
      {/* HEADER */}
      <LiquidacionesHeader
        yearFilter={yearFilter}
        onYearChange={setYearFilter}
        onNueva={handleNueva}
      />

      {/* ===== RESUMEN (SIEMPRE) ===== */}
      <ResumenFinanciero saldoTotal={saldoTotal} deudaTotal={deudaTotal} />

      {/* ===== MOBILE SIMPLE ===== */}
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

      {/* ===== DESKTOP COMPLETO ===== */}
      {!loading && filteredItems.length > 0 && (
        <div className="hidden md:block space-y-10">
          <EvolucionSaldoChart data={filteredItems} />
          <RankingDeudores deudores={[]} />
        </div>
      )}

      {/* ===== EMPTY ===== */}
      {!loading && filteredItems.length === 0 && (
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-gray-300">
          No hay liquidaciones creadas aún.
        </div>
      )}

      {loading && (
        <div className="text-gray-300">Cargando liquidaciones...</div>
      )}
    </AppLayout>
  );
}
