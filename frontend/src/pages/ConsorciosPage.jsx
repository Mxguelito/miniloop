import AppLayout from "../components/layout/AppLayout";
import { useConsorcios } from "../hooks/useConsorcios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BlockActionModal from "../components/ui/BlockActionModal";
import ConsorcioCard from "../components/consorcios/ConsorcioCard";

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
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ================= HEADER ================= */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Consorcios</h1>
              <p className="text-sm text-gray-400 mt-1">
                Administrá edificios, usuarios y suscripciones
              </p>
            </div>

            <button
              onClick={openNew}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
            >
              + Nuevo consorcio
            </button>
          </div>

          {/* ================= LISTADO ================= */}
          {list.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🏢</div>
              <p className="text-lg font-medium">No hay consorcios creados</p>
              <p className="text-sm text-gray-500 mt-1">
                Creá el primero para comenzar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {list.map((c) => (
                <ConsorcioCard
                  key={c.id}
                  consorcio={c}
                  onEdit={openEdit}
                  onViewUsers={() =>
                    navigate(`/consorcios/${c.id}/usuarios`)
                  }
                  onDelete={(consorcio) => {
                    if ((consorcio.usuarios_count ?? 0) > 0) {
                      setBlockedMessage(
                        `Este consorcio tiene ${consorcio.usuarios_count} usuarios asignados.`
                      );
                      return;
                    }
                    setConsorcioAEliminar(consorcio);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= MODAL FORM ================= */}
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
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10"
                />

                <input
                  type="text"
                  placeholder="Dirección (opcional)"
                  value={form.direccion || ""}
                  onChange={(e) =>
                    setForm({ ...form, direccion: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10"
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

        {/* ================= MODAL ELIMINAR ================= */}
        {consorcioAEliminar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#0f1e29] border border-white/10 p-6">
              <h2 className="text-xl font-bold text-red-400 mb-2">
                Eliminar consorcio
              </h2>

              <p className="text-sm text-gray-400 mb-4">
                Esta acción no se puede deshacer
              </p>

              <p className="font-semibold">
                {consorcioAEliminar.nombre}
              </p>

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

        {/* ================= MODAL BLOQUEADO ================= */}
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
