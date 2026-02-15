import { useEffect, useState, useCallback } from "react";
import api from "../api/axiosInstance";

export function useConsorcioSuscripcion(consorcioId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!consorcioId) return;

    try {
      setLoading(true);
      const res = await api.get(
        `/consorcios/${consorcioId}/suscripcion`
      );

      setData(res.data);
    } catch (err) {
      console.error("Error cargando suscripción del consorcio", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [consorcioId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refresh: load, // 🔥 clave nueva
  };
}
