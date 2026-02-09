import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { useConsorcioUsuarios } from "../hooks/useConsorcioUsuarios";

function RoleBadge({ role }) {
  const colors = {
    ADMIN: "bg-yellow-500/20 text-yellow-300",
    PROPIETARIO: "bg-blue-500/20 text-blue-300",
    TESORERO: "bg-green-500/20 text-green-300",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        colors[role] || "bg-gray-500/20 text-gray-300"
      }`}
    >
      {role}
    </span>
  );
}

export default function ConsorcioUsuariosPage() {
  const { consorcioId } = useParams();
  const navigate = useNavigate();

  const { usuarios, loading, quitarUsuario } =
    useConsorcioUsuarios(consorcioId);

  return (
    <AppLayout>
      <div className="p-6 text-white max-w-5xl mx-auto">
        {/* ===============================
            HEADER
        =============================== */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Usuarios del consorcio
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Administración de propietarios asignados
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm"
          >
            ← Volver
          </button>
        </div>

        {/* ===============================
            CONTENIDO
        =============================== */}
        {loading ? (
          <div className="text-gray-400 animate-pulse">
            Cargando usuarios…
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-lg font-medium">
              No hay usuarios asignados
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Este consorcio aún no tiene propietarios
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {usuarios.map((u) => (
              <div
                key={u.id}
                className="
                  flex items-center justify-between
                  bg-[#0f1e29]
                  border border-white/10
                  rounded-2xl
                  p-5
                  hover:border-white/20
                  transition
                "
              >
                {/* INFO USUARIO */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-lg">
                      {u.nombre}
                    </p>
                    <RoleBadge role={u.role} />
                  </div>

                  <p className="text-sm text-gray-400">
                    {u.email}
                  </p>
                </div>

                {/* ACCIONES */}
                <button
                  onClick={() => quitarUsuario(u.id)}
                  className="
                    px-4 py-2
                    rounded-lg
                    text-sm font-semibold
                    bg-red-500/20
                    text-red-300
                    hover:bg-red-500/40
                    transition
                  "
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
