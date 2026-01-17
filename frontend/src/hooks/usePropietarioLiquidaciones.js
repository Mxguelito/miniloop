import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function usePropietarioLiquidaciones() {
  const [actual, setActual] = useState(null);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [resActual, resLista] = await Promise.all([
        axiosInstance.get("/propietario/actual"),
        axiosInstance.get("/propietario/liquidaciones"),
      ]);

      setActual(resActual.data);
      setLista(resLista.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return { actual, lista, loading, reload: loadAll };
}
