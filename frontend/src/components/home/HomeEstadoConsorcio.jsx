import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { formatMoney } from "../../services/liquidacionesService";

export default function HomeEstadoConsorcio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Usá el endpoint que ya tenés para el resumen
        const res = await axiosInstance.get("/tesoreria/resumen");
        setData(res.data);
      } catch (e) {
        console.error("Error cargando estado del consorcio", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-white/60">
        Cargando estado del consorcio…
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="rounded-xl bg-gradient-to-br from-blue-900/40 to-black/40 border border-blue-400/20 p-6">

      <h3 className="text-white font-semibold mb-4 text-lg">
  📊 Estado financiero del consorcio
</h3>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card label="Deuda total" value={formatMoney(data.deudaTotal)} />
        <Card label="Recaudado del mes" value={formatMoney(data.ingresosMes)} />
        <Card label="Deudores activos" value={data.cantidadDeudores} />
      </div>
    </section>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-lg bg-black/30 border border-white/10 p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className="text-lg font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
