import { useCallback } from "react";
import { recalcularTotales } from "../../utils/tesoreria/recalcularTotales";

/**
 * Hook para manejar MOVIMIENTOS dentro de una liquidación
 * (ingresos y gastos)
 */
export default function useMovimientos(data, setData) {
  const movimientos = data?.movimientos || [];

  // ===============================
  // AGREGAR MOVIMIENTO
  // ===============================
  const addMovimiento = useCallback(
    (tipo) => {
      setData((prev) => {
        const nuevo = {
          id: crypto.randomUUID(),
          tipo, // "ingreso" | "gasto"
          motivo: "",
          monto: 0,
        };

        const nuevosMov = [...(prev.movimientos || []), nuevo];

        const { propietarios, totales } = recalcularTotales(
          prev.propietarios,
          nuevosMov
        );

        return {
          ...prev,
          movimientos: nuevosMov,
          propietarios,
          totales,
        };
      });
    },
    [setData]
  );

  // ===============================
  // EDITAR MOVIMIENTO
  // ===============================
  const updateMovimiento = useCallback(
    (id, campo, valor) => {
      setData((prev) => {
        const nuevosMov = prev.movimientos.map((m) =>
          m.id === id ? { ...m, [campo]: valor } : m
        );

        const { propietarios, totales } = recalcularTotales(
          prev.propietarios,
          nuevosMov
        );

        return {
          ...prev,
          movimientos: nuevosMov,
          propietarios,
          totales,
        };
      });
    },
    [setData]
  );

  // ===============================
  // ELIMINAR MOVIMIENTO
  // ===============================
  const deleteMovimiento = useCallback(
    (id) => {
      setData((prev) => {
        const nuevosMov = prev.movimientos.filter((m) => m.id !== id);

        const { propietarios, totales } = recalcularTotales(
          prev.propietarios,
          nuevosMov
        );

        return {
          ...prev,
          movimientos: nuevosMov,
          propietarios,
          totales,
        };
      });
    },
    [setData]
  );

  return {
    movimientos,
    addMovimiento,
    updateMovimiento,
    deleteMovimiento,
  };
}
