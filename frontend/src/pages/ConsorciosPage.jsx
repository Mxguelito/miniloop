import AppLayout from "../components/layout/AppLayout";
import { useConsorcios } from "../hooks/useConsorcios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BlockActionModal from "../components/ui/BlockActionModal";

export default function ConsorciosPage() {
  const navigate = useNavigate();
  const [consorcioAEliminar, setConsorcioAEliminar] = useState(null);

  const {
    list,
    form,
    setForm,
    showForm,
    editingId,
    openNew,
    openEdit,
    closeForm,
    submit,
    remove,
    blockedMessage,
    setBlockedMessage,
  } = useConsorcios();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 text-white">
        {/* CONTENEDOR CENTRAL */}
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===============================
              HEADER
          =============================== */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Consorcios</h1>
              <p className="text-sm text-gray-400 mt-1">
                Administrá edificios, usuarios y suscripciones
              </p>
            </div>

            <button
              onClick={openNew}
              className="
                px-5 py-2.5
                rounded-xl
                bg-blue-600
                hover:bg-blue-500
                transition
                font-semibold
              "
            >
              + Nuevo consorcio
            </button>
          </div>

          {/* ===============================
              LISTADO
          =============================== */}
          {list.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🏢</div>
              <p className="text-lg font-medium">No hay consorcios creados</p>
              <p className="text-sm text-gray-500 mt-1">
                Creá el primero para comenzar
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-4
              "
            >
              {list.map((c) => (
                <div
                  key={c.id}
                  className="
                    bg-[#0f1e29]
                    rounded-2xl
                    p-4
                    border border-white/10
                    shadow-md
                    hover:border-white/20
                    transition
                  "
                >
                  {/* HEADER CARD */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold truncate">
                        {c.nombre}
                      </h3>

                      {c.direccion && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {c.direccion}
                        </p>
                      )}
                    </div>

                    {/* BADGE USUARIOS */}
                    <span
                      className="
    flex items-center gap-1
    px-2.5 py-0.5
    rounded-full
    bg-emerald-500/15
    text-emerald-300
    text-xs
    font-semibold
    border border-emerald-400/20
    shadow-[0_0_10px_rgba(52,211,153,0.25)]
    whitespace-nowrap
  "
                    >
                      👤 {c.usuarios_count ?? 0}
                    </span>
                  </div>

                  {/* PLAN */}
                  <div className="mt-3 rounded-xl bg-black/30 p-3 border border-white/10">
                    <p className="text-xs text-white/60">Plan</p>
                    <p className="text-sm font-medium mt-0.5">
                      Gestión de suscripción
                    </p>
                  </div>

                  {/* ACCIONES */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                    {/* EDITAR */}
                    <button
                      onClick={() => openEdit(c)}
                      className="
    flex items-center justify-center
    py-2
    rounded-lg
    bg-blue-500/10
    text-blue-300
    hover:bg-blue-500/20
    transition
  "
                    >
                      Editar
                    </button>

                    {/* VER USUARIOS */}
                    <button
                      onClick={() => navigate(`/consorcios/${c.id}/usuarios`)}
                      className="
    flex
    items-center
    justify-center
    gap-1
    py-2
    rounded-lg
    bg-indigo-500/15
    text-indigo-300
    hover:bg-indigo-500/30
    hover:text-indigo-200
    transition
    shadow-inner
  "
                      title="Ver usuarios"
                    >
                      👁
                    </button>

                    {/* ELIMINAR */}
                    <button
                      onClick={() => {
                        if ((c.usuarios_count ?? 0) > 0) {
                          setBlockedMessage(
                            `Este consorcio tiene ${c.usuarios_count} usuarios asignados.`,
                          );
                          return;
                        }
                        setConsorcioAEliminar(c);
                      }}
                      className="
    flex items-center justify-center
    py-2
    rounded-lg
    bg-red-500/10
    text-red-400
    hover:bg-red-500/25
    transition
    font-semibold
  "
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===============================
            MODAL FORM
        =============================== */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#0f1e29] rounded-2xl p-6 w-full max-w-md border border-white/10">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? "Editar consorcio" : "Nuevo consorcio"}
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Nombre del consorcio"
                  value={form.nombre || ""}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="
                    w-full
                    px-4 py-2
                    rounded-lg
                    bg-black/40
                    border border-white/10
                    focus:outline-none
                  "
                />

                <input
                  type="text"
                  placeholder="Dirección (opcional)"
                  value={form.direccion || ""}
                  onChange={(e) =>
                    setForm({ ...form, direccion: e.target.value })
                  }
                  className="
                    w-full
                    px-4 py-2
                    rounded-lg
                    bg-black/40
                    border border-white/10
                    focus:outline-none
                  "
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===============================
            MODAL ELIMINAR
        =============================== */}
        {consorcioAEliminar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#0f1e29] border border-white/10 shadow-2xl p-6">
              <h2 className="text-xl font-bold text-red-400 mb-2">
                Eliminar consorcio
              </h2>

              <p className="text-sm text-gray-400 mb-4">
                Esta acción no se puede deshacer
              </p>

              <p className="font-semibold">{consorcioAEliminar.nombre}</p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConsorcioAEliminar(null)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    remove(consorcioAEliminar.id);
                    setConsorcioAEliminar(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===============================
            MODAL BLOQUEADO
        =============================== */}
        {blockedMessage && (
          <BlockActionModal
            title="Acción bloqueada"
            message={blockedMessage}
            onClose={() => setBlockedMessage(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
