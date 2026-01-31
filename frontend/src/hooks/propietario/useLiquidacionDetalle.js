import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";

export function useLiquidacionDetalle(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axiosInstance.get(`/propietarios/liquidacion/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Error cargando liquidación:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  // Normalizamos números
  const expensaTotal = Number(data?.expensaTotal ?? 0);
  const pagado = Number(data?.pagado ?? 0);
  const pendiente = Number(data?.pendiente ?? 0);

  // Estado de pago derivado
  const estadoPago = useMemo(() => {
    if (pendiente <= 0) return "Pagado";
    if (pendiente === expensaTotal) return "Pendiente";
    return "Parcial";
  }, [pendiente, expensaTotal]);

  return {
    data,
    loading,
    expensaTotal,
    pagado,
    pendiente,
    estadoPago,
  };
}
