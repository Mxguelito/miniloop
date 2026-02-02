import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import useAdminUsers from "../hooks/useAdminUsers";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminUsuariosPage() {
  const navigate = useNavigate();

  const { users, aprobar, rechazar, eliminar, desactivar } = useAdminUsers();
  const [showInactive, setShowInactive] = useState(false);

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
        <button
          onClick={() => setShowInactive(!showInactive)}
          className="
    px-4 py-2 rounded-xl
    bg-purple-600/80 hover:bg-purple-500
    text-white font-semibold
    transition-all
  "
        >
          {showInactive ? "Ver usuarios activos" : "Ver usuarios desactivados"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {users
          .filter((u) =>
            showInactive ? u.estado === "inactive" : u.estado !== "inactive",
          )
          .map((u) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="
  relative
  bg-gradient-to-br from-[#0f172a]/90 to-[#020617]/90
  border border-[#1e3a8a]/40
  backdrop-blur-xl
  p-4 md:p-6
  rounded- 
  shadow-[0_0_20px_rgba(59,130,246,0.15)]
  hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]
  transition-all duration-300
"
            >
              <h2 className="text-lg md:text-xl font-semibold text-blue-300 tracking-wide">
                {u.nombre}
              </h2>

              <p className="text-gray-400 text-xs md:text-sm truncate">
                {u.email}
              </p>

              <div className="mt-3">
                <span className="text-xs text-gray-400">Rol:</span>
                <p className="text-gray-200 font-medium">{u.role}</p>
              </div>

              <div className="mt-3">
                <span className="text-xs text-gray-400">Estado:</span>
                <span
                  className={`
    inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-semibold
    ${
      u.estado === "pending"
        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30"
        : u.estado === "active"
          ? "bg-green-500/10 text-green-400 border border-green-400/30"
          : "bg-red-500/10 text-red-400 border border-red-400/30"
    }
  `}
                >
                  {u.estado.toUpperCase()}
                </span>
              </div>

              {u.estado === "inactive" && (
                <p className="mt-2 text-sm text-red-400 font-semibold">
                  🚫 Usuario desactivado
                </p>
              )}

              {/* BOTONES */}
              <div className="mt-6 flex gap-3 flex-wrap">
                {u.estado === "pending" && (
                  <>
                    <button
                      onClick={() => aprobar(u.id)}
                      className="
  flex-1 py-2 text-sm
  bg-green-600/80 hover:bg-green-500
  rounded-lg
  text-white font-semibold
  transition-all
"
                    >
                      Aprobar
                    </button>

                    <button
                      onClick={() => rechazar(u.id)}
                      className="
  flex-1 py-2 text-sm
  bg-red-600/80 hover:bg-red-500
  rounded-lg
  text-white font-semibold
  transition-all
"
                    >
                      Rechazar
                    </button>
                  </>
                )}

                {(u.estado === "pending" || u.estado === "rejected") && (
                  <button
                    onClick={() => eliminar(u.id)}
                    className="
  flex-1 py-2 text-sm
  bg-red-800/80 hover:bg-red-700
  rounded-lg
  text-white font-semibold
  transition-all
"
                  >
                    🗑️ Eliminar
                  </button>
                )}

                {u.estado === "active" && (
                  <>
                    <span className="text-green-400 font-semibold flex-1">
                      ✔ Activo
                    </span>

                    <button
                      onClick={() => desactivar(u.id)}
                      className="
        flex-1 py-2
        bg-yellow-600/80 hover:bg-yellow-500
        rounded-lg
        text-white font-semibold
        transition-all
      "
                    >
                      ⏸ Desactivar
                    </button>
                  </>
                )}
                {u.estado === "inactive" && (
                  <button
                    onClick={() => eliminar(u.id)}
                    className="
      w-full py-2 text-sm
      bg-red-700 hover:bg-red-600
      rounded-lg
      text-white font-semibold
      transition-all
    "
                  >
                    🗑️ Eliminar definitivamente
                  </button>
                )}
              </div>
            </motion.div>
          ))}
      </div>
    </AppLayout>
  );
}
