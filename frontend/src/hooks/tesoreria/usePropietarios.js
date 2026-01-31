import { useCallback } from "react";
import { recalcularTotales } from "../../utils/tesoreria/recalcularTotales";

/**
 * Hook para manejar propietarios dentro de una liquidación
 */
export function usePropietarios({ propietarios, movimientos, setData }) {
  // ===============================
  // AGREGAR PROPIETARIO
  // ===============================
  const addPropietario = useCallback(() => {
    setData((prev) => {
      const nuevo = {
        id: Date.now(),
        nombre: "",
        piso: "",
        dpto: "",
        expensaMes: 0,
        montoAbonado: 0,
        expensaAdeudada: 0,
      };

      const nuevosProp = [...prev.propietarios, nuevo];

      const { propietarios: propsActualizados, totales } =
        recalcularTotales(nuevosProp, movimientos);

      return {
        ...prev,
        propietarios: propsActualizados,
        totales,
      };
    });
  }, [movimientos, setData]);

  // ===============================
  // EDITAR PROPIETARIO
  // ===============================
  const updatePropietario = useCallback(
    (id, campo, valor) => {
      setData((prev) => {
        const nuevosProp = prev.propietarios.map((p) =>
          p.id === id ? { ...p, [campo]: valor } : p
        );

        const { propietarios: propsActualizados, totales } =
          recalcularTotales(nuevosProp, movimientos);

        return {
          ...prev,
          propietarios: propsActualizados,
          totales,
        };
      });
    },
    [movimientos, setData]
  );

  // ===============================
  // ELIMINAR PROPIETARIO
  // ===============================
  const deletePropietario = useCallback(
    (id) => {
      setData((prev) => {
        const nuevosProp = prev.propietarios.filter((p) => p.id !== id);

        const { propietarios: propsActualizados, totales } =
          recalcularTotales(nuevosProp, movimientos);

        return {
          ...prev,
          propietarios: propsActualizados,
          totales,
        };
      });
    },
    [movimientos, setData]
  );

  // ===============================
  // REGISTRAR PAGO
  // ===============================
  const registrarPago = useCallback(
    (id, monto) => {
      setData((prev) => {
        const nuevosProp = prev.propietarios.map((p) =>
          p.id === id
            ? {
                ...p,
                montoAbonado:
                  Number(p.montoAbonado || 0) + Number(monto || 0),
              }
            : p
        );

        const { propietarios: propsActualizados, totales } =
          recalcularTotales(nuevosProp, movimientos);

        return {
          ...prev,
          propietarios: propsActualizados,
          totales,
        };
      });
    },
    [movimientos, setData]
  );

  return {
    addPropietario,
    updatePropietario,
    deletePropietario,
    registrarPago,
  };
}
