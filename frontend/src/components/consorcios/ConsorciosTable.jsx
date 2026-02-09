import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ConsorciosTable({ list, onEdit, onDelete }) {
  const navigate = useNavigate();
  if (list.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-4">🏢</div>
        <p className="text-lg font-medium">No hay consorcios creados</p>
        <p className="text-sm text-gray-500 mt-1">
          Creá el primero para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {list.map((c) => (
        <div
          key={c.id}
          className="
            bg-[#0f1e29]
            rounded-2xl
            p-5
            border border-white/10
            shadow-lg
            transition
            hover:border-white/20
          "
        >
          {/* ===============================
              HEADER CONSORCIO
          =============================== */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{c.nombre}</h3>

              <p className="text-sm text-gray-400 mt-1">{c.direccion}</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
              {c.unidades} unidades
            </span>
          </div>

          {/* ===============================
              BLOQUE PLAN (ADMIN)
          =============================== */}
          <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/10">
            <p className="text-xs text-white/60 mb-1">Plan del consorcio</p>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Gestión de suscripción
                </p>
                <p className="text-xs text-white/50">
                  El plan se administra desde el módulo de planes
                </p>
              </div>

              <Link
                to="/planes"
                className="
                  px-4 py-2
                  rounded-lg
                  bg-purple-600
                  hover:bg-purple-500
                  transition
                  text-sm
                  whitespace-nowrap
                "
              >
                Ver planes
              </Link>
            </div>
          </div>

          {/* ===============================
              ACCIONES
          =============================== */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => onEdit(c)}
              className="
                flex-1
                py-2
                rounded-xl
                text-blue-400
                bg-white/5
                hover:bg-white/10
                transition
              "
            >
              Editar
            </button>

            <button
              onClick={() => onDelete(c.id)}
              className="
                flex-1
                py-2
                rounded-xl
                text-red-400
                bg-white/5
                hover:bg-white/10
                transition
              "
            >
              Eliminar
            </button>
            <button
              onClick={() => navigate(`/consorcios/${c.id}/usuarios`)}
              className="
    px-3 py-1.5
    text-sm font-semibold
    rounded-lg
    bg-blue-500/20
    text-blue-300
    hover:bg-blue-500/40
    transition
  "
            >
              👁 Ver usuarios
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
