import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { getDeudores } from "../services/liquidacionesService";
import { getLiquidaciones } from "../services/liquidacionesService";

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
      <h1 className="text-3xl font-bold text-white mb-6">
        Mi Panel — Tesorero
      </h1>

      {/* GRID DE NOTAS POST-IT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* NOTA AUTOMÁTICA DEUDORES */}

        <div
          className="
            bg-yellow-300 
            text-black 
            p-6 
            rounded-[12px] 
            shadow-[0_5px_20px_rgba(0,0,0,0.25)]
            rotate-[1deg]
            border-[1.5px] border-yellow-500
          "
        >
          <h2 className="text-xl font-bold mb-3">📌 Deudores del mes</h2>

          {deudores.length === 0 ? (
            <p className="text-sm opacity-70">No hay deudores 🎉</p>
          ) : (
            <ul className="space-y-2">
              {deudores.map((d, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>
                    {d.nombre} — Piso {d.piso} • Dpto {d.departamento}
                  </span>
                  <span className="font-bold">
                    ${d.monto.toLocaleString("es-AR")}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="text-sm mt-4 italic opacity-70">
            *Datos reales desde las liquidaciones
          </p>
        </div>

        {/*  NOTA TAREAS */}

        <div
          className="
            bg-red-300 
            text-black 
            p-6 
            rounded-[12px] 
            shadow-[0_5px_20px_rgba(0,0,0,0.25)]
            -rotate-[1deg]
            border-[1.5px] border-red-500
          "
        >
          <h2 className="text-xl font-bold mb-3">📝 Tareas del tesorero</h2>

          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Generar liquidación del mes
            </li>

            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Registrar pagos pendientes
            </li>

            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Revisar movimientos
            </li>

            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Exportar PDF del mes
            </li>
          </ul>

          <p className="text-sm mt-4 italic opacity-70">
            *Próximamente tareas automáticas
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
