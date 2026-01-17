import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useAdminSolicitudesUnidad() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/solicitudes-unidad");
      setSolicitudes(res.data);
    } catch (err) {
      console.error(err);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }

  async function aprobar(id) {
    try {
      await axiosInstance.patch(`/admin/solicitudes-unidad/${id}/aprobar`);
      await load(); // refresca lista
    } catch (err) {
      console.error(err);
      alert("No se pudo aprobar la solicitud");
    }
  }

  async function rechazar(id) {
    try {
      await axiosInstance.patch(`/admin/solicitudes-unidad/${id}/rechazar`);
      await load(); // refresca lista
    } catch (err) {
      console.error(err);
      alert("No se pudo rechazar la solicitud");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { solicitudes, loading, aprobar, rechazar, reload: load };
}
