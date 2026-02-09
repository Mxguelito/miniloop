import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export function useConsorcioUsuarios(consorcioId) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsuarios() {
    try {
      setLoading(true);
      const res = await api.get(
        `/consorcios/${consorcioId}/usuarios`
      );
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error cargando usuarios del consorcio", err);
    } finally {
      setLoading(false);
    }
  }

  async function quitarUsuario(usuarioId) {
    const ok = confirm(
      "¿Quitar este usuario del consorcio? No se elimina el usuario."
    );
    if (!ok) return;

    await api.delete(
      `/consorcios/${consorcioId}/usuarios/${usuarioId}`
    );

    fetchUsuarios();
  }

  useEffect(() => {
    if (consorcioId) fetchUsuarios();
  }, [consorcioId]);

  return {
    usuarios,
    loading,
    quitarUsuario,
  };
}
