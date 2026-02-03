import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import {
  getLiquidaciones,
  deleteLiquidacion,
} from "../services/liquidacionesService";

import LiquidacionesHeader from "../components/tesoreria/LiquidacionesHeader";
import ResumenFinanciero from "../components/tesoreria/ResumenFinanciero";
import LiquidacionesCards from "../components/tesoreria/LiquidacionesCards";

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
  const filteredItems =
    yearFilter === "todos"
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
    <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
      {/* HEADER */}
      <LiquidacionesHeader
        yearFilter={yearFilter}
        onYearChange={setYearFilter}
        onNueva={handleNueva}
      />

      {/* RESUMEN */}
      <ResumenFinanciero
        saldoTotal={saldoTotal}
        deudaTotal={deudaTotal}
      />

      {/* ESTADO */}
      {loading && (
        <div className="text-gray-300">Cargando liquidaciones...</div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-gray-300">
          No hay liquidaciones creadas aún.
        </div>
      )}

      {/* LISTADO MOBILE / GENERAL */}
      {!loading && filteredItems.length > 0 && (
        <LiquidacionesCards
          items={filteredItems}
          onVer={(id) => navigate(`/liquidaciones/${id}`)}
          onExport={handleExport}
          onDelete={handleDelete}
        />
      )}
    </div>
  </AppLayout>
);

}
