import { useEffect, useState } from "react";
import {
  getLiquidacion,
  updateLiquidacion,
} from "../../services/liquidacionesService";
import axiosInstance from "../../api/axiosInstance";

/**
 * Hook central de una liquidación
 * Maneja:
 * - carga
 * - propietarios
 * - movimientos
 * - totales
 * - estado
 */
export function useLiquidacion(liquidacionId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // CARGA INICIAL
  // ===============================
  useEffect(() => {
    async function load() {
      try {
        const item = await getLiquidacion(liquidacionId);

        setData(item);
      } catch (err) {
        console.error("Error cargando liquidación", err);
      } finally {
        setLoading(false);
      }
    }

    if (liquidacionId) load();
  }, [liquidacionId]);

  // ===============================
  // GUARDAR
  // ===============================
  async function save(payload) {
    if (!data) return;

    const updated = await updateLiquidacion(data.id, payload);
    setData(updated);
    return updated;
  }

  // ===============================
  // PUBLICAR
  // ===============================
  async function publicar() {
    if (!data) return;

    await axiosInstance.patch(
      `/tesorero/liquidaciones/${data.id}/publicar`
    );

    const updated = await getLiquidacion(data.id);
    setData(updated);
    return updated;
  }

  return {
    data,
    setData,
    loading,

    // acciones
    save,
    publicar,
  };
}
