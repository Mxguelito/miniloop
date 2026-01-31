import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";

import { useLiquidacion } from "../hooks/tesoreria/useLiquidacion";
import { usePropietarios } from "../hooks/tesoreria/usePropietarios";
import useMovimientos from "../hooks/tesoreria/useMovimientos";

import { formatMoney } from "../services/liquidacionesService";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { exportLiquidacionPDF } from "../utils/exportLiquidacionPDF";

import LiquidacionHeader from "../components/liquidacion/LiquidacionHeader";
import LiquidacionResumen from "../components/liquidacion/LiquidacionResumen";
import LiquidacionSaldo from "../components/liquidacion/LiquidacionSaldo";
import LiquidacionPropietarios from "../components/liquidacion/LiquidacionPropietarios";
import LiquidacionMovimientos from "../components/liquidacion/LiquidacionMovimientos";

export default function VerLiquidacionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, setData, loading, save, publicar } = useLiquidacion(id);
  const {
    addPropietario,
    updatePropietario,
    deletePropietario,
    registrarPago,
  } = usePropietarios({
    propietarios: data?.propietarios || [],
    movimientos: data?.movimientos || [],
    setData,
  });

  const { movimientos, addMovimiento, updateMovimiento, deleteMovimiento } =
    useMovimientos(data, setData);

  const [showPagoModal, setShowPagoModal] = useState(false);
  const [propietarioActual, setPropietarioActual] = useState(null);
  const [pagoData, setPagoData] = useState({
    monto: 0,
    metodo: "Transferencia",
    nota: "",
  });

  if (loading) {
    return (
      <AppLayout>
        <h1 className="text-2xl text-gray-300">Cargando...</h1>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <h1 className="text-2xl text-red-400">No existe esta liquidación</h1>
      </AppLayout>
    );
  }

  // GUARDAR BACKEND

  async function handleSave() {
    const payload = {
      propietarios: data.propietarios,
      movimientos: data.movimientos,
      estado: data.estado,
    };

    await save(payload);
    alert("✔ Cambios guardados");
  }

  function testPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Test MiniLoop PDF", 40, 50);

    autoTable(doc, {
      startY: 80,
      head: [["Columna A", "Columna B"]],
      body: [["Hola", "Mundo"]],
    });

    doc.save("test.pdf");
  }

  function abrirModalPago(prop) {
    setPropietarioActual(prop);
    setPagoData({
      monto: prop.expensaAdeudada || 0,
      metodo: "Transferencia",
      nota: "",
    });
    setShowPagoModal(true);
  }

  function cerrarModalPago() {
    setShowPagoModal(false);
    setPropietarioActual(null);
  }

  async function handlePublicar() {
    if (!window.confirm("¿Publicar esta liquidación?")) return;
    await publicar();
    alert("✅ Liquidación publicada");
  }

  function normalizeEstado(estado) {
    return String(estado || "")
      .trim()
      .toUpperCase();
  }

  function estadoLabel(estado) {
    const e = normalizeEstado(estado);
    if (e === "CERRADA") return "Cerrada";
    if (e === "BORRADOR") return "Borrador";
    return estado || "—";
  }

  return (
    <AppLayout>
  <div className="max-w-7xl mx-auto px-4 pb-24">

      {/* ============================
     HEADER PRINCIPAL TESLA
============================= */}
      <LiquidacionHeader
        data={data}
        onBack={() => navigate(-1)}
        onSave={handleSave}
        onPublicar={handlePublicar}
        onExportPDF={() => exportLiquidacionPDF(data)}
      />

      {/* ==========================================RESUMEN FINANCIERO DEL MES – TESLA PANEL=========================================== */}
      <LiquidacionResumen totales={data.totales} />
      <LiquidacionSaldo saldo={data.totales.saldoMes} />

      {/* =========================================PROPIETARIOS – PANEL TESLA================================================== */}

      <LiquidacionPropietarios
        propietarios={data.propietarios}
        onUpdatePropietario={updatePropietario}
        onRegistrarPago={abrirModalPago}
      />

      {/* ====================================MOVIMIENTOS – TESLA PANEL============================================= */}

      <LiquidacionMovimientos
        movimientos={movimientos}
        onAddMovimiento={addMovimiento}
        onUpdateMovimiento={updateMovimiento}
        onDeleteMovimiento={deleteMovimiento}
      />

     {/* ===================== CTA GUARDAR – FUTURISTA RESPONSIVE ===================== */}
<div className="z-40">
  {/* ===== DESKTOP ===== */}
  <div className="hidden md:flex justify-center mt-10">
    <button
      onClick={handleSave}
      className="
        relative
        flex items-center justify-center gap-2
        px-8 py-4
        rounded-2xl
        font-semibold text-lg
        text-white
        bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
        shadow-[0_0_30px_rgba(16,185,129,0.45)]
        hover:scale-[1.03]
        hover:shadow-[0_0_45px_rgba(16,185,129,0.7)]
        active:scale-[0.97]
        transition-all
      "
    >
      💾 Guardar cambios
    </button>
  </div>

  {/* ===== MOBILE ===== */}
  <button
    onClick={handleSave}
    className="
      md:hidden
      fixed bottom-4 right-4
      w-14 h-14
      rounded-full
      bg-gradient-to-br from-green-500 to-emerald-600
      text-white text-xl
      flex items-center justify-center
      shadow-[0_0_25px_rgba(16,185,129,0.6)]
      hover:scale-105
      active:scale-95
      transition-all
    "
    aria-label="Guardar cambios"
  >
    💾
  </button>
</div>


      {showPagoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] border border-gray-700 rounded-2xl p-8 w-[420px] shadow-xl shadow-blue-500/20">
            <h2 className="text-xl font-bold text-blue-400 mb-4">
              Registrar pago — {propietarioActual?.nombre || "Propietario"}
            </h2>

            {/* MONTO */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm">Monto a pagar</label>
              <input
                type="number"
                className="w-full mt-1 p-3 bg-gray-900 rounded-lg border border-gray-700
                     text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={pagoData.monto}
                onChange={(e) =>
                  setPagoData({ ...pagoData, monto: Number(e.target.value) })
                }
              />
            </div>

            {/* MÉTODO */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm">Método de pago</label>
              <select
                className="w-full mt-1 p-3 bg-gray-900 rounded-lg border border-gray-700
                     text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={pagoData.metodo}
                onChange={(e) =>
                  setPagoData({ ...pagoData, metodo: e.target.value })
                }
              >
                <option>Transferencia</option>
                <option>Efectivo</option>
                <option>Débito</option>
                <option>Mercado Pago</option>
              </select>
            </div>

            {/* NOTA */}
            <div className="mb-6">
              <label className="text-gray-400 text-sm">Nota (opcional)</label>
              <textarea
                className="w-full mt-1 p-3 bg-gray-900 rounded-lg border border-gray-700
                     text-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                rows={3}
                value={pagoData.nota}
                onChange={(e) =>
                  setPagoData({ ...pagoData, nota: e.target.value })
                }
              ></textarea>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3">
              <button
                onClick={cerrarModalPago}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  registrarPago(propietarioActual.id, pagoData.monto);
                  cerrarModalPago();
                }}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
}
