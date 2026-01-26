import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/usersService";
import AppLayout from "../components/layout/AppLayout";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "USER",
  });

  // cargar usuarios al entrar
  useEffect(() => {
    setUsers(getUsers());
  }, []);

  function openCreateModal() {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "USER" });
    setModalOpen(true);
  }

  function openEditModal(user) {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingUser) {
      updateUser(editingUser.id, form);
    } else {
      createUser(form);
    }

    setUsers(getUsers());
    setModalOpen(false);
  }

  function handleDelete(id) {
    deleteUser(id);
    setUsers(getUsers());
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>

        <button
          onClick={openCreateModal}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Nuevo Usuario
        </button>
      </div>

      {/* TABLA */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-700 text-gray-300">
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rol</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-b border-gray-700 hover:bg-gray-800 transition"
            >
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3 text-right space-x-3">
                <button
                  onClick={() => openEditModal(u)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Nombre</label>
                <input
                  className="w-full px-3 py-2 rounded bg-gray-700"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded bg-gray-700"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1">Rol</label>
                <select
                  className="w-full px-3 py-2 rounded bg-gray-700"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="TESORERO">TESORERO</option>
                  <option value="PROPIETARIO">PROPIETARIO</option>
                  <option value="INQUILINO">INQUILINO</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
