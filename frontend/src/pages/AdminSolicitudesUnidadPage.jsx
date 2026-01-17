import AppLayout from "../components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import useAdminSolicitudesUnidad from "../hooks/useAdminSolicitudesUnidad";

export default function AdminSolicitudesUnidadPage() {
 const { solicitudes, loading, reload, aprobar, rechazar } = useAdminSolicitudesUnidad();


  return (
    <AppLayout>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">
          Solicitudes de Unidad
        </h1>

        <button
          onClick={reload}
          className="px-4 py-2 rounded-xl bg-[#1f2a44] hover:bg-[#263457] text-white font-semibold border border-white/10"
        >
          Recargar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          No hay solicitudes pendientes.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {solicitudes.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="bg-[#151820] border border-[#2d4a7a] p-6 rounded-2xl shadow-[0_0_15px_rgba(0,150,255,0.2)]"
            >
              <h2 className="text-xl font-semibold text-blue-300">
                {s.nombre}
              </h2>
              <p className="text-gray-400 text-sm">{s.email}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-[#0d1224] rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400">Piso solicitado</p>
                  <p className="text-white font-semibold">{s.piso ?? "—"}</p>
                </div>

                <div className="bg-[#0d1224] rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400">Dpto solicitado</p>
                  <p className="text-white font-semibold">{s.dpto ?? "—"}</p>
                </div>

                <div className="bg-[#0d1224] rounded-xl p-3 border border-white/10 col-span-2">
                  <p className="text-xs text-gray-400">Unidad solicitada</p>
                  <p className="text-white font-semibold">{s.unidad ?? "—"}</p>
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={
                    s.estado === "pending"
                      ? "text-yellow-400 font-bold text-sm"
                      : s.estado === "approved"
                      ? "text-green-400 font-bold text-sm"
                      : "text-red-400 font-bold text-sm"
                  }
                >
                  {String(s.estado).toUpperCase()}
                </span>
              </div>

              {/* Botones quedan para el PASO 3 */}
             <div className="mt-6 flex gap-3">
  <button
  type="button"
  onClick={() => aprobar(s.id)}
  className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold"
>
  Aprobar
</button>

<button
  type="button"
  onClick={() => rechazar(s.id)}
  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold"
>
  Rechazar
</button>

</div>

            </motion.div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
