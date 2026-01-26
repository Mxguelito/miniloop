import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useParams } from "react-router-dom";
import {
  getLiquidacion,
  updateLiquidacion,
  formatMoney,
} from "../services/liquidacionesService";
import axiosInstance from "../api/axiosInstance";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { exportLiquidacionPDF } from "../utils/exportLiquidacionPDF";
import { useNavigate } from "react-router-dom";

export default function VerLiquidacionPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // MODAL REGISTRAR PAGO

  const [showPagoModal, setShowPagoModal] = useState(false);
  const [propietarioActual, setPropietarioActual] = useState(null);
  const [pagoData, setPagoData] = useState({
    monto: 0,
    metodo: "Transferencia",
    nota: "",
  });

  // CARGAR DESDE BACKEND

  useEffect(() => {
    async function load() {
      const item = await getLiquidacion(id);

      const propietariosIniciales = (item.propietarios ?? []).map((p) => ({
        ...p,
        piso: p.piso || "",
        dpto: p.dpto || "",
      }));

      //  LIMPIAR PROPIETARIOS DUPLICADOS

      const propietariosUnicos = [];
      const usados = new Set();

      for (const p of propietariosIniciales) {
        const key = p.id || p.propietario_id;
        if (!usados.has(key)) {
          usados.add(key);
          propietariosUnicos.push(p);
        }
      }

      const movimientosIniciales = item.movimientos ?? [];

      // Recalcular totales desde el front
      const { propietarios, totales } = recalcularTotales(
        propietariosUnicos,
        movimientosIniciales,
      );

      const fixed = {
        ...item,
        propietarios,
        movimientos: movimientosIniciales,
        totales,
      };

      setData(fixed);
      setLoading(false);
    }
    load();
  }, [id]);

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

  // RECÁLCULO AUTOMÁTICO

  function recalcularTotales(propietarios, movimientos) {
    const propietariosActualizados = propietarios.map((p) => {
      const expensa = Number(p.expensaMes || 0);
      const abonado = Number(p.montoAbonado || 0);

      return {
        ...p,
        expensaAdeudada: Math.max(expensa - abonado, 0),
      };
    });

    const ingresosExpensas = propietariosActualizados.reduce(
      (acc, p) => acc + Number(p.montoAbonado || 0),
      0,
    );

    const adeudado = propietariosActualizados.reduce(
      (acc, p) => acc + Number(p.expensaAdeudada || 0),
      0,
    );

    const ingresosExtra = movimientos
      .filter((m) => m.tipo === "ingreso")
      .reduce((acc, m) => acc + Number(m.monto || 0), 0);

    const gastos = movimientos
      .filter((m) => m.tipo === "gasto")
      .reduce((acc, m) => acc + Number(m.monto || 0), 0);

    const ingresosTotales = ingresosExpensas + ingresosExtra;

    const saldoMes = ingresosTotales - gastos;

    return {
      propietarios: propietariosActualizados,
      totales: {
        ingresos: ingresosTotales,
        ingresosExpensas,
        ingresosExtra,
        adeudado,
        gastos,
        saldoMes,
      },
    };
  }

  // PROPIETARIOS

  function addPropietario() {
    const nuevo = {
      id: Date.now(),
      nombre: "",
      piso: "",
      departamento: "",
      expensaMes: 0,
      expensaAdeudada: 0,
      montoAbonado: 0,
    };

    const nuevosProp = [...data.propietarios, nuevo];
    const { propietarios, totales } = recalcularTotales(
      nuevosProp,
      data.movimientos,
    );

    setData({ ...data, propietarios, totales });
  }

  function updatePropietario(idProp, campo, valor) {
    const nuevosProp = data.propietarios.map((p) =>
      p.id === idProp ? { ...p, [campo]: valor } : p,
    );

    const { propietarios, totales } = recalcularTotales(
      nuevosProp,
      data.movimientos,
    );

    setData({ ...data, propietarios, totales });
  }

  function deletePropietario(idProp) {
    const nuevosProp = data.propietarios.filter((p) => p.id !== idProp);
    const { propietarios, totales } = recalcularTotales(
      nuevosProp,
      data.movimientos,
    );

    setData({ ...data, propietarios, totales });
  }

  // MOVIMIENTOS

  function addMovimiento(tipo) {
    const nuevo = {
      id: Date.now(),
      tipo, // ingreso | gasto
      motivo: "",
      monto: 0,
    };

    const nuevosMov = [...data.movimientos, nuevo];

    const { propietarios, totales } = recalcularTotales(
      data.propietarios,
      nuevosMov,
    );

    setData({ ...data, movimientos: nuevosMov, propietarios, totales });
  }

  function updateMovimiento(idMov, campo, valor) {
    const nuevosMov = data.movimientos.map((m) =>
      m.id === idMov ? { ...m, [campo]: valor } : m,
    );

    const { propietarios, totales } = recalcularTotales(
      data.propietarios,
      nuevosMov,
    );

    setData({ ...data, movimientos: nuevosMov, propietarios, totales });
  }

  function deleteMovimiento(idMov) {
    const nuevosMov = data.movimientos.filter((m) => m.id !== idMov);

    const { propietarios, totales } = recalcularTotales(
      data.propietarios,
      nuevosMov,
    );

    setData({ ...data, movimientos: nuevosMov, propietarios, totales });
  }

  // GUARDAR BACKEND

  async function handleSave() {
    try {
      // ARMAR PAYLOAD MANUALMENTE
      const payload = {
        propietarios: data.propietarios.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          piso: p.piso || "",
          dpto: p.dpto || "",
          expensaMes: Number(p.expensaMes || 0),
          montoAbonado: Number(p.montoAbonado || 0),
        })),

        movimientos: data.movimientos.map((m) => ({
          id: m.id,
          tipo: m.tipo,
          motivo: m.motivo,
          monto: Number(m.monto || 0),
        })),

        estado: data.estado,
      };

      // GUARDAR EN BACKEND

      await updateLiquidacion(data.id, payload);

      // RECARGAR DESDE BACKEND

      const item = await getLiquidacion(data.id);

      const propietariosIniciales = item.propietarios ?? [];
      const movimientosIniciales = item.movimientos ?? [];

      const { propietarios, totales } = recalcularTotales(
        propietariosIniciales,
        movimientosIniciales,
      );

      const fixed = {
        ...item,
        propietarios,
        movimientos: movimientosIniciales,
        totales,
      };

      setData(fixed);

      alert("✔ Cambios guardados correctamente");
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      alert("Error al guardar cambios");
    }
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
  async function handleCerrar() {
    if (!window.confirm("¿Cerrar esta liquidación?")) return;

    const updated = {
      ...data,
      estado: "CERRADA",
    };

    const saved = await updateLiquidacion(data.id, updated);
    setData(saved);
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
  function registrarPago() {
    if (!propietarioActual) return;

    const nuevosProp = data.propietarios.map((p) =>
      p.id === propietarioActual.id
        ? {
            ...p,
            montoAbonado: Number(p.montoAbonado || 0) + Number(pagoData.monto),
          }
        : p,
    );

    const { propietarios, totales } = recalcularTotales(
      nuevosProp,
      data.movimientos,
    );

    setData({ ...data, propietarios, totales });
    cerrarModalPago();
  }

  async function handlePublicar() {
    if (
      !window.confirm(
        "¿Publicar esta liquidación? Los propietarios podrán verla.",
      )
    )
      return;

    try {
      await axiosInstance.patch(`/tesorero/liquidaciones/${id}/publicar`);

      // Recargar desde backend (igual que tu load)
      const item = await getLiquidacion(id);

      const propietariosIniciales = item.propietarios ?? [];
      const movimientosIniciales = item.movimientos ?? [];

      const { propietarios, totales } = recalcularTotales(
        propietariosIniciales,
        movimientosIniciales,
      );

      setData({
        ...item,
        propietarios,
        movimientos: movimientosIniciales,
        totales,
      });

      alert("✅ Liquidación publicada");
    } catch (err) {
      console.error("❌ Error publicando:", err);
      alert("❌ No se pudo publicar");
    }
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
      {/* ============================
     HEADER PRINCIPAL TESLA
============================= */}
      <div className="w-full mb-8 rounded-2xl p-6 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#151515] border border-gray-800 shadow-[0_0_25px_rgba(0,0,0,0.4)]">
        {/* TITULO + INFO */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 tracking-wide">
              Liquidación {data.mes}/{data.anio}
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Consorcio:{" "}
              <span className="text-blue-400 font-semibold">
                {data.consorcio_nombre || "—"}
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Creada el:{" "}
              {data.creado_en
                ? new Date(data.creado_en).toLocaleString("es-AR")
                : "—"}
            </p>
          </div>

          {/* ESTADO */}
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Estado</p>

            {normalizeEstado(data.estado) === "CERRADA" ? (
              <span className="px-4 py-1 rounded-full bg-green-800/40 text-green-400 font-semibold shadow-inner border border-green-700/40">
                Cerrada
              </span>
            ) : (
              <span className="px-4 py-1 rounded-full bg-yellow-800/40 text-yellow-300 font-semibold shadow-inner border border-yellow-700/40">
                Borrador
              </span>
            )}
          </div>
        </div>

        {/* BOTONES */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm transition"
          >
            ← Volver
          </button>

          <button
            onClick={testPDF}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
          >
            Probar PDF
          </button>

          <button
            onClick={() => exportLiquidacionPDF(data)}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          >
            Exportar PDF Real
          </button>

          {String(data.estado).toUpperCase() !== "CERRADA" && (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                Guardar
              </button>

              <button
                onClick={handlePublicar}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                Publicar liquidación
              </button>
            </>
          )}

          {String(data.estado).toUpperCase() === "CERRADA" && (
            <span className="px-4 py-2 rounded-lg bg-green-800/40 text-green-400 border border-green-700/40">
              ✅ Publicada (solo lectura)
            </span>
          )}
        </div>
      </div>

      {/* ==========================================RESUMEN FINANCIERO DEL MES – TESLA PANEL=========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* INGRESOS EXPENSAS */}
        <div
          className="p-5 rounded-2xl bg-gradient-to-br from-green-700/30 to-green-500/20
                  border border-green-500/20 backdrop-blur-xl shadow-lg"
        >
          <p className="text-sm text-gray-400">Ingresos expensas</p>
          <p className="text-3xl font-bold text-green-400 mt-1">
            {formatMoney(data.totales.ingresosExpensas)}
          </p>
        </div>

        {/* INGRESOS EXTRA */}
        <div
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-700/30 to-blue-500/20
                  border border-blue-500/20 backdrop-blur-xl shadow-lg"
        >
          <p className="text-sm text-gray-400">Ingresos extra</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">
            {formatMoney(data.totales.ingresosExtra)}
          </p>
        </div>

        {/* GASTOS */}
        <div
          className="p-5 rounded-2xl bg-gradient-to-br from-red-700/30 to-red-500/20
                  border border-red-500/20 backdrop-blur-xl shadow-lg"
        >
          <p className="text-sm text-gray-400">Gastos</p>
          <p className="text-3xl font-bold text-red-400 mt-1">
            {formatMoney(data.totales.gastos)}
          </p>
        </div>

        {/* ADEUDADO */}
        <div
          className="p-5 rounded-2xl bg-gradient-to-br from-yellow-700/30 to-yellow-500/20
                  border border-yellow-500/20 backdrop-blur-xl shadow-lg"
        >
          <p className="text-sm text-gray-400">Adeudado</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">
            {formatMoney(data.totales.adeudado)}
          </p>
        </div>
      </div>

      {/* SALDO FINAL */}
      <div className="p-6 rounded-2xl bg-[#101010] border border-gray-700 shadow-xl mb-12">
        <p className="text-gray-400 text-lg">Saldo final del mes</p>

        <p
          className={`text-4xl font-extrabold mt-2 ${
            data.totales.saldoMes >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {formatMoney(data.totales.saldoMes)}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Todos los cálculos son automáticos en tiempo real.
        </p>
      </div>

      {/* =========================================PROPIETARIOS – PANEL TESLA================================================== */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-200 tracking-wide">
          Propietarios
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4 mb-10">
        {data.propietarios?.map((p) => (
          <div
            key={p.id}
            className="bg-[#0a0f19]/70 border border-blue-600/30 rounded-xl p-4 shadow-[0_0_15px_rgba(0,100,255,0.25)] hover:shadow-[0_0_25px_rgba(0,130,255,0.45)] transition-all"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-blue-400 font-semibold text-lg">
                {p.nombre || "Propietario"}
              </h3>

              <button
                onClick={() => abrirModalPago(p)}
                className="text-blue-500 hover:text-blue-300 text-sm"
              >
                Registrar pago
              </button>
            </div>

            {/* Inputs compactos */}
            <div className="space-y-2">
              {/* Piso / Dpto */}
              <div className="text-gray-400 text-sm mb-2">
                Piso{" "}
                <span className="text-gray-200 font-semibold">
                  {p.piso ?? "-"}
                </span>
                {" • "}
                Dpto{" "}
                <span className="text-gray-200 font-semibold">
                  {p.dpto ?? "-"}
                </span>
              </div>

              {/* Expensa / Pago */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 text-xs">
                    Expensa del mes
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={p.expensaMes ?? 0}
                    onChange={(e) =>
                      updatePropietario(
                        p.id,
                        "expensaMes",
                        Number(e.target.value),
                      )
                    }
                    className="bg-[#0d1117] border border-blue-500/30 rounded-lg px-2 h-8 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs">Pagó</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={p.montoAbonado ?? 0}
                    onChange={(e) =>
                      updatePropietario(
                        p.id,
                        "montoAbonado",
                        Number(e.target.value),
                      )
                    }
                    className="bg-[#0d1117] border border-blue-500/30 rounded-lg px-2 h-8 text-sm text-white"
                  />
                </div>
              </div>

              {/* Adeudado */}
              <div className="bg-[#0d1117] border border-blue-500/20 rounded-lg px-2 h-8 flex items-center text-blue-300 text-sm">
                Adeudado: {p.expensaAdeudada ?? 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================MOVIMIENTOS – TESLA PANEL============================================= */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-200 tracking-wide">
          Movimientos
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => addMovimiento("ingreso")}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            + Ingreso
          </button>

          <button
            onClick={() => addMovimiento("gasto")}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg"
          >
            + Gasto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full mt-4 mb-10">
        {data.movimientos.map((m) => (
          <div
            key={m.id}
            className={`max-w-[450px] w-full mx-auto bg-[#0a0f19]/70 rounded-xl p-4 transition-all shadow-[0_0_15px_rgba(0,100,255,0.15)]
  ${
    m.tipo === "ingreso"
      ? "border border-green-500/30 hover:shadow-[0_0_25px_rgba(0,255,150,0.35)]"
      : "border border-red-500/30 hover:shadow-[0_0_25px_rgba(255,80,80,0.35)]"
  }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-semibold ${
                  m.tipo === "ingreso" ? "text-green-400" : "text-red-400"
                }`}
              >
                {m.tipo === "ingreso" ? "Ingreso" : "Gasto"}
              </h3>

              <button
                onClick={() => deleteMovimiento(m.id)}
                className="text-red-400 hover:text-red-300 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Campos */}
            <div className="space-y-4">
              {/* Motivo */}
              <div>
                <label className="text-gray-400 text-sm">Motivo</label>
                <input
                  className="w-full mt-1 h-8 px-2 bg-gray-900 rounded-lg border border-gray-700
text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={m.motivo}
                  onChange={(e) =>
                    updateMovimiento(m.id, "motivo", e.target.value)
                  }
                />
              </div>

              {/* Monto */}
              <div>
                <label className="text-gray-400 text-sm">Monto</label>
                <input
                  type="number"
                  className="w-full mt-1 h-8 px-2 bg-gray-900 rounded-lg border border-gray-700
text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={m.monto}
                  onChange={(e) =>
                    updateMovimiento(m.id, "monto", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ==========================TOTALES==================================== */}
      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Totales</h2>

        <p className="text-gray-300">
          Ingresos expensas:{" "}
          <strong className="text-green-400">
            {formatMoney(data.totales.ingresosExpensas)}
          </strong>
        </p>

        <p className="text-gray-300">
          Ingresos extra:{" "}
          <strong className="text-green-300">
            {formatMoney(data.totales.ingresosExtra)}
          </strong>
        </p>

        <p className="text-gray-300">
          Adeudado:{" "}
          <strong className="text-yellow-400">
            {formatMoney(data.totales.adeudado)}
          </strong>
        </p>

        <p className="text-gray-300">
          Gastos:{" "}
          <strong className="text-red-400">
            {formatMoney(data.totales.gastos)}
          </strong>
        </p>

        <p className="text-xl mt-3">
          Saldo del mes:{" "}
          <strong
            className={
              data.totales.saldoMes >= 0 ? "text-green-400" : "text-red-400"
            }
          >
            {formatMoney(data.totales.saldoMes)}
          </strong>
        </p>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded text-white text-lg"
      >
        Guardar cambios
      </button>
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
                onClick={registrarPago}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
