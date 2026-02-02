import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);

  // Cargar usuarios
  async function loadUsers() {
    const res = await axiosInstance.get("/auth/users");
    setUsers(res.data);
  }

  // Aprobar
  async function aprobar(id) {
    await axiosInstance.patch(`/admin/usuarios/${id}/approve`);
    loadUsers();
  }

  // Rechazar
  async function rechazar(id) {
    await axiosInstance.patch(`/admin/usuarios/${id}/reject`);
    loadUsers();
  }

  // Eliminar (pending / rejected)
  async function eliminar(id) {
    const ok = confirm("¿Seguro que querés eliminar este usuario?");
    if (!ok) return;

    await axiosInstance.delete(`/admin/usuarios/${id}`);
    loadUsers();
  }

  // Editar usuario activo (nombre / email)
async function editarUsuario(id, data) {
  await axiosInstance.patch(`/admin/usuarios/${id}`, data);
  loadUsers();
}
async function desactivar(id) {
  try {
    await axiosInstance.patch(`/admin/usuarios/${id}/deactivate`);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, estado: "inactive" } : u
      )
    );
  } catch (err) {
    alert(
      err.response?.data?.message || "Error al desactivar usuario"
    );
  }
}



  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    aprobar,
    rechazar,
    eliminar,
    editarUsuario,
    desactivar,
  };
}
