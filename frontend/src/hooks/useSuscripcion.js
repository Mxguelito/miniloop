import { useEffect, useState, useCallback } from "react";
import api from "../api/axiosInstance";

export function useSuscripcion() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/suscripcion/estado");

      // 🔥 NORMALIZACIÓN CENTRAL (backend → frontend)
      setData({
        ...res.data,

        // snake_case → camelCase
        diasRestantes: res.data.dias_restantes ?? null,

        // ACTIVA → ACTIVO (clave para el banner)
        estado: res.data.estado ?? "SIN_SUSCRIPCION",
      });
    } catch (e) {
      console.error("Error cargando suscripción", e);

      // 🛟 fallback seguro (nunca rompe UI)
      setData({
        plan: "BASIC",
        estado: "SIN_SUSCRIPCION",
        diasRestantes: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    suscripcion: data,
    loading,
    refresh: load,
  };
}
