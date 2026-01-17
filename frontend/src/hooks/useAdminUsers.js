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


  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    aprobar,
    rechazar,
    eliminar,
    editarUsuario,
  };
}
