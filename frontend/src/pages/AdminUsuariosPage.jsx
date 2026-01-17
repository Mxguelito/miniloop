import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import useAdminUsers from "../hooks/useAdminUsers";
import { useNavigate } from "react-router-dom";


export default function AdminUsuariosPage() {

  const navigate = useNavigate();

  const { users, aprobar, rechazar, eliminar } = useAdminUsers();

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-white mb-6">
        Gestión de Usuarios
      </h1>
      <div className="flex flex-wrap gap-3 mb-6">
  <button
    onClick={() => navigate("/admin/solicitudes-unidad")}
    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
  >
    Ver Solicitudes de Unidad
  </button>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((u) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#151820] border border-[#2d4a7a] p-6 rounded-2xl shadow-[0_0_15px_rgba(0,150,255,0.2)]"
          >
            <h2 className="text-xl font-semibold text-blue-300">
              {u.nombre}
            </h2>
            <p className="text-gray-400 text-sm">{u.email}</p>

            <div className="mt-3">
              <span className="text-xs text-gray-400">Rol:</span>
              <p className="text-gray-200 font-medium">{u.role}</p>
            </div>

            <div className="mt-3">
              <span className="text-xs text-gray-400">Estado:</span>
              <p
                className={
                  u.estado === "pending"
                    ? "text-yellow-400 font-bold"
                    : u.estado === "active"
                    ? "text-green-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {u.estado.toUpperCase()}
              </p>
            </div>

            {/* BOTONES */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {u.estado === "pending" && (
                <>
                  <button
                    onClick={() => aprobar(u.id)}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-semibold"
                  >
                    Aprobar
                  </button>

                  <button
                    onClick={() => rechazar(u.id)}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold"
                  >
                    Rechazar
                  </button>
                </>
              )}

              {(u.estado === "pending" || u.estado === "rejected") && (
                <button
                  onClick={() => eliminar(u.id)}
                  className="flex-1 py-2 bg-red-800 hover:bg-red-700 rounded-lg text-white font-semibold"
                >
                  🗑️ Eliminar
                </button>
              )}

              {u.estado === "active" && (
                <span className="text-green-400 font-semibold">
                  ✔ Activo
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}
