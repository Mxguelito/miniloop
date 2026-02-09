import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import useAdminUsers from "../hooks/useAdminUsers";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AsignarConsorcioModal from "../components/admin/AsignarConsorcioModal";

export default function AdminUsuariosPage() {
  const navigate = useNavigate();
  const { users, aprobarConConsorcio, rechazar, eliminar, desactivar } =
    useAdminUsers();

  const [showInactive, setShowInactive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const usuariosFiltrados = users.filter((u) =>
    showInactive
      ? u.estado === "inactive" || u.estado === "rejected"
      : u.estado !== "inactive" && u.estado !== "rejected",
  );

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-white mb-6">
        Gestión de Usuarios
      </h1>

      {/* ACCIONES SUPERIORES */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/solicitudes-unidad")}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
        >
          Ver Solicitudes de Unidad
        </button>

        <button
          onClick={() => setShowInactive(!showInactive)}
          className="px-4 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white font-semibold"
        >
          {showInactive ? "Ver usuarios activos" : "Ver usuarios desactivados"}
        </button>
      </div>

      {/* LISTADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {usuariosFiltrados.map((u) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              bg-gradient-to-br from-[#0f172a]/90 to-[#020617]/90
              border border-[#1e3a8a]/40
              backdrop-blur-xl
              p-4 md:p-6
              rounded-2xl
              shadow-[0_0_20px_rgba(59,130,246,0.15)]
              hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]
              transition-all
            "
          >
            <h2 className="text-lg md:text-xl font-semibold text-blue-300">
              {u.nombre}
            </h2>

            <p className="text-gray-400 text-xs md:text-sm truncate">
              {u.email}
            </p>

            {/* ROL */}
            <div className="mt-3">
              <span className="text-xs text-gray-400">Rol</span>
              <p className="text-gray-200 font-medium">{u.role}</p>
            </div>

            {/* ESTADO */}
            <div className="mt-3">
              <span className="text-xs text-gray-400">Estado</span>
              <span
                className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-semibold
                  ${
                    u.estado === "pending"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30"
                      : u.estado === "active"
                        ? "bg-green-500/10 text-green-400 border border-green-400/30"
                        : "bg-red-500/10 text-red-400 border border-red-400/30"
                  }`}
              >
                {u.estado.toUpperCase()}
              </span>
            </div>

            {/* MENSAJE INACTIVO */}
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
                    onClick={() => {
                      setSelectedUser(u);
                      setShowModal(true);
                    }}
                    className="
    inline-flex items-center gap-2
    px-4 py-1.5
    text-sm font-semibold
    text-emerald-300
    bg-emerald-500/10
    border border-emerald-500/30
    rounded-full

    hover:bg-emerald-500/20
    hover:text-emerald-200
    hover:border-emerald-400/60

    shadow-[0_0_15px_rgba(16,185,129,0.25)]
    hover:shadow-[0_0_25px_rgba(16,185,129,0.45)]

    transition-all duration-200
  "
                  >
                    ✓ Aprobar
                  </button>

                  <button
                    onClick={() => rechazar(u.id)}
                    className="
    inline-flex items-center gap-2
    px-4 py-1.5
    text-sm font-semibold
    text-red-300
    bg-red-500/10
    border border-red-500/30
    rounded-full
    hover:bg-red-500/20
    hover:text-red-200
    transition-all
  "
                  >
                    ✕ Rechazar
                  </button>
                </>
              )}

              {u.estado === "active" && (
                <>
                  <span className="text-green-400 font-semibold flex-1">
                    ✔ Activo
                  </span>

                  <button
                    onClick={() => desactivar(u.id)}
                    className="flex-1 py-2 bg-yellow-600/80 hover:bg-yellow-500 rounded-lg text-white font-semibold"
                  >
                    ⏸ Desactivar
                  </button>
                </>
              )}

              {u.estado === "inactive" && (
                <button
                  onClick={() => eliminar(u.id)}
                  className="
    inline-flex items-center gap-2
    px-4 py-1.5
    text-xs font-semibold
    text-red-400
    border border-red-500/30
    rounded-full
    bg-red-500/10
    hover:bg-red-500/25
    hover:text-red-300
    transition-all
  "
                >
                  🗑 Eliminar definitivamente
                </button>
              )}
              {u.estado === "rejected" && (
                <button
                  onClick={() => eliminar(u.id)}
                  className="
      inline-flex items-center gap-2
      px-4 py-1.5
      text-xs font-semibold
      text-red-400
      border border-red-500/30
      rounded-full
      bg-red-500/10
      hover:bg-red-500/25
      hover:text-red-300
      transition-all
    "
                >
                  🗑 Eliminar definitivamente
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AsignarConsorcioModal
        open={showModal}
        user={selectedUser}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onConfirm={async (data) => {
          await aprobarConConsorcio({
            userId: selectedUser.id,
            ...data,
          });

          setShowModal(false);
          setSelectedUser(null);
        }}
      />
    </AppLayout>
  );
}
