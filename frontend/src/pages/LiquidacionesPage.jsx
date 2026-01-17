import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import {
  getLiquidaciones,
  deleteLiquidacion,
  formatMoney,
} from "../services/liquidacionesService";
import { getLiquidacion } from "../services/liquidacionesService";
import { exportLiquidacionPDF } from "../utils/exportLiquidacionPDF";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";




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
    exportLiquidacionPDF(liq);  // usa tu PDF PRO
  } catch (err) {
    console.error("Error exportando PDF:", err);
    alert("No se pudo exportar el PDF");
  }
}

// Filtrar por año
const filteredItems =
  yearFilter === "todos"
    ? items
    : items.filter((l) => String(l.anio) === String(yearFilter));

//  Calcular totales en tiempo real
const saldoTotal = filteredItems.reduce(
  (acc, l) => acc + (Number(l.saldo_mes) || 0),
  0
);


const deudaTotal = filteredItems.reduce(
  (acc, l) => acc + Number(l.deuda_total || 0),
  0
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

// Ordenar de mayor a menor deuda
deudores.sort((a, b) => b.monto - a.monto);
console.log("📊 Deudores detectados:", deudores);






  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">

  <h1 className="text-3xl font-bold">Liquidaciones</h1>

  <div className="flex items-center gap-4">

    {/* ====== SELECT TESLA NEON ====== */}
    <select
      value={yearFilter}
      onChange={(e) => setYearFilter(e.target.value)}
      className="
        bg-gray-900 text-gray-200 px-4 py-2 rounded-lg border border-gray-700 
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none 
        transition-all duration-200 cursor-pointer
        hover:shadow-[0_0_15px_rgba(0,140,255,0.5)]
      "
    >
      <option value="todos">Todos los años</option>
      <option value="2025">2025</option>
      <option value="2024">2024</option>
      <option value="2023">2023</option>
    </select>

    {/* Botón nueva LIQUIDACION */}
    <button
      onClick={handleNueva}
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
    >
      Nueva liquidación
    </button>

  </div>
</div>
{/* ====== RESUMEN FINANCIERO EN TIEMPO REAL ====== */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
  {/* 💰 Saldos */}
  <div className="p-6 rounded-2xl bg-gradient-to-r from-green-600/80 to-green-500/70 
                  text-white shadow-[0_0_25px_rgba(0,255,150,0.4)]">
    <h2 className="text-lg font-semibold mb-1">Saldo total</h2>
    <p className="text-3xl font-bold">{formatMoney(saldoTotal)}</p>
    <p className="opacity-80 text-sm mt-1">Suma de todos los meses</p>
  </div>

  {/* 🚨 Deudas */}
  <div className="p-6 rounded-2xl bg-gradient-to-r from-red-600/80 to-red-500/70 
                  text-white shadow-[0_0_25px_rgba(255,0,0,0.4)]">
    <h2 className="text-lg font-semibold mb-1">Deuda total</h2>
    <p className="text-3xl font-bold">{formatMoney(deudaTotal)}</p>
    <p className="opacity-80 text-sm mt-1">Monto total adeudado</p>
  </div>
</div>
{/* ====== GRÁFICO ANUAL ====== */}
<div className="rounded-2xl bg-white/5 dark:bg-[#111]/50 p-6 border border-white/10 mb-6">
  <h2 className="text-lg font-semibold mb-4 text-gray-100">
    Evolución del saldo mensual
  </h2>

  <ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
    <XAxis dataKey="mes" stroke="#aaa" />
    <YAxis stroke="#aaa" />
    <Tooltip
      formatter={(value) => [`$ ${value.toLocaleString("es-AR")}`, "Saldo"]}
      contentStyle={{
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: "10px",
        border: "none",
        color: "#fff",
      }}
    />

   

   {/* ===== LÍNEA CONTINUA CON COLORES DE TENDENCIA ===== */}
<Line
  type="monotone"
  data={chartData}
  dataKey="saldo"
  stroke="#00ff9d"
  strokeWidth={3}
  dot={(props) => {
    const { cx, cy, payload } = props;
    const color =
      payload.tendencia === "sube"
        ? "#00ff9d" // verde neón
        : "#ff0055"; // rojo Tesla
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={color}
        stroke="white"
        strokeWidth={1}
      />
    );
  }}
  activeDot={(props) => {
    const { cx, cy, payload } = props;
    const color =
      payload.tendencia === "sube"
        ? "#00ff9d"
        : "#ff0055";
    return (
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={color}
        stroke="white"
        strokeWidth={2}
      />
    );
  }}
/>

  </LineChart>
</ResponsiveContainer>
{/* ===== SECCIÓN RANKING DE DEUDORES ===== */}
{deudores.length > 0 && (
  <div className="mt-10">
    <h2 className="text-xl font-semibold text-red-400 mb-6 text-center">
      Ranking de Deudores 💸
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {deudores.map((d, i) => (
        <div
          key={i}
          className="bg-red-950/40 border border-red-500/30 rounded-2xl p-5 shadow-lg 
                     hover:shadow-red-500/30 transition-all duration-300 backdrop-blur-md"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-red-300 font-semibold text-lg">
              #{i + 1} — {d.nombre}
            </h3>
            <span className="text-xs text-gray-400">
              Piso {d.piso} • Dpto {d.departamento}
            </span>
          </div>

          <p className="text-red-400 text-2xl font-bold">
            {formatMoney(d.monto)}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

{/* ===== LEYENDA TESLA ===== */}
<div className="flex justify-center items-center gap-6 mt-4 text-gray-400 text-sm">
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-[#00ff9d]"></span>
    <span>Subida de saldo</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-[#ff0055]"></span>
    <span>Bajada de saldo</span>
  </div>
</div>


</div>





      {/* Loading */}
      {loading && <div className="text-gray-300">Cargando liquidaciones...</div>}

      {/* Sin resultados */}
      {!loading && items.length === 0 && (
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-gray-300">
          No hay liquidaciones creadas aún.
        </div>
      )}

      {/* Tabla de resultados */}
      {!loading && items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
          <table className="min-w-full bg-gray-900 text-gray-200">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Mes</th>
                <th className="px-4 py-3 text-left">Año</th>
                <th className="px-4 py-3 text-left">Saldo</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((l) => (

                <tr key={l.id} className="border-t border-gray-800 hover:bg-gray-800/40 transition">
                  <td className="px-4 py-3">{l.mes}</td>
                  <td className="px-4 py-3">{l.anio}</td>

     <td className="px-4 py-3 font-semibold">
  <span
    className={
      Number(l.saldo_mes) >= 0 ? "text-green-400" : "text-red-400"
    }
  >
    {formatMoney(l.saldo_mes)}
  </span>
</td>



                  <td className="px-4 py-3">
                    {l.estado === "Borrador" ? (
                      <span className="text-yellow-300">Borrador</span>
                    ) : (
                      <span className="text-green-400">Cerrada</span>
                    )}
                  </td>

                  <td className="px-4 py-3 flex gap-4">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => navigate(`/liquidaciones/${l.id}`)}
                    >
                      Ver / Editar
                    </button>
                    <button
  className="text-purple-400 hover:text-purple-300"
  onClick={() => handleExport(l.id)}
>
  PDF
</button>


                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(l.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
