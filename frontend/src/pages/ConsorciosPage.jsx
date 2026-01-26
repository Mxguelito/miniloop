import { useEffect, useState } from "react";
import {
  getConsorcios,
  createConsorcio,
  updateConsorcio,
  deleteConsorcio,
} from "../services/consorciosService";
import AppLayout from "../components/layout/AppLayout";

export default function ConsorciosPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    unidades: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar consorcios al entrar
  useEffect(() => {
    setList(getConsorcios());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (editingId) {
      updateConsorcio(editingId, form);
    } else {
      createConsorcio(form);
    }

    setList(getConsorcios());
    setForm({ nombre: "", direccion: "", unidades: "" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(item) {
    setForm({
      nombre: item.nombre,
      direccion: item.direccion,
      unidades: item.unidades,
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    deleteConsorcio(id);
    setList(getConsorcios());
  }

  return (
    <AppLayout>
      <div className="p-6 text-white">
        <h2 className="text-3xl font-bold mb-6">Consorcios</h2>

        {/* Botón nuevo */}
        <button
          onClick={() => {
            setForm({ nombre: "", direccion: "", unidades: "" });
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-6"
        >
          Nuevo Consorcio
        </button>

        {/* Tabla */}
        <table className="w-full text-left bg-[#0f1e29] rounded-xl overflow-hidden">
          <thead className="bg-[#19344a] text-gray-300">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Dirección</th>
              <th className="px-4 py-3">Unidades</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-gray-700">
                <td className="px-4 py-3">{c.nombre}</td>
                <td className="px-4 py-3">{c.direccion}</td>
                <td className="px-4 py-3">{c.unidades}</td>
                <td className="px-4 py-3 flex gap-4">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-400"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-[#0f1e29] p-6 rounded-xl w-[400px] shadow-lg border border-white/10">
              <h3 className="text-xl font-bold mb-4">
                {editingId ? "Editar Consorcio" : "Nuevo Consorcio"}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="bg-[#09131b] p-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Dirección"
                  value={form.direccion}
                  onChange={(e) =>
                    setForm({ ...form, direccion: e.target.value })
                  }
                  className="bg-[#09131b] p-2 rounded"
                  required
                />

                <input
                  type="number"
                  placeholder="Unidades"
                  value={form.unidades}
                  onChange={(e) =>
                    setForm({ ...form, unidades: e.target.value })
                  }
                  className="bg-[#09131b] p-2 rounded"
                  required
                />

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="text-gray-300"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
