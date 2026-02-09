import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);

  // =========================
  // CARGAR USUARIOS
  // =========================
  async function loadUsers() {
    const res = await axiosInstance.get("/auth/users");
    setUsers(res.data);
  }

  // =========================
  // APROBAR CON CONSORCIO (NUEVO)
  // =========================
  async function aprobarConConsorcio(data) {
    /*
      data puede ser:

      {
        userId: number,
        consorcioId: number
      }

      o

      {
        userId: number,
        nuevoConsorcio: {
          nombre: string
        }
      }
    */

    const { userId, consorcioId, nuevoConsorcio } = data;

    await axiosInstance.patch(
      `/admin/usuarios/${userId}/approve`,
      consorcioId
        ? { consorcioId }
        : { nuevoConsorcio }
    );

    loadUsers();
  }

  // =========================
  // RECHAZAR
  // =========================
  async function rechazar(id) {
    await axiosInstance.patch(`/admin/usuarios/${id}/reject`);
    loadUsers();
  }

  // =========================
  // ELIMINAR
  // =========================
  async function eliminar(id) {
    const ok = confirm("¿Seguro que querés eliminar este usuario?");
    if (!ok) return;

    await axiosInstance.delete(`/admin/usuarios/${id}`);
    loadUsers();
  }

  // =========================
  // EDITAR USUARIO ACTIVO
  // =========================
  async function editarUsuario(id, data) {
    await axiosInstance.patch(`/admin/usuarios/${id}`, data);
    loadUsers();
  }

  // =========================
  // DESACTIVAR
  // =========================
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

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    aprobarConConsorcio, // 👈 NUEVO
    rechazar,
    eliminar,
    editarUsuario,
    desactivar,
  };
}
